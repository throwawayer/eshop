import { WithStyles } from '@material-ui/core';
import AuthStore from 'stores/AuthStore';
import OrdersStore from 'stores/OrdersStore';
import UsersStore from 'stores/UsersStore';
import styles from 'assets/jss/Orders';
import { Book } from 'models/Book';
import { Role } from 'models/Users';

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
  usersStore: UsersStore;
}

export interface OrdersContainerState {
  isEditMode: boolean;
  bookToEditId: number;
  quantity: number;
}

export interface OrdersProps extends WithStyles<typeof styles> {
  currentNewOrder: OrderModel;
  newOrders: Array<OrderModel>;
  isEditMode: boolean;
  isAdmin: boolean;
  bookToEditId: number;
  quantity: number;
  editBook: (book: Book) => void;
  removeBook: (bookId: number) => void;
  confirmQuantity: () => void;
  cancelEdit: () => void;
  cancelOrder: (orderId?: number) => void;
  confirmOrder: () => void;
  sendBooks: (orderId: number) => void;
  handleQuantityChange: (quantity: number) => void;
  currentUserRole: Role;
  ordersHistory: Array<OrderModel>;
  getUserFullname: (userId: number) => string;
}
