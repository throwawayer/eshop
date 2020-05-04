import React, { FormEvent } from 'react';
import { inject, observer } from 'mobx-react';
import { withStyles } from '@material-ui/core';
import cx from 'classnames';

import { styles } from 'assets/jss/App';
import App from 'components/App';
import { AppContainerProps, AppContainerState } from 'models/App';
import { Role } from 'models/Users';

@inject('authStore')
@observer
class AppContainer extends React.Component<
  AppContainerProps,
  AppContainerState
> {
  constructor(props: AppContainerProps) {
    super(props);

    this.state = {
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
    this.toggleDrawer = this.toggleDrawer.bind(this);
    this.toggleDialog = this.toggleDialog.bind(this);
    this.signIn = this.signIn.bind(this);
    this.deauthenticate = this.deauthenticate.bind(this);
    this.handleDialogInputChange = this.handleDialogInputChange.bind(this);
  }

  toggleDrawer(): void {
    this.setState(({ isDrawerOpen }) => ({ isDrawerOpen: !isDrawerOpen }));
  }

  toggleDialog(): void {
    this.setState(({ isDialogOpen }) => ({ isDialogOpen: !isDialogOpen }));
  }

  async signIn(e: FormEvent<HTMLFormElement>): Promise<void> {
    e.preventDefault();

    const { authStore } = this.props;
    const { username, password, errors } = this.state;

    if (Object.values(errors).some((error) => error)) {
      return;
    }

    // TODO: form validate before submit
    try {
      if (authStore && (await authStore.authenticate(username, password))) {
        this.toggleDialog();
      }
    } catch (err) {
      this.setState({ errorMessage: err.message }, (): void => {
        setTimeout(() => {
          this.setState({ errorMessage: null });
        }, 6000);
      });
    }
  }

  deauthenticate(): void {
    const { authStore } = this.props;
    if (authStore) {
      authStore.deauthenticate();
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
