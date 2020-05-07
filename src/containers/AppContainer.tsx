import React, { FormEvent } from 'react';
import { inject, observer } from 'mobx-react';
import { withStyles } from '@material-ui/core';
import cx from 'classnames';

import App from 'components/App';
import { AppContainerProps, AppContainerState } from 'models/App';
import { Role } from 'models/Users';
import { styles } from 'assets/jss/App';

@inject('authStore', 'bookStore', 'ordersStore')
@observer
class AppContainer extends React.Component<
  AppContainerProps,
  Readonly<AppContainerState>
> {
  private errorMessageHandler: NodeJS.Timeout = setTimeout(() => {}, 0);
  constructor(props: AppContainerProps) {
    super(props);

    this.toggleDrawer = this.toggleDrawer.bind(this);
    this.toggleDialog = this.toggleDialog.bind(this);
    this.signIn = this.signIn.bind(this);
    this.deauthenticate = this.deauthenticate.bind(this);
    this.handleDialogInputChange = this.handleDialogInputChange.bind(this);

    this.state = AppContainer.getInitialState();
  }

  private static getInitialState(): Readonly<AppContainerState> {
    return {
      username: '',
      password: '',
      errors: {
        username: false,
        password: false,
      },
      isDrawerOpen: false,
      isDialogOpen: false,
      errorMessage: null,
    };
  }

  componentWillUnmount(): void {
    clearTimeout(this.errorMessageHandler);
  }

  private showErrorMessage(errorMessage: string): void {
    this.setState({ errorMessage }, (): void => {
      this.errorMessageHandler = setTimeout(() => {
        this.setState({ errorMessage: null });
      }, 6000);
    });
  }

  toggleDrawer(): void {
    this.setState(({ isDrawerOpen }) => ({ isDrawerOpen: !isDrawerOpen }));
  }

  toggleDialog(): void {
    this.setState(({ isDialogOpen }) => ({ isDialogOpen: !isDialogOpen }));
  }

  signIn(e: FormEvent<HTMLFormElement>): void {
    e.preventDefault();

    const { username, password } = this.state;

    const errors = {
      username: username === '',
      password: password === '',
    };
    this.setState({ errors }, () => {
      if (Object.values(errors).some((error) => error)) {
        this.showErrorMessage('Username or password are missing.');
        return;
      }

      const { authStore, bookStore, ordersStore } = this.props;
      if (authStore && bookStore && ordersStore) {
        authStore
          .authenticate(username, password)
          .then(() => {
            this.setState(AppContainer.getInitialState());
            let clientId: number | undefined;
            if (authStore.currentUserRole === Role.client) {
              clientId = authStore.currentUser?.id;
            }
            bookStore.getAll();
            ordersStore.getAll(clientId);
          })
          .catch((err) => this.showErrorMessage(err.message));
      }
    });
  }

  deauthenticate(): void {
    const { authStore } = this.props;
    if (authStore) {
      authStore.deauthenticate();
      this.setState({ username: '', password: '' });
    }
  }

  handleDialogInputChange(value: string, name: string): void {
    this.setState((prev) => ({
      ...prev,
      [name]: value,
      errors: {
        ...prev.errors,
        [name]: value === '',
      },
    }));
  }

  render(): JSX.Element {
    const { children, classes, authStore } = this.props;
    const {
      username,
      password,
      errors,
      isDrawerOpen,
      isDialogOpen,
      errorMessage,
    } = this.state;
    const {
      toggleDrawer,
      toggleDialog,
      signIn,
      deauthenticate,
      handleDialogInputChange,
    } = this;

    const appBarClasses = cx(`${classes.appBar}`, {
      [`${classes.appBarShift}`]: isDrawerOpen,
    });
    const drawerIconClasses = cx(`${classes.menuButton}`, {
      [`${classes.menuButtonHidden}`]: isDrawerOpen,
    });
    const drawerClasses = cx(`${classes.drawerPaper}`, {
      [`${classes.drawerPaperClose}`]: !isDrawerOpen,
    });

    let fullName = '';
    let currentUserRole = Role.guest;
    if (authStore) {
      fullName = authStore.currentUserFullName;
      currentUserRole = authStore.currentUserRole;
    }

    return (
      <App
        classes={classes}
        toggleDrawer={toggleDrawer}
        toggleDialog={toggleDialog}
        signIn={signIn}
        deauthenticate={deauthenticate}
        handleDialogInputChange={handleDialogInputChange}
        username={username}
        password={password}
        errors={errors}
        appBarClasses={appBarClasses}
        drawerIconClasses={drawerIconClasses}
        drawerClasses={drawerClasses}
        errorMessage={errorMessage}
        isDrawerOpen={isDrawerOpen}
        isDialogOpen={isDialogOpen}
        currentUserRole={currentUserRole}
        fullName={fullName}
      >
        {children}
      </App>
    );
  }
}

export default withStyles(styles)(AppContainer);
