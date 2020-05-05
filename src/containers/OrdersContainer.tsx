import React from 'react';
import { inject, observer } from 'mobx-react';
import { withStyles, CircularProgress, Grid } from '@material-ui/core';

import Orders from 'components/Orders';
import { OrdersContainerProps, OrdersContainerState } from 'models/Orders';
import { Book } from 'models/Book';
import styles from 'assets/jss/Orders';
import { Role } from 'models/Users';

@inject('authStore', 'ordersStore', 'bookStore', 'usersStore')
@observer
class OrdersContainer extends React.Component<
  OrdersContainerProps,
  OrdersContainerState
> {
  private errorMessageHandler: NodeJS.Timeout = setTimeout(() => {}, 0);
  constructor(props: OrdersContainerProps) {
    super(props);

    this.editBook = this.editBook.bind(this);
    this.removeBook = this.removeBook.bind(this);
    this.confirmQuantity = this.confirmQuantity.bind(this);
    this.cancelEdit = this.cancelEdit.bind(this);
    this.cancelOrder = this.cancelOrder.bind(this);
    this.confirmOrder = this.confirmOrder.bind(this);
    this.handleQuantityChange = this.handleQuantityChange.bind(this);
    this.sendBooks = this.sendBooks.bind(this);
    this.showErrorMessage = this.showErrorMessage.bind(this);

    this.state = OrdersContainer.getInitialState();
  }

  private static getInitialState(): Readonly<OrdersContainerState> {
    return {
      isEditMode: false,
      bookToEditId: 0,
      quantity: 0,
      quantityError: false,
      errorMessage: null,
    };
  }

  componentDidMount(): void {
    const { ordersStore, authStore, bookStore, usersStore } = this.props;
    usersStore.getAll();
    bookStore.getAll();

    let id;
    if (authStore.currentUserRole === Role.client) {
      id = authStore.currentUser?.id;
    }

    ordersStore.getAll(id);
  }

  componentWillUnmount(): void {
    clearTimeout(this.errorMessageHandler);
  }

  private showErrorMessage(errorMessage: string): void {
    this.setState({ errorMessage }, (): void => {
      this.errorMessageHandler = setTimeout(() => {
        this.setState({ errorMessage: null });
      }, 6000);
    });
  }

  editBook(book: Book): void {
    this.setState({
      isEditMode: true,
      bookToEditId: book.id,
      quantity: book.quantity,
    });
  }

  removeBook(bookId: number): void {
    const { ordersStore } = this.props;
    ordersStore.removeBook(bookId);
  }

  handleQuantityChange(quantity: number): void {
    this.setState((prev) => ({
      ...prev,
      quantity: quantity === -1 ? 0 : quantity,
      quantityError: quantity === -1,
    }));
  }

  confirmQuantity(): void {
    const { ordersStore } = this.props;
    const { bookToEditId, quantity, quantityError } = this.state;

    this.setState({ quantityError: quantity < 1 }, (): void => {
      if (quantityError) {
        this.showErrorMessage('Please check the Quantity field');
        return;
      }

      ordersStore
        .confirmQuantity(bookToEditId, quantity)
        .then(() => this.setState(OrdersContainer.getInitialState()))
        .catch((err) => this.showErrorMessage(err.message));
    });
  }

  cancelEdit(): void {
    const { authStore, ordersStore } = this.props;
    this.setState(OrdersContainer.getInitialState());
    let id;
    if (authStore.currentUserRole === Role.client) {
      id = authStore.currentUser?.id;
    }
    ordersStore.getAll(id);
  }

  cancelOrder(orderId?: number): void {
    const { ordersStore } = this.props;
    ordersStore.cancelOrder(orderId);
  }

  confirmOrder(): void {
    const { ordersStore } = this.props;
    ordersStore.confirmOrder();
  }

  sendBooks(orderId: number): void {
    const { ordersStore } = this.props;
    ordersStore.sendBooks(orderId);
  }

  render(): JSX.Element {
    const { authStore, ordersStore, usersStore, classes } = this.props;
    const {
      isEditMode,
      bookToEditId,
      quantity,
      quantityError,
      errorMessage,
    } = this.state;
    const {
      editBook,
      removeBook,
      handleQuantityChange,
      confirmQuantity,
      cancelEdit,
      cancelOrder,
      confirmOrder,
      sendBooks,
    } = this;

    if (ordersStore.inProgress) {
      return (
        <Grid spacing={3} justify="center" container>
          <Grid item xs={9}>
            <CircularProgress size={80} className={classes.circularProgress} />
          </Grid>
        </Grid>
      );
    }

    const isAdmin = authStore.currentUserRole === Role.admin;
    const { getUserFullname } = usersStore;
    return (
      <Orders
        newOrders={
          isAdmin
            ? ordersStore.allNewClientOrders
            : [ordersStore.currentNewOrder]
        }
        ordersHistory={
          isAdmin ? ordersStore.clientOrdersHistory : ordersStore.ordersHistory
        }
        classes={classes}
        isEditMode={isEditMode}
        isAdmin={isAdmin}
        quantityError={quantityError}
        bookToEditId={bookToEditId}
        quantity={quantity}
        errorMessage={errorMessage}
        editBook={editBook}
        removeBook={removeBook}
        confirmQuantity={confirmQuantity}
        cancelEdit={cancelEdit}
        cancelOrder={cancelOrder}
        confirmOrder={confirmOrder}
        sendBooks={sendBooks}
        handleQuantityChange={handleQuantityChange}
        getUserFullname={getUserFullname}
      />
    );
  }
}

export default withStyles(styles)(OrdersContainer);
