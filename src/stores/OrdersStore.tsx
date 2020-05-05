import { observable, action, runInAction, computed } from 'mobx';

import RootStore from 'stores/RootStore';
import { getItem, setItem } from 'services/storage';
import * as consts from 'consts/storage';
import { OrderModel, Status } from 'models/Orders';
import { Book } from 'models/Book';
import { Role } from 'models/Users';

type rootStore = typeof RootStore;

export default class OrdersStore {
  rootStore: rootStore;
  @observable private orders: Array<OrderModel>;
  @observable inProgress = false;

  constructor(rootStore: rootStore) {
    this.rootStore = rootStore;
    this.orders = [];
    this.proceed = this.proceed.bind(this);
    this.getAll = this.getAll.bind(this);
    this.addOrder = this.addOrder.bind(this);
    this.removeBook = this.removeBook.bind(this);
    this.cancelOrder = this.cancelOrder.bind(this);
    this.confirmOrder = this.confirmOrder.bind(this);
    this.sendBooks = this.sendBooks.bind(this);
    this.updateOrdersStorage = this.updateOrdersStorage.bind(this);
  }

  private updateOrdersStorage(clientId: number): void {
    const preparsedOrders = getItem(consts.ORDERS);
    if (preparsedOrders) {
      let otherUserOrders: Array<OrderModel> = [];

      if (this.rootStore.authStore.currentUserRole === Role.client) {
        otherUserOrders = JSON.parse(preparsedOrders).filter(
          (order: OrderModel) => order.clientId !== clientId,
        );
      }

      setItem(
        consts.ORDERS,
        JSON.stringify([...otherUserOrders, ...this.orders]),
      );
    }
  }

  async proceed(fn: () => void, delay: number): Promise<void> {
    try {
      await new Promise((resolve) => setTimeout(() => resolve(), delay));
      runInAction(() => fn());
    } catch (err) {
      if (process.env.DEBUG) {
        // eslint-disable-next-line no-console
        console.error(err);
      }
    } finally {
      this.inProgress = false;
    }
  }

  @action
  getAll(clientId: number | undefined): void {
    this.inProgress = true;

    const initOrders = (): void => {
      const preparsedOrders: string | null = getItem(consts.ORDERS);
      if (preparsedOrders !== null) {
        this.orders = JSON.parse(preparsedOrders);
        if (clientId !== undefined) {
          this.orders = this.orders.filter(
            (order: OrderModel) => order.clientId === clientId,
          );
        }
      } else {
        throw new Error('No orders have been found in the database.');
      }
    };

    this.proceed(initOrders, 1500);
  }

  @action
  addOrder(clientId: number, book: Book): void {
    this.inProgress = true;

    const resolve = (): void => {
      const isBrandNewBookOrdered = this.allNewOrders.length === 0;
      const [currentNewOrder] = this.allNewOrders;
      const isTheSameOrderedAgain = !isBrandNewBookOrdered
        && currentNewOrder.books.some((addedBook) => addedBook.id === book.id);

      const orderBrandNewBook = (): void => {
        let lastOrderId: string | number | null = getItem(consts.LAST_ORDER_ID);
        if (lastOrderId) {
          lastOrderId = parseInt(lastOrderId, 10) + 1;

          this.orders.push({
            id: lastOrderId,
            books: [
              {
                ...book,
                quantity: 1,
              },
            ],
            clientId,
            date: new Date(Date.now()).toISOString(),
            status: Status.New,
          });
          this.updateOrdersStorage(clientId);
          setItem(consts.LAST_ORDER_ID, lastOrderId.toString());
        } else {
          throw new Error("BE error: 'LAST_ORDER_ID' hasn't been defined");
        }
      };

      const orderNewBookAgain = (): void => {
        const matchedBookIndex = this.allNewOrders[0].books.findIndex(
          (newBook) => newBook.id === book.id,
        );
        this.allNewOrders[0].books[matchedBookIndex].quantity += 1;
      };

      const orderDifferentBook = (): void => {
        this.allNewOrders[0].books.push({
          ...book,
          quantity: 1,
        });
      };

      if (this.rootStore.bookStore.areThereEnoughBooks(book.id, 1)) {
        if (isBrandNewBookOrdered) {
          orderBrandNewBook();
        } else if (isTheSameOrderedAgain) {
          orderNewBookAgain();
          this.updateOrdersStorage(clientId);
        } else {
          orderDifferentBook();
          this.updateOrdersStorage(clientId);
        }
        this.rootStore.bookStore.changeBookQuantity(book.id, -1);
      } else {
        throw new Error('There is not enough books.');
      }
    };

    this.proceed(resolve, 1000);
  }

