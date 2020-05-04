import AuthStore from 'stores/AuthStore';
import BookStore from 'stores/BookStore';
import OrdersStore from 'stores/OrdersStore';
import UsersStore from 'stores/UsersStore';

interface RootStoreModel {
  authStore: AuthStore;
  bookStore: BookStore;
  ordersStore: OrdersStore;
  usersStore: UsersStore;
}

class RootStore implements RootStoreModel {
  authStore: AuthStore;
  bookStore: BookStore;
  ordersStore: OrdersStore;
  usersStore: UsersStore;

  constructor() {
    this.authStore = new AuthStore();
    this.bookStore = new BookStore();
    this.ordersStore = new OrdersStore(this);
    this.usersStore = new UsersStore();
  }
}

export default new RootStore();
