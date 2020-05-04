import { WithStyles } from '@material-ui/core';
import UsersStore from 'stores/UsersStore';
import styles from 'assets/jss/Users';

export enum Role {
  admin,
  client,
  guest,
}

export interface User {
  id: number;
  name: string;
  surname: string;
  username: string;
  password: string;
  role: Role;
}

export interface UsersContainerProps extends WithStyles<typeof styles> {
  usersStore: UsersStore;
}

export interface UsersProps extends WithStyles<typeof styles> {
  users: Array<User>;
}
