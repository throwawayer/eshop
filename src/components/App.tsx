import React from 'react';
import { NavLink } from 'react-router-dom';
import DateFnsUtils from '@date-io/date-fns';
import {
  ThemeProvider,
  CssBaseline,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Drawer,
  ListItemText,
  ListItemIcon,
  MenuItem,
  MenuList,
  Container,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
} from '@material-ui/core';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import MenuIcon from '@material-ui/icons/Menu';
import { Alert, AlertTitle } from '@material-ui/lab';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';

import Routes from 'router/routes';
import { theme } from 'assets/jss/App';
import { AppProps } from 'models/App';
import { Role } from 'models/Users';

const App = (props: AppProps): JSX.Element => {
  const {
    children,
    classes,
    toggleDrawer,
    toggleDialog,
    signIn,
    handleDialogInputChange,
    deauthenticate,
    username,
    password,
    errors,
    appBarClasses,
    drawerIconClasses,
    drawerClasses,
    errorMessage,
    isDrawerOpen,
    isDialogOpen,
    currentUserRole,
    fullName,
  } = props;
  const authButton: JSX.Element = currentUserRole === Role.guest
    ? (
      <Button
        variant="text"
        color="inherit"
        size="small"
        onClick={toggleDialog}
      >
        Sign in
      </Button>
    ) : (
      <Button
        variant="text"
        color="inherit"
        size="small"
        onClick={deauthenticate}
      >
        Sign out
      </Button>
    );
  return (
    <ThemeProvider theme={theme}>
      <div className={classes.root}>
        <CssBaseline />
        <AppBar position="absolute" className={appBarClasses}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={toggleDrawer}
              className={drawerIconClasses}
            >
              <MenuIcon />
            </IconButton>
            <Grid container spacing={1} alignItems="center">
              <Grid item xs={currentUserRole === Role.guest ? true : 4}>
                <Typography
                  component="h1"
                  variant="h6"
                  color="inherit"
                  align={currentUserRole === Role.guest ? 'center' : 'left'}
                  className={classes.title}
                  noWrap
                >
                  Book eshop
                </Typography>
              </Grid>
              {currentUserRole !== Role.guest && (
                <Grid item xs>
                  <Typography
                    component="h1"
                    variant="h6"
                    color="inherit"
                    className={classes.title}
                    noWrap
                  >
                    Welcome back,&nbsp;
                    {fullName}
                  </Typography>
                </Grid>
              )}
              <Grid item>{authButton}</Grid>
            </Grid>
          </Toolbar>
        </AppBar>
        <Drawer
          variant="permanent"
          classes={{ paper: drawerClasses }}
          open={isDrawerOpen}
        >
          <nav className={classes.drawer}>
            <span className={classes.toolbarIcon}>
              <IconButton onClick={toggleDrawer}>
                <ChevronLeftIcon />
              </IconButton>
            </span>
            <Divider />
            <MenuList>
              {Routes.map(
                (route) =>
                  ((currentUserRole === Role.admin && route.isAdminOnly)
                  || (currentUserRole === Role.guest && !route.isRegisteredOnly)
                  || (currentUserRole !== Role.guest && !route.isAdminOnly))
                  && (
                    <NavLink
                      to={route.path as string}
                      key={route.sidebarName}
                      className={classes.navLink}
                    >
                      <MenuItem>
                        <ListItemIcon>
                          <route.icon />
                        </ListItemIcon>
                        <ListItemText primary={route.sidebarName} />
                      </MenuItem>
                    </NavLink>
                  ),
              )}
            </MenuList>
            <Divider />
          </nav>
        </Drawer>
        <div className={classes.content}>
          <div className={classes.appBarSpacer} />
          <Container maxWidth="lg" className={classes.container}>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              {children}
            </MuiPickersUtilsProvider>
          </Container>
        </div>
        <Dialog
          open={isDialogOpen}
          onClose={toggleDialog}
          aria-labelledby="loginDialog"
        >
          <form onSubmit={signIn} noValidate>
            <DialogTitle id="loginDialog">Sign in</DialogTitle>
            <DialogContent>
              {errorMessage !== null && (
                <Alert variant="outlined" severity="error">
                  <AlertTitle>An error has occured</AlertTitle>
                  {errorMessage}
                </Alert>
              )}
              <TextField
                id="username"
                label="Username"
                type="text"
                margin="dense"
                defaultValue={username}
                onChange={(e: React.ChangeEvent<HTMLInputElement>): void =>
                  handleDialogInputChange(e.target.value, 'username')
                }
                onBlur={(
                  e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
                ): void => handleDialogInputChange(e.target.value, 'username')}
                error={errors.username}
                autoFocus
                fullWidth
                required
              />
              <TextField
                id="password"
                label="Password"
                type="password"
                margin="dense"
                defaultValue={password}
                onChange={(e: React.ChangeEvent<HTMLInputElement>): void =>
                  handleDialogInputChange(e.target.value, 'password')
                }
                onBlur={(
                  e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
                ): void => handleDialogInputChange(e.target.value, 'password')}
                error={errors.password}
                fullWidth
                required
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={toggleDialog} color="secondary">
                Cancel
              </Button>
              <Button color="secondary" type="submit">
                Sign in
              </Button>
            </DialogActions>
          </form>
        </Dialog>
      </div>
    </ThemeProvider>
  );
};

export default App;
