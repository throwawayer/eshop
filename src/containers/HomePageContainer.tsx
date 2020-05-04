import React from 'react';
import { inject, observer } from 'mobx-react';
import { withStyles, CircularProgress } from '@material-ui/core';
import { MaterialUiPickersDate } from '@material-ui/pickers/typings/date';

import styles from 'assets/jss/HomePage';
import HomePage from 'components/HomePage';
import {
  HomePageContainerProps,
  HomePageContainerState,
} from 'models/HomePage';
import { Book } from 'models/Book';
import { Role } from 'models/Users';

@inject('authStore', 'bookStore', 'ordersStore')
@observer
class HomePageContainer extends React.Component<
  HomePageContainerProps,
  HomePageContainerState
> {
  constructor(props: HomePageContainerProps) {
    super(props);
    this.editBook = this.editBook.bind(this);
    this.removeBook = this.removeBook.bind(this);
    this.finalizeBook = this.finalizeBook.bind(this);
    this.cancelEdit = this.cancelEdit.bind(this);
    this.orderBook = this.orderBook.bind(this);
    this.beginAddingBook = this.beginAddingBook.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleDateChange = this.handleDateChange.bind(this);

    this.state = HomePageContainer.getInitialState();
  }

  private static getInitialState(): Readonly<HomePageContainerState> {
    return {
      bookToEditId: 0,
      bookToEdit: {
        id: -1,
        title: '',
        author: '',
        publishedDate: new Date(Date.now()).toISOString(),
        quantity: 0,
      },
      errors: {
        title: false,
        author: false,
      },
    };
  }

  componentDidMount(): void {
    const { bookStore, authStore, ordersStore } = this.props;
    bookStore.getAll();
    ordersStore.getAll(authStore.currentUser?.id);
  }

  editBook(book: Book): void {
    this.setState({
      bookToEditId: book.id,
      bookToEdit: {
        ...book,
      },
    });
  }

  removeBook(id: number): void {
    const { bookStore } = this.props;
    bookStore.removeBook(id);
  }

  finalizeBook(): void {
    const { bookStore } = this.props;
    const { bookToEditId, bookToEdit, errors } = this.state;

    if (Object.values(errors).some((error) => error)) {
      return;
    }

    if (bookToEditId === -1) {
      bookStore.addBook(bookToEdit);
    } else {
      bookStore.updateBook(bookToEdit);
    }

    this.setState(HomePageContainer.getInitialState());
  }

  cancelEdit(refreshBooks: boolean): void {
    const { bookStore } = this.props;
    this.setState(HomePageContainer.getInitialState());
    if (refreshBooks) {
      bookStore.getAll();
    }
  }

  orderBook(book: Book): void {
    const { authStore, ordersStore } = this.props;
    if (authStore.currentUserRole === Role.client && authStore.currentUser) {
      ordersStore.addOrder(authStore.currentUser.id, book);
    }
  }

  beginAddingBook(): void {
    const { bookStore } = this.props;
    const { bookToEditId } = this.state;
    if (bookToEditId === 0) {
      bookStore.beginAddingBook();
      this.setState({ bookToEditId: -1 });
    }
  }

  handleInputChange(value: string, name: string): void {
    this.setState(({ bookToEdit, errors }) => ({
      bookToEdit: {
        ...bookToEdit,
        [name]: value,
      },
      errors: {
        ...errors,
        [name]: value === '',
      },
    }));
  }

  handleDateChange(date: MaterialUiPickersDate): void {
    if (date) {
      this.setState(({ bookToEdit }) => ({
        bookToEdit: {
          ...bookToEdit,
          publishedDate: date?.toISOString(),
        },
      }));
    }
  }

  render(): JSX.Element {
    const { bookStore, authStore, classes } = this.props;
    const { bookToEditId, bookToEdit, errors } = this.state;
    const {
      editBook,
      removeBook,
      finalizeBook,
      cancelEdit,
      orderBook,
      beginAddingBook,
      handleInputChange,
      handleDateChange,
    } = this;

    if (bookStore.inProgress) {
      return (
        <CircularProgress size={80} className={classes.circularProgress} />
      );
    }

    return (
      <HomePage
        books={bookStore.allBooks}
        classes={classes}
        bookToEditId={bookToEditId}
        bookToEdit={bookToEdit}
        errors={errors}
        editBook={editBook}
        removeBook={removeBook}
        finalizeBook={finalizeBook}
        cancelEdit={cancelEdit}
        orderBook={orderBook}
        beginAddingBook={beginAddingBook}
        handleInputChange={handleInputChange}
        handleDateChange={handleDateChange}
        currentUserRole={authStore.currentUserRole}
      />
    );
  }
}

export default withStyles(styles)(HomePageContainer);