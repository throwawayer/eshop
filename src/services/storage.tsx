import {
  BOOKS,
  ORDERS,
  USERS,
  names,
  surnames,
  bookTitles,
  LAST_BOOK_ID,
  LAST_ORDER_ID,
} from 'consts/storage';
import { Book } from 'models/Book';
import { getRandomNumber } from 'utils/helpers';
import { User, Role } from 'models/Users';

const storage: Storage = window.localStorage;

export const setItem = (key: string, value: string): void =>
  storage.setItem(key, value);

export const getItem = (key: string): string | null => storage.getItem(key);

export const clear = (): void => storage.clear();

export const initStorage = (): void => {
  const storagedBooks: string | null = storage.getItem(BOOKS);
  if (storagedBooks === null || JSON.parse(storagedBooks).length === 0) {
    const books: Array<Book> = [];
    const maxBooks = getRandomNumber(5, 12);

    let title = '';
    let author = '';
    const takenAuthors: Array<string> = [];
    const takenTitles: Array<string> = [];
    for (let i = 0; i < maxBooks; i += 1) {
      let isUniqueValue = false;
      while (!isUniqueValue) {
        title = bookTitles[getRandomNumber(0, bookTitles.length - 1)];
        if (!takenTitles.includes(title)) {
          takenTitles.push(title);
          isUniqueValue = true;
        }
      }
      isUniqueValue = false;
      while (!isUniqueValue) {
        author = `${names[getRandomNumber(0, names.length - 1)]} ${
          surnames[getRandomNumber(0, surnames.length - 1)]
        }`;
        if (!takenAuthors.includes(author)) {
          takenAuthors.push(author);
          isUniqueValue = true;
        }
      }

      books.push({
        id: i + 1,
        publishedDate: new Date(
          getRandomNumber(1920, 2000),
          getRandomNumber(0, 11),
          getRandomNumber(0, 29),
        ).toISOString(),
        quantity: getRandomNumber(5, 50),
        title,
        author,
      });
    }
    setItem(BOOKS, JSON.stringify(books));
    setItem(LAST_BOOK_ID, maxBooks.toString());
  }

  const storagedUsers: string | null = storage.getItem(USERS);
  if (storagedUsers === null || JSON.parse(storagedUsers).length === 0) {
    const clients: Array<User> = [];
    for (let i = 0; i < getRandomNumber(2, 5); i += 1) {
      clients.push({
        id: i + 2,
        name: names[getRandomNumber(0, names.length - 1)],
        password: '0000',
        role: Role.client,
        surname: surnames[getRandomNumber(0, surnames.length - 1)],
        username: `client${i + 1}`,
      });
    }
    const users: Array<User> = [
      {
        id: 1,
        name: names[getRandomNumber(0, names.length - 1)],
        password: '1234',
        role: Role.admin,
        surname: surnames[getRandomNumber(0, surnames.length - 1)],
        username: 'admin',
      },
      ...clients,
    ];
    setItem(USERS, JSON.stringify(users));
  }

  const storagedOrders: string | null = storage.getItem(ORDERS);
  if (storagedOrders === null) {
    setItem(ORDERS, JSON.stringify([]));
    setItem(LAST_ORDER_ID, '0');
  }
};
