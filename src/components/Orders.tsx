/* eslint-disable react/prop-types */
import React from 'react';
import {
  Collapse,
  Grid,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  Typography,
  TableBody,
  TableContainer,
  TableSortLabel,
  Button,
  Divider,
  Snackbar,
} from '@material-ui/core';
import Cancel from '@material-ui/icons/Cancel';
import Delete from '@material-ui/icons/Delete';
import Done from '@material-ui/icons/Done';
import Edit from '@material-ui/icons/Edit';
import Send from '@material-ui/icons/Send';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';
import Tooltip from '@material-ui/core/Tooltip';
import { Alert, AlertTitle } from '@material-ui/lab';

import {
  OrderModel,
  OrdersProps,
  Status,
  OrdersPageTableHeadCell,
  TableHeadCellPropType,
} from 'models/Orders';
import { Book } from 'models/Book';
import { getLocalizedDate, stableSort, getComparator } from 'utils/helpers';

const clientShoppingTableHeadCells: Array<OrdersPageTableHeadCell> = [
  {
    orderModelProp: undefined,
    bookProp: 'title',
    label: 'Title',
    align: 'left',
    colSpan: 0,
  },
  {
    orderModelProp: undefined,
    bookProp: 'author',
    label: 'Author',
    align: 'right',
    colSpan: 0,
  },
  {
    orderModelProp: undefined,
    bookProp: 'quantity',
    label: 'Quantity',
    align: 'right',
    colSpan: 0,
  },
  {
    orderModelProp: undefined,
    bookProp: 'publishedDate',
    label: 'Published date',
    align: 'right',
    colSpan: 0,
  },
];
const adminShoppingTableHeadCells: Array<OrdersPageTableHeadCell> = [
  {
    orderModelProp: 'id',
    bookProp: undefined,
    label: 'Order number:',
    align: 'left',
    colSpan: 0,
  },
  {
    orderModelProp: undefined,
    bookProp: 'title',
    label: 'Title',
    align: 'left',
    colSpan: 0,
  },
  {
    orderModelProp: 'clientId',
    bookProp: undefined,
    label: 'Client',
    align: 'right',
    colSpan: 0,
  },
  {
    orderModelProp: undefined,
    bookProp: 'quantity',
    label: 'Quantity',
    align: 'right',
    colSpan: 0,
  },
  {
    orderModelProp: 'date',
    bookProp: undefined,
    label: 'Date',
    align: 'right',
    colSpan: 0,
  },
  {
    orderModelProp: 'status',
    bookProp: undefined,
    label: 'Status',
    align: 'right',
    colSpan: 2,
  },
];
const clientOrderHistoryTableHeadCells: Array<OrdersPageTableHeadCell> = [
  {
    orderModelProp: 'id',
    bookProp: undefined,
    align: 'left',
    colSpan: 0,
    label: 'Order nr.',
  },
  {
    orderModelProp: 'books',
    bookProp: undefined,
    align: 'left',
    colSpan: 0,
    label: 'Books',
  },
  {
    orderModelProp: undefined,
    bookProp: 'quantity',
    align: 'right',
    colSpan: 0,
    label: 'Quantity',
  },
  {
    orderModelProp: 'date',
    bookProp: undefined,
    align: 'right',
    colSpan: 0,
    label: 'Order date',
  },
  {
    orderModelProp: 'status',
    bookProp: undefined,
    align: 'right',
    colSpan: 0,
    label: 'Status',
  },
];
const adminOrderHistoryTableHeadCells: Array<OrdersPageTableHeadCell> = [
  ...clientOrderHistoryTableHeadCells,
];
adminOrderHistoryTableHeadCells.splice(1, 0, {
  orderModelProp: 'clientId',
  bookProp: undefined,
  align: 'left',
  colSpan: 0,
  label: 'Customer',
});

