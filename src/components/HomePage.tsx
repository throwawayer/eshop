/* eslint-disable operator-linebreak */
import React from 'react';
import {
  Paper,
  Grid,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableSortLabel,
  Button,
  Snackbar,
} from '@material-ui/core';
import Add from '@material-ui/icons/Add';
import Close from '@material-ui/icons/Close';
import Delete from '@material-ui/icons/Delete';
import Done from '@material-ui/icons/Done';
import Edit from '@material-ui/icons/Edit';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';
import Tooltip from '@material-ui/core/Tooltip';
import { Alert, AlertTitle } from '@material-ui/lab';
import { KeyboardDatePicker } from '@material-ui/pickers';

import { HomePageProps, HomePageTableHeadCell } from 'models/HomePage';
import { Role } from 'models/Users';
import { getLocalizedDate, stableSort, getComparator } from 'utils/helpers';

const tableHeadCells: Array<HomePageTableHeadCell> = [
  { id: 'title', label: 'Title' },
  { id: 'author', label: 'Author' },
  { id: 'publishedDate', label: 'Published date' },
  { id: 'quantity', label: 'Quantity' },
];

const HomePage = (props: HomePageProps): JSX.Element => {
  const {
    classes,
    books,
    bookToEditId,
    bookToEdit,
    editBook,
    errors,
    errorMessage,
    removeBook,
    finalizeBook,
    cancelEdit,
    orderBook,
    beginAddingBook,
    handleInputChange,
    handleDateChange,
    handleSort,
    currentUserRole,
    order,
    orderBy,
  } = props;

  const TableBodyContent: JSX.Element = (
    <>
      {stableSort(books, getComparator(order, orderBy)).map((book) => {
        let NonEditModeActions = null;
        if (currentUserRole === Role.client) {
          NonEditModeActions = (
            <Tooltip
              id="order-book"
              title={`Order '${book.title}'`}
              placement="top"
              classes={{ tooltip: classes.tooltip }}
            >
              <IconButton
                aria-label="Order"
                className={classes.tableActionButton}
                onClick={(): void => orderBook(book)}
              >
                <Add className={classes.tableActionButtonIcon} />
              </IconButton>
            </Tooltip>
          );
        } else if (currentUserRole === Role.admin) {
          NonEditModeActions = (
            <>
              <Tooltip
                id="edit-book"
                title={`Edit '${book.title}'`}
                placement="top"
                classes={{ tooltip: classes.tooltip }}
              >
                <IconButton
                  aria-label="Edit"
                  className={classes.tableActionButton}
                  onClick={(): void => editBook(book)}
                >
                  <Edit className={classes.tableActionButtonIcon} />
                </IconButton>
              </Tooltip>
              <Tooltip
                id="remove-book"
                title={`Remove '${book.title}'`}
                placement="top"
                classes={{ tooltip: classes.tooltip }}
              >
                <IconButton
                  aria-label="Remove"
                  className={classes.tableActionButton}
                  onClick={(): void => removeBook(book.id)}
                >
                  <Delete className={classes.tableActionButtonIcon} />
                </IconButton>
              </Tooltip>
            </>
          );
        }

        const tableBody =
          book.id !== bookToEditId ? (
            <TableRow key={book.id}>
              <TableCell>{book.title}</TableCell>
              <TableCell>{book.author}</TableCell>
              <TableCell>
                {getLocalizedDate(new Date(book.publishedDate))}
              </TableCell>
              <TableCell>{book.quantity}</TableCell>
              <TableCell>{NonEditModeActions}</TableCell>
            </TableRow>
          ) : (
            <TableRow key={book.id}>
              <TableCell>
                <TextField
                  id="title"
                  defaultValue={`${bookToEdit.title}`}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>): void =>
                    handleInputChange(e.target.value, 'title')
                  }
                  onBlur={(
                    e: React.ChangeEvent<
                      HTMLInputElement | HTMLTextAreaElement
                    >,
                  ): void => handleInputChange(e.target.value, 'title')}
                  error={errors.title}
                  required
                />
              </TableCell>
              <TableCell>
                <TextField
                  id="author"
                  defaultValue={`${bookToEdit.author}`}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>): void =>
                    handleInputChange(e.target.value, 'author')
                  }
                  onBlur={(
                    e: React.ChangeEvent<
                      HTMLInputElement | HTMLTextAreaElement
                    >,
                  ): void => handleInputChange(e.target.value, 'author')}
                  error={errors.author}
                  required
                />
              </TableCell>
              <TableCell>
                <KeyboardDatePicker
                  variant="inline"
                  format="dd.MM.yyyy"
                  margin="normal"
                  id="publishedDate"
                  className={classes.datePicker}
                  value={bookToEdit.publishedDate}
                  onChange={handleDateChange}
                  KeyboardButtonProps={{
                    'aria-label': 'change date',
                  }}
                  disableToolbar
                  autoOk
                />
              </TableCell>
              <TableCell>
                <TextField
                  id="quantity"
                  type="number"
                  defaultValue={`${bookToEdit.quantity}`}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>): void => {
                    let parsedNumber: number | string = parseInt(
                      e.target.value,
                      10,
                    );
                    if (Number.isNaN(parsedNumber)) {
                      parsedNumber = -1;
                    }
                    handleInputChange(parsedNumber, 'quantity');
                  }}
                  onBlur={(
                    e: React.ChangeEvent<
                      HTMLInputElement | HTMLTextAreaElement
                    >,
                  ): void => {
                    let parsedNumber: number | string = parseInt(
                      e.target.value,
                      10,
                    );
                    if (Number.isNaN(parsedNumber)) {
                      parsedNumber = -1;
                    }
                    handleInputChange(parsedNumber, 'quantity');
                  }}
                  InputProps={{ inputProps: { min: 0 } }}
                  error={errors.quantity}
                  required
                />
              </TableCell>
              <TableCell>
                {currentUserRole === Role.admin && (
                  <>
                    <Tooltip
                      id="update-book"
                      title={`${
                        bookToEditId === -1
                          ? 'Add new book'
                          : `Update '${bookToEdit.title}'`
                      }`}
                      placement="top"
                      classes={{ tooltip: classes.tooltip }}
                    >
                      <IconButton
                        aria-label="Update"
                        className={classes.tableActionButton}
                        onClick={(): void => finalizeBook(book)}
                      >
                        <Done className={classes.tableActionButtonIcon} />
                      </IconButton>
                    </Tooltip>
                    <Tooltip
                      id="cancel-book"
                      title={`Cancel editing ${
                        bookToEditId === -1 ? '' : `'${bookToEdit.title}'`
                      }`}
                      placement="top"
                      classes={{ tooltip: classes.tooltip }}
                    >
                      <IconButton
                        aria-label="Cancel"
                        className={classes.tableActionButton}
                        onClick={(): void => cancelEdit(bookToEditId === -1)}
                      >
                        <Close className={classes.tableActionButtonIcon} />
                      </IconButton>
                    </Tooltip>
                  </>
                )}
              </TableCell>
              <Snackbar open={errorMessage !== null} autoHideDuration={6000}>
                <Alert severity="error">
                  <AlertTitle>An error has occured</AlertTitle>
                  {errorMessage}
                </Alert>
              </Snackbar>
            </TableRow>
          );
        return tableBody;
      })}
    </>
  );

  return (
    <Grid container spacing={3}>
      <Grid item xs>
        <Paper className={classes.paper}>
          <Grid container spacing={1}>
            <Grid item xs>
              <Typography
                component="h2"
                variant="h6"
                color="textPrimary"
                gutterBottom
              >
                Books
              </Typography>
            </Grid>
            {currentUserRole === Role.admin && bookToEditId === 0 && (
              <Grid item>
                <Button
                  onClick={beginAddingBook}
                  color="secondary"
                  variant="outlined"
                >
                  Add book
                </Button>
              </Grid>
            )}
          </Grid>
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
                <TableCell />
              </TableRow>
            </TableHead>
            <TableBody>{TableBodyContent}</TableBody>
          </Table>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default HomePage;
