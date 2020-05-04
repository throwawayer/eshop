import {
  action,
  observable,
  runInAction,
  computed,
  reaction,
  toJS,
} from 'mobx';
import { getItem, setItem } from 'services/storage';
import * as consts from 'consts/storage';
import { User, Role } from 'models/Users';

export default class AuthStore {
  @observable private user: User | null = null;

  constructor() {
    this.hydrate();
    this.registerReactions();

    this.authenticate = this.authenticate.bind(this);
    this.deauthenticate = this.deauthenticate.bind(this);
  }

  hydrate(): void {
    const preparsedUser = getItem(consts.USER);
    if (preparsedUser) {
      this.user = JSON.parse(preparsedUser);
    }
  }

  registerReactions(): void {
    reaction(
      () => toJS(this.user),
      (json) => {
        setItem(consts.USER, JSON.stringify(json));
      },
    );
  }

  static async proceed(fn: () => boolean, delay: number): Promise<boolean> {
    let requestFinished = false;
    await new Promise((resolve) => setTimeout(() => resolve(), delay));

    runInAction(() => {
      requestFinished = fn();
    });

    return requestFinished;
  }

  @action
  authenticate(username: string, password: string): Promise<boolean> {
    const initCurrentUser = (): boolean => {
      const preparsedUsers: string | null = getItem(consts.USERS);
      if (preparsedUsers !== null) {
        const users: Array<User> = JSON.parse(preparsedUsers);
        const matchedUser: User | undefined = users.find(
          (user) => user.username === username && user.password === password,
        );

        if (matchedUser === undefined) {
          throw new Error('No user with such credentials has been found.');
        }

        this.user = matchedUser;

        return true;
      }

      throw new Error(
        'No users have been seeded in the database, try opening the app in a new tab again.',
      );
    };

    return AuthStore.proceed(initCurrentUser, 1000);
  }

  @action
  deauthenticate(): void {
    AuthStore.proceed((): boolean => {
      this.user = null;
      return true;
    }, 1000);
  }

  @computed
  get currentUserRole(): Role {
    if (this.user === null) {
      return Role.guest;
    }

    return this.user.role;
  }

  @computed
  get currentUserFullName(): string {
    if (this.user === null) {
      return '';
    }

    return `${this.user.name} ${this.user.surname}`;
  }

  @computed
  get currentUser(): User | null {
    return this.user;
  }
}