const Orders = (props: OrdersProps): JSX.Element => {
  const {
    newOrders,
    ordersHistory,
    classes,
    isEditMode,
    isAdmin,
    quantityError,
    errorMessage,
    bookToEditId,
    quantity,
    editBook,
    removeBook,
    confirmQuantity,
    cancelEdit,
    cancelOrder,
    confirmOrder,
    sendBooks,
    handleQuantityChange,
    getUserFullname,
    handleSort,
    shoppingTableOrder,
    shoppingTableOrderBy,
    ordersHistoryTableOrder,
    ordersHistoryTableOrderBy,
  } = props;

  const getTableWithoutNewOrders = (): JSX.Element => (
    <TableContainer component={Paper}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Title</TableCell>
            <TableCell align="right">Quantity</TableCell>
            <TableCell align="right">Published date</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell
              colSpan={3}
              size="medium"
              className={classes.contentWrapper}
            >
              <Typography color="textPrimary" align="center" noWrap>
                No orders have been placed yet
              </Typography>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );

  let getShoppingCartTable: JSX.Element = <></>;
  let getHistoryTable: JSX.Element = <></>;

  const noNewOrdersForAdmin = isAdmin && newOrders.length === 0;

  const [newOrder] = newOrders;
  const noOrderForClient = !isAdmin && (newOrder === undefined || newOrder.books.length === 0);

  if (noNewOrdersForAdmin || noOrderForClient) {
    getShoppingCartTable = getTableWithoutNewOrders();
  } else if (!isAdmin) {
    getShoppingCartTable = (
      <>
        <TableContainer component={Paper}>
          <Table aria-label="client-new-orders-table">
            <TableHead>
              <TableRow>
                <TableCell colSpan={4}>
                  <Typography
                    component="h2"
                    variant="h6"
                    color="textPrimary"
                    gutterBottom
                  >
                    Order details
                  </Typography>
                </TableCell>
                <TableCell align="right" />
              </TableRow>
              <TableRow>
                {clientShoppingTableHeadCells.map((headCell) => (
                  <TableCell
                    key={headCell.bookProp}
                    sortDirection={
                      shoppingTableOrderBy === headCell.bookProp
                        ? shoppingTableOrder
                        : false
                    }
                    align={headCell.align}
                  >
                    <TableSortLabel
                      active={shoppingTableOrderBy === headCell.bookProp}
                      direction={
                        shoppingTableOrderBy === headCell.bookProp
                          ? shoppingTableOrder
                          : 'asc'
                      }
                      onClick={(): void => handleSort(headCell.bookProp, true)}
                    >
                      {headCell.label}
                      {shoppingTableOrderBy === headCell.bookProp && (
                        <span className={classes.tableSortIconHidden}>
                          {shoppingTableOrder === 'desc'
                            ? 'sorted descending'
                            : 'sorted ascending'}
                        </span>
                      )}
                    </TableSortLabel>
                  </TableCell>
                ))}
                <TableCell align="right" />
              </TableRow>
            </TableHead>
            <TableBody>
              {stableSort(
                newOrder.books,
                getComparator(
                  shoppingTableOrder,
                  shoppingTableOrderBy as keyof Book,
                ),
              ).map((book) => {
                let TableCellQuantity: JSX.Element = (
                  <TableCell align="right">{book.quantity}</TableCell>
                );

                let TableCellActions: JSX.Element = (
                  <>
                    <Tooltip
                      id="edit-book"
                      title="Change quantity"
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

                if (book.id === bookToEditId && isEditMode) {
                  TableCellQuantity = (
                    <TableCell align="right">
                      <TextField
                        id="quantity"
                        type="number"
                        defaultValue={`${quantity}`}
                        onChange={(
                          e: React.ChangeEvent<HTMLInputElement>,
                        ): void => {
                          let parsedNumber: number | string = parseInt(
                            e.target.value,
                            10,
                          );
                          if (Number.isNaN(parsedNumber)) {
                            parsedNumber = -1;
                          }
                          handleQuantityChange(parsedNumber);
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
                          handleQuantityChange(parsedNumber);
                        }}
                        InputProps={{
                          inputProps: {
                            min: 1,
                            style: { textAlign: 'right' },
                          },
                        }}
                        error={quantityError}
                        required
                      />
                    </TableCell>
                  );

                  TableCellActions = (
                    <>
                      <Tooltip
                        id="finalize-book"
                        title="Confirm quantity"
                        placement="top"
                        classes={{ tooltip: classes.tooltip }}
                      >
                        <IconButton
                          aria-label="Done"
                          className={classes.tableActionButton}
                          onClick={(): void => confirmQuantity()}
                        >
                          <Done className={classes.tableActionButtonIcon} />
                        </IconButton>
                      </Tooltip>
                      <Tooltip
                        id="cancel-edit"
                        title="Cancel editing"
                        placement="top"
                        classes={{ tooltip: classes.tooltip }}
                      >
                        <IconButton
                          aria-label="Cancel"
                          className={classes.tableActionButton}
                          onClick={(): void => cancelEdit()}
                        >
                          <Cancel className={classes.tableActionButtonIcon} />
                        </IconButton>
                      </Tooltip>
                      <Snackbar
                        open={errorMessage !== null}
                        autoHideDuration={6000}
                      >
                        <Alert severity="error">
                          <AlertTitle>An error has occured</AlertTitle>
                          {errorMessage}
                        </Alert>
                      </Snackbar>
                    </>
                  );
                }

                return (
                  <TableRow key={book.id}>
                    <TableCell>{book.title}</TableCell>
                    <TableCell align="right">{book.author}</TableCell>
                    {TableCellQuantity}
                    <TableCell align="right">
                      {getLocalizedDate(new Date(book.publishedDate))}
                    </TableCell>
                    <TableCell align="right">{TableCellActions}</TableCell>
                  </TableRow>
                );
              })}

              <TableRow>
                <TableCell rowSpan={4} />
                <TableCell rowSpan={4} />
                <TableCell rowSpan={4} />
                <TableCell>Order number:</TableCell>
                <TableCell align="right">{newOrder.id}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Total quantity:</TableCell>
                <TableCell align="right">{newOrder.quantity}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Status:</TableCell>
                <TableCell align="right">{Status[newOrder.status]}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell colSpan={2} align="right">
                  <Button
                    onClick={(): void => cancelOrder(newOrder.id)}
                    color="default"
                    variant="outlined"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={confirmOrder}
                    color="secondary"
                    variant="outlined"
                    className={classes.confirmBtn}
                  >
                    Confirm
                  </Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
        <Divider />
      </>
    );
  } else if (isAdmin) {
    getShoppingCartTable = (
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align="left" colSpan={6}>
                <Typography
                  component="h2"
                  variant="h6"
                  color="textPrimary"
                  gutterBottom
                >
                  Client orders
                </Typography>
              </TableCell>
            </TableRow>
            <TableRow>
              {adminShoppingTableHeadCells.map((headCell) => {
                let prop: TableHeadCellPropType = headCell.orderModelProp;
                if (prop === undefined) {
                  prop = headCell.bookProp;
                }

                return (
                  <TableCell
                    key={prop}
                    sortDirection={
                      shoppingTableOrderBy === prop ? shoppingTableOrder : false
                    }
                    colSpan={headCell.colSpan}
                    align={headCell.align}
                  >
                    <TableSortLabel
                      active={shoppingTableOrderBy === prop}
                      direction={
                        shoppingTableOrderBy === prop
                          ? shoppingTableOrder
                          : 'asc'
                      }
                      onClick={(): void => handleSort(prop, true)}
                    >
                      {headCell.label}
                      {shoppingTableOrderBy === prop && (
                        <span className={classes.tableSortIconHidden}>
                          {shoppingTableOrder === 'desc'
                            ? 'sorted descending'
                            : 'sorted ascending'}
                        </span>
                      )}
                    </TableSortLabel>
                  </TableCell>
                );
              })}
            </TableRow>
          </TableHead>
          <TableBody>
            {stableSort(
              newOrders,
              getComparator(
                shoppingTableOrder,
                shoppingTableOrderBy as keyof OrderModel,
              ),
            ).map((order) => {
              const TableCellActions: JSX.Element = (
                <>
                  {order.status === Status.Paid && (
                    <Tooltip
                      id="send-book"
                      title="Send books"
                      placement="top"
                      classes={{ tooltip: classes.tooltip }}
                    >
                      <IconButton
                        aria-label="Edit"
                        className={classes.tableActionButton}
                        onClick={(): void => sendBooks(order.id)}
                      >
                        <Send className={classes.tableActionButtonIcon} />
                      </IconButton>
                    </Tooltip>
                  )}
                  {order.status === Status.New && (
                    <Tooltip
                      id="cancel-book"
                      title="Cancel order"
                      placement="top"
                      classes={{ tooltip: classes.tooltip }}
                    >
                      <IconButton
                        aria-label="cancel"
                        className={classes.tableActionButton}
                        onClick={(): void => cancelOrder(order.id)}
                      >
                        <Cancel className={classes.tableActionButtonIcon} />
                      </IconButton>
                    </Tooltip>
                  )}
                </>
              );
              return (
                <TableRow key={order.id}>
                  <TableCell align="left">{order.id}</TableCell>
                  <TableCell align="left">{order.booksNames}</TableCell>
                  <TableCell align="right">
                    {getUserFullname(order.clientId)}
                  </TableCell>
                  <TableCell align="right">{order.quantity}</TableCell>
                  <TableCell align="right">
                    {getLocalizedDate(new Date(order.date))}
                  </TableCell>
                  <TableCell align="right">{TableCellActions}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    );
  }

  const isOrdersHistoryPresent = ordersHistory && ordersHistory.length > 0;
  if (isOrdersHistoryPresent) {
    let tableHeadCells = clientOrderHistoryTableHeadCells;
    if (isAdmin) {
      tableHeadCells = adminOrderHistoryTableHeadCells;
    }
    getHistoryTable = (
      <Collapse in={isOrdersHistoryPresent} timeout="auto" unmountOnExit>
        <TableContainer component={Paper}>
          <Table aria-label="client-order-history-table">
            <TableHead>
              <TableRow>
                <TableCell colSpan={isAdmin ? 6 : 5}>
                  <Typography
                    component="h2"
                    variant="h6"
                    color="textPrimary"
                    gutterBottom
                  >
                    Orders history
                  </Typography>
                </TableCell>
              </TableRow>
              <TableRow>
                {tableHeadCells.map((headCell) => {
                  let prop: TableHeadCellPropType = headCell.orderModelProp;
                  if (prop === undefined) {
                    prop = headCell.bookProp;
                  }

                  return (
                    <TableCell
                      key={prop}
                      sortDirection={
                        ordersHistoryTableOrderBy === prop
                          ? ordersHistoryTableOrder
                          : false
                      }
                      align={headCell.align}
                    >
                      <TableSortLabel
                        active={ordersHistoryTableOrderBy === prop}
                        direction={
                          ordersHistoryTableOrderBy === prop
                            ? ordersHistoryTableOrder
                            : 'asc'
                        }
                        onClick={(): void => handleSort(prop, false)}
                      >
                        {headCell.label}
                        {ordersHistoryTableOrderBy === prop && (
                          <span className={classes.tableSortIconHidden}>
                            {shoppingTableOrder === 'desc'
                              ? 'sorted descending'
                              : 'sorted ascending'}
                          </span>
                        )}
                      </TableSortLabel>
                    </TableCell>
                  );
                })}
              </TableRow>
            </TableHead>
            <TableBody>
              {stableSort(
                ordersHistory,
                getComparator(
                  ordersHistoryTableOrder,
                  ordersHistoryTableOrderBy as keyof OrderModel,
                ),
              ).map((order) => (
                <TableRow key={order.id}>
                  <TableCell align="left">{order.id}</TableCell>
                  {isAdmin && (
                    <TableCell align="left">
                      {getUserFullname(order.clientId)}
                    </TableCell>
                  )}
                  <TableCell align="left">{order.booksNames}</TableCell>
                  <TableCell align="right">{order.quantity}</TableCell>
                  <TableCell align="right">
                    {getLocalizedDate(new Date(order.date))}
                  </TableCell>
                  <TableCell align="right">{Status[order.status]}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Collapse>
    );
  }

  return (
    <Grid spacing={3} justify="center" container>
      <Grid item xs={9}>
        {getShoppingCartTable}
      </Grid>
      <Grid item xs={12}>
        {getHistoryTable}
      </Grid>
    </Grid>
  );
};

export default Orders;
