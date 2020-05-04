import HomeIcon from '@material-ui/icons/Home';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import PeopleIcon from '@material-ui/icons/People';

import ensureAuthenticated from 'router/routeWrappers';
import HomePageContainer from 'containers/HomePageContainer';
import OrdersContainer from 'containers/OrdersContainer';
import UsersContainer from 'containers/UsersContainer';
import RouteModel from 'models/routes';

const Routes: Array<RouteModel> = [
  {
    path: '/',
    component: HomePageContainer,
    exact: true,
    sidebarName: 'Home',
    icon: HomeIcon,
    isAdminOnly: false,
    isRegisteredOnly: false,
  },
  {
    path: '/orders',
    component: ensureAuthenticated(OrdersContainer),
    exact: false,
    sidebarName: 'Orders',
    icon: ShoppingCartIcon,
    isAdminOnly: false,
    isRegisteredOnly: true,
  },
  {
    path: '/users',
    component: ensureAuthenticated(UsersContainer),
    exact: false,
    sidebarName: 'Users',
    icon: PeopleIcon,
    isAdminOnly: true,
    isRegisteredOnly: true,
  },
];

export default Routes;
