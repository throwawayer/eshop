import { WithStyles } from '@material-ui/core';
import { MaterialUiPickersDate } from '@material-ui/pickers/typings/date';

import BookStore from 'stores/BookStore';
import AuthStore from 'stores/AuthStore';
import OrdersStore from 'stores/OrdersStore';
import { Book } from 'models/Book';
import { Role } from 'models/Users';
import styles from 'assets/jss/HomePage';
import { Order } from 'utils/helpers';

interface HomePageErrorsModel {
  title: boolean;
  author: boolean;
  quantity: boolean;
}

export interface HomePageContainerProps extends WithStyles<typeof styles> {
  bookStore: BookStore;
  authStore: AuthStore;
  ordersStore: OrdersStore;
}

export interface HomePageContainerState {
  bookToEditId: number;
  bookToEdit: Book;
  errors: HomePageErrorsModel;
  errorMessage: string | null;
  order: Order;
  orderBy: keyof Book;
}

export interface HomePageProps extends WithStyles<typeof styles> {
  books: Array<Book>;
  bookToEditId: number;
  bookToEdit: Book;
  errors: HomePageErrorsModel;
  errorMessage: string | null;
  editBook: (book: Book) => void;
  removeBook: (id: number) => void;
  finalizeBook: (book: Book) => void;
  cancelEdit: (refreshBooks: boolean) => void;
  orderBook: (book: Book) => void;
  beginAddingBook: () => void;
  handleInputChange: (value: string | number, name: string) => void;
  handleDateChange: (date: MaterialUiPickersDate) => void;
  handleSort: (property: keyof Book) => void;
  currentUserRole: Role;
  order: Order;
  orderBy: keyof Book;
}

export interface HomePageTableHeadCell {
  id: keyof Book;
  label: string;
}
