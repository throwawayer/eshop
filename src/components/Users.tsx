import React from 'react';
import {
  Grid,
  Paper,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from '@material-ui/core';
import { UsersProps } from 'models/Users';

const Users = (props: UsersProps): JSX.Element => {
  const { users, classes } = props;
  return (
    <Grid container spacing={3}>
      <Grid item xs>
        <Paper className={classes.paper}>
          <Typography
            component="h2"
            variant="h6"
            color="textPrimary"
            gutterBottom
          >
            Users
          </Typography>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Id</TableCell>
                <TableCell>Username</TableCell>
                <TableCell>Firstname</TableCell>
                <TableCell>Lastname</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.id}</TableCell>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.surname}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default Users;
