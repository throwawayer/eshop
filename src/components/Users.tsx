
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
  TableSortLabel,
} from '@material-ui/core';
import { UsersProps, UsersPageTableHeadCell } from 'models/Users';
import { stableSort, getComparator } from 'utils/helpers';

const tableHeadCells: Array<UsersPageTableHeadCell> = [
  { id: 'id', label: 'Id' },
  { id: 'username', label: 'Username' },
  { id: 'name', label: 'Firstname' },
  { id: 'surname', label: 'Lastname' },
];

const Users = (props: UsersProps): JSX.Element => {
  const { users, classes, order, orderBy, handleSort } = props;
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
                {tableHeadCells.map((headCell) => (
                  <TableCell
                    key={headCell.id}
                    sortDirection={orderBy === headCell.id ? order : false}
                  >
                    <TableSortLabel
                      active={orderBy === headCell.id}
                      direction={orderBy === headCell.id ? order : 'asc'}
                      onClick={(): void => handleSort(headCell.id)}
                    >
                      {headCell.label}
                      {orderBy === headCell.id && (
                        <span className={classes.tableSortIconHidden}>
                          {order === 'desc'
                            ? 'sorted descending'
                            : 'sorted ascending'}
                        </span>
                      )}
                    </TableSortLabel>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {stableSort(users, getComparator(order, orderBy)).map((user) => (
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
