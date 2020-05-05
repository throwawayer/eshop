import React from 'react';
import { WithStyles } from '@material-ui/core';
import AuthStore from 'stores/AuthStore';
import BookStore from 'stores/BookStore';
import OrdersStore from 'stores/OrdersStore';
import { styles } from 'assets/jss/App';
import { Role } from 'models/Users';

interface AppErrorsModel {
  username: boolean;
  password: boolean;
}

export interface AppContainerProps extends WithStyles<typeof styles> {
  children: React.ReactNode;
  authStore?: AuthStore;
  bookStore?: BookStore;
  ordersStore?: OrdersStore;
}

export interface AppContainerState {
  username: string;
  password: string;
  errors: AppErrorsModel;
  isDrawerOpen: boolean;
  isDialogOpen: boolean;
  errorMessage: string | null;
}

export interface AppProps extends WithStyles<typeof styles> {
  children: React.ReactNode;
  toggleDrawer: () => void;
  appBarClasses: string;
  toggleDialog: () => void;
  signIn: (e: React.FormEvent<HTMLFormElement>) => void;
  handleDialogInputChange: (value: string, name: string) => void;
  deauthenticate: () => void;
  username: string;
  password: string;
  errors: AppErrorsModel;
  drawerIconClasses: string;
  drawerClasses: string;
  errorMessage: string | null;
  isDrawerOpen: boolean;
  isDialogOpen: boolean;
  currentUserRole: Role;
  fullName: string;
}