  @action
  removeBook(bookId: number): void {
    this.inProgress = true;

    const resolve = (): void => {
      const matchedBook = this.currentNewOrder.books.find(
        (book) => book.id === bookId,
      );

      if (matchedBook) {
        this.currentNewOrder.books = this.currentNewOrder.books.filter(
          (book) => book.id !== bookId,
        );

        this.rootStore.bookStore.changeBookQuantity(
          bookId,
          matchedBook.quantity,
        );
        if (this.rootStore.authStore.currentUser) {
          this.updateOrdersStorage(this.rootStore.authStore.currentUser.id);
        }
      } else {
        throw new Error('There is not enough books.');
      }
    };

    this.proceed(resolve, 1000);
  }

  @action
  async confirmQuantity(bookId: number, quantity: number): Promise<void> {
    this.inProgress = true;

    const finish = (): void => {
      const matchedBook = this.currentNewOrder.books.find(
        (book) => book.id === bookId,
      );

      if (
        this.rootStore.bookStore.areThereEnoughBooks(bookId, quantity)
        && matchedBook
      ) {
        this.rootStore.bookStore.changeBookQuantity(
          bookId,
          matchedBook.quantity - quantity,
        );
        matchedBook.quantity = quantity;
        if (this.rootStore.authStore.currentUser) {
          this.updateOrdersStorage(this.rootStore.authStore.currentUser.id);
        }
      } else {
        throw new Error('You have tried ordering more books than there is in the store.');
      }
    };

    await new Promise((resolve) => setTimeout(() => resolve(), 1000));
    return runInAction(() => {
      this.inProgress = false;
      return finish();
    });
  }

  @action
  cancelOrder(orderId?: number): void {
    this.inProgress = true;

    let clientId = 0;
    const resolve = (): void => {
      if (orderId) {
        const order = this.allOrders.find(
          (oldOrder) => oldOrder.id === orderId,
        );
        if (order) {
          order.date = new Date(Date.now()).toISOString();
          order.books.forEach((book) => {
            this.rootStore.bookStore.changeBookQuantity(book.id, book.quantity);
          });
          order.status = Status.Cancelled;
          clientId = order.clientId;
        }
      } else {
        this.currentNewOrder.date = new Date(Date.now()).toISOString();
        this.currentNewOrder.books.forEach((book) => {
          this.rootStore.bookStore.changeBookQuantity(book.id, book.quantity);
        });
        this.currentNewOrder.status = Status.Cancelled;
        clientId = this.currentNewOrder.clientId;
      }

      if (clientId !== 0) {
        this.updateOrdersStorage(clientId);
      } else {
        throw new Error('Unexpected error');
      }
    };

    this.proceed(resolve, 1000);
  }

  @action
  confirmOrder(): void {
    this.inProgress = true;

    const resolve = (): void => {
      const { clientId } = this.currentNewOrder;
      this.currentNewOrder.date = new Date(Date.now()).toISOString();
      this.currentNewOrder.status = Status.Paid;
      this.updateOrdersStorage(clientId);
    };

    this.proceed(resolve, 1000);
  }

  @action
  sendBooks(orderId: number): void {
    this.inProgress = true;

    const resolve = (): void => {
      const order = this.allOrders.find((oldOrder) => oldOrder.id === orderId);
      if (order) {
        const { clientId } = order;
        order.date = new Date(Date.now()).toISOString();
        order.status = Status.Sent;
        this.updateOrdersStorage(clientId);
      }
    };

    this.proceed(resolve, 1000);
  }

  @computed
  get allOrders(): Array<OrderModel> {
    return this.orders.slice().sort((orderA, orderB) => orderB.id - orderA.id);
  }

  @computed
  get allNewOrders(): Array<OrderModel> {
    return this.allOrders.filter((order) => order.status === Status.New);
  }

  @computed
  get allNewClientOrders(): Array<OrderModel> {
    return this.allOrders.filter(
      (order) => order.status === Status.New || order.status === Status.Paid,
    );
  }

  @computed
  get ordersHistory(): Array<OrderModel> {
    return this.allOrders.filter((order) => order.status !== Status.New);
  }

  @computed
  get clientOrdersHistory(): Array<OrderModel> {
    return this.allOrders.filter(
      (order) => order.status !== Status.New && order.status !== Status.Paid,
    );
  }

  @computed
  get currentNewOrder(): OrderModel {
    return this.allOrders.filter((order) => order.status === Status.New)[0];
  }
}
