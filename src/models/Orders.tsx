import { WithStyles } from '@material-ui/core';
import AuthStore from 'stores/AuthStore';
import OrdersStore from 'stores/OrdersStore';
import UsersStore from 'stores/UsersStore';
import BookStore from 'stores/BookStore';
import { Book } from 'models/Book';
import styles from 'assets/jss/Orders';

export enum Status {
  New,
  Paid,
  Sent,
  Cancelled,
}

export interface OrderModel {
  id: number;
  books: Array<Book>;
  clientId: number;
  date: string;
  status: Status;
}

export interface OrdersContainerProps extends WithStyles<typeof styles> {
  authStore: AuthStore;
  ordersStore: OrdersStore;
  bookStore: BookStore;
  usersStore: UsersStore;
}

export interface OrdersContainerState {
  isEditMode: boolean;
  bookToEditId: number;
  quantity: number;
  quantityError: boolean;
  errorMessage: string | null;
}

export interface OrdersProps extends WithStyles<typeof styles> {
  newOrders: Array<OrderModel>;
  ordersHistory: Array<OrderModel>;
  isEditMode: boolean;
  isAdmin: boolean;
  quantityError: boolean;
  bookToEditId: number;
  quantity: number;
  errorMessage: string | null;
  editBook: (book: Book) => void;
  removeBook: (bookId: number) => void;
  confirmQuantity: () => void;
  cancelEdit: () => void;
  cancelOrder: (orderId?: number) => void;
  confirmOrder: () => void;
  sendBooks: (orderId: number) => void;
  handleQuantityChange: (quantity: number) => void;
  getUserFullname: (userId: number) => string;
}
