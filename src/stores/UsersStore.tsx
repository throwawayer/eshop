import { observable, action, runInAction, computed } from 'mobx';
import { User } from 'models/Users';
import { getItem } from 'services/storage';
import * as consts from 'consts/storage';

export default class UsersStore {
  @observable users: Array<User>;
  @observable inProgress = false;

  constructor() {
    this.users = [];
    this.getAll = this.getAll.bind(this);
    this.getUserFullname = this.getUserFullname.bind(this);
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
    const initOrders = (): void => {
      const preparsedUsers: string | null = getItem(consts.USERS);
      if (preparsedUsers !== null) {
        this.users = JSON.parse(preparsedUsers);
      } else {
        throw new Error(
          'No books have been seeded in the database, try opening the app in a new tab again.',
        );
      }
    };

    this.proceed(initOrders, 1500);
  }

  getUserFullname(userId: number): string {
    let result = '';
    const user = this.users.find((someUser) => someUser.id === userId);
    if (user) {
      result = `${user.name} ${user.surname}`;
    }
    return result;
  }

  @computed
  get allUsers(): Array<User> {
    return this.users.slice().sort((userA, userB) => userA.id - userB.id);
  }
}
