/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { Redirect } from 'react-router-dom';
import { observer, inject } from 'mobx-react';
import WrapperComponentProps from 'models/routeWrappers';
import { Role } from 'models/Users';

// TODO: specify type
const ensureAuthenticated = <P extends object>(
  WrappedComponent: React.ComponentType<P>,
): any => {
  @inject('authStore')
  @observer
  class WrapperComponent extends React.Component<P & WrapperComponentProps> {
    render(): JSX.Element {
      const { authStore } = this.props;
      if (authStore.currentUserRole === Role.guest) {
        return <Redirect to="/" />;
      }
      return <WrappedComponent authStore={authStore} {...(this.props as P)} />;
    }
  }

  return WrapperComponent;
};

export default ensureAuthenticated;
