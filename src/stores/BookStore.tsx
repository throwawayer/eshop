import { action, computed, observable, runInAction } from 'mobx';
import { Book } from 'models/Book';
import { getItem, setItem } from 'services/storage';
import * as consts from 'consts/storage';

export default class BookStore {
  @observable books: Array<Book>;
  @observable inProgress = false;

  constructor() {
    this.books = [];
    this.getAll = this.getAll.bind(this);
    this.addBook = this.addBook.bind(this);
    this.removeBook = this.removeBook.bind(this);
    this.updateBook = this.updateBook.bind(this);
    this.isBookAmountEnough = this.isBookAmountEnough.bind(this);
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
  getAll(): void {
    this.inProgress = true;

    const resolve = (): void => {
      const preparsedBooks: string | null = getItem(consts.BOOKS);
      if (preparsedBooks !== null) {
        this.books = JSON.parse(preparsedBooks);
      } else {
        throw new Error(
          'No books have been seeded in the database, try opening the app in a new tab again.',
        );
      }
    };

    this.proceed(resolve, 1500);
  }

  @action
  addBook(newBook: Book): void {
    this.inProgress = true;

    const resolve = (): void => {
      let lastBookId: string | number | null = getItem(consts.LAST_BOOK_ID);
      if (lastBookId) {
        lastBookId = parseInt(lastBookId, 10) + 1;
        this.books = this.books.filter((book) => book.id !== -1);
        this.books.push({
          ...newBook,
          id: lastBookId,
          publishedDate: new Date(Date.now()).toISOString(),
        });
        setItem(consts.BOOKS, JSON.stringify(this.books));
        setItem(consts.LAST_BOOK_ID, lastBookId.toString());
      } else {
        throw new Error("BE error: 'LAST_BOOK_ID' hasn't been defined");
      }
    };

    this.proceed(resolve, 1000);
  }

  @action
  removeBook(id: number): void {
    this.inProgress = true;

    const resolve = (): void => {
      this.books = this.books.filter((book) => book.id !== id);
      setItem(consts.BOOKS, JSON.stringify(this.books));
    };

    this.proceed(resolve, 1000);
  }

  @action
  updateBook(newBook: Book): void {
    this.inProgress = true;
    const resolve = (): void => {
      this.books = this.books.filter((book) => book.id !== newBook.id);
      this.books.push(newBook);
      setItem(consts.BOOKS, JSON.stringify(this.books));
    };

    this.proceed(resolve, 1000);
  }

  @action
  beginAddingBook(): void {
    this.books.push({
      id: -1,
      author: '',
      publishedDate: new Date(Date.now()).toISOString(),
      quantity: 0,
      title: '',
    });
  }

  @action
  changeBookQuantity(bookId: number, amount: number): void {
    this.inProgress = true;

    const resolve = (): void => {
      const matchedBookIndex = this.allBooks.findIndex(
        (book) => book.id === bookId,
      );

      this.books[matchedBookIndex].quantity += amount;
      setItem(consts.BOOKS, JSON.stringify(this.books));
    };

    this.proceed(resolve, 1000);
  }

  isBookAmountEnough(bookId: number, amount: number): boolean {
    const matchedBookIndex = this.allBooks.findIndex(
      (book) => book.id === bookId,
    );

    if (Math.sign(amount)) {
      return true;
    }
    return this.books[matchedBookIndex].quantity - amount >= 0;
  }

  @computed
  get allBooks(): Array<Book> {
    if (this.books.length === 0) {
      this.getAll();
    }

    return this.books.sort((bookA, bookB) => bookA.id - bookB.id);
  }
}
