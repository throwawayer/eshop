import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
  RouteProps,
} from 'react-router-dom';
import { hot } from 'react-hot-loader';

import Routes from 'router/routes';
import AppContainer from 'containers/AppContainer';

export default hot(module)(() => (
  <Router>
    <AppContainer>
      <Switch>
        {Routes.map((route: RouteProps) => (
          <Route
            exact={route.exact}
            path={route.path}
            component={route.component}
          />
        ))}
        <Route render={(): JSX.Element => <Redirect to="/" />} />
      </Switch>
    </AppContainer>
  </Router>
));
