import React from 'react';
import { inject, observer } from 'mobx-react';
import { withStyles, CircularProgress } from '@material-ui/core';

import styles from 'assets/jss/Users';
import Users from 'components/Users';
import { User, UsersContainerProps, UsersContainerState } from 'models/Users';

@inject('usersStore')
@observer
class UsersContainer extends React.Component<
  UsersContainerProps,
  Readonly<UsersContainerState>
> {
  constructor(props: UsersContainerProps) {
    super(props);
    this.handleSort = this.handleSort.bind(this);
    this.state = { order: 'asc', orderBy: 'id' };
  }
  componentDidMount(): void {
    const { usersStore } = this.props;
    usersStore.getAll();
  }

  handleSort(property: keyof User): void {
    const { orderBy, order } = this.state;
    const isAsc = orderBy === property && order === 'asc';
    this.setState({
      order: isAsc ? 'desc' : 'asc',
      orderBy: property,
    });
  }

  render(): JSX.Element {
    const { usersStore, classes } = this.props;
    const { order, orderBy } = this.state;
    const { handleSort } = this;

    if (usersStore.inProgress) {
      return (
        <CircularProgress size={80} className={classes.circularProgress} />
      );
    }

    return (
      <Users
        users={usersStore.allUsers}
        classes={classes}
        order={order}
        orderBy={orderBy}
        handleSort={handleSort}
      />
    );
  }
}

export default withStyles(styles)(UsersContainer);
