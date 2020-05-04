import { WithStyles } from '@material-ui/core';
import { MaterialUiPickersDate } from '@material-ui/pickers/typings/date';

import BookStore from 'stores/BookStore';
import AuthStore from 'stores/AuthStore';
import { Book } from 'models/Book';
import { Role } from 'models/Users';
import styles from 'assets/jss/HomePage';
import OrdersStore from 'stores/OrdersStore';

interface HomePageErrorsModel {
  title: boolean;
  author: boolean;
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
}

export interface HomePageProps extends WithStyles<typeof styles> {
  books: Array<Book>;
  bookToEditId: number;
  bookToEdit: Book;
  errors: HomePageErrorsModel;
  editBook: (book: Book) => void;
  removeBook: (id: number) => void;
  finalizeBook: (book: Book) => void;
  cancelEdit: (refreshBooks: boolean) => void;
  orderBook: (book: Book) => void;
  beginAddingBook: () => void;
  handleInputChange: (value: string, name: string) => void;
  handleDateChange: (date: MaterialUiPickersDate) => void;
  currentUserRole: Role;
}
