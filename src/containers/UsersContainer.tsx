import React from 'react';
import { inject, observer } from 'mobx-react';
import { withStyles, CircularProgress } from '@material-ui/core';

import styles from 'assets/jss/Users';
import Users from 'components/Users';
import { UsersContainerProps } from 'models/Users';

@inject('usersStore')
@observer
class UsersContainer extends React.Component<UsersContainerProps, {}> {
  componentDidMount(): void {
    const { usersStore } = this.props;
    usersStore.getAll();
  }

  render(): JSX.Element {
    const { usersStore, classes } = this.props;

    if (usersStore.inProgress) {
      return (
        <CircularProgress size={80} className={classes.circularProgress} />
      );
    }

    return <Users users={usersStore.allUsers} classes={classes} />;
  }
}

export default withStyles(styles)(UsersContainer);
