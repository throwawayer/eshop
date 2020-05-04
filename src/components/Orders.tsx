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
  Button,
  Divider,
} from '@material-ui/core';
import Cancel from '@material-ui/icons/Cancel';
import Delete from '@material-ui/icons/Delete';
import Done from '@material-ui/icons/Done';
import Edit from '@material-ui/icons/Edit';
import Send from '@material-ui/icons/Send';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';
import Tooltip from '@material-ui/core/Tooltip';

import { OrdersProps, Status } from 'models/Orders';
import { Role } from 'models/Users';

const Orders = (props: OrdersProps): JSX.Element => {
  const {
    currentNewOrder,
    newOrders,
    classes,
    isEditMode,
    isAdmin,
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
    currentUserRole,
    ordersHistory,
    getUserFullname,
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
  const noOrderForClient = !isAdmin
  && (currentNewOrder === undefined || currentNewOrder.books.length === 0);

  if (noNewOrdersForAdmin || noOrderForClient) {
    getShoppingCartTable = getTableWithoutNewOrders();
  } else if (currentUserRole === Role.client) {
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
                <TableCell>Title</TableCell>
                <TableCell align="right">Author</TableCell>
                <TableCell align="right">Quantity</TableCell>
                <TableCell align="right">Published date</TableCell>
                <TableCell align="right" />
              </TableRow>
            </TableHead>
            <TableBody>
              {currentNewOrder.books.map((book) => {
                let TableCellQuantity: JSX.Element = (
                  <TableCell align="right">{book.quantity}</TableCell>
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
                        ): void =>
                          handleQuantityChange(parseInt(e.target.value, 10))
                        }
                        onBlur={(
                          e: React.ChangeEvent<
                            HTMLInputElement | HTMLTextAreaElement
                          >,
                        ): void =>
                          handleQuantityChange(parseInt(e.target.value, 10))
                        }
                        InputProps={{
                          inputProps: {
                            min: 1,
                            style: { textAlign: 'right' },
                          },
                        }}
                        required
                      />
                    </TableCell>
                  );
                }

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
                    </>
                  );
                }

                return (
                  <TableRow key={book.id}>
                    <TableCell>{book.title}</TableCell>
                    <TableCell align="right">{book.author}</TableCell>
                    {TableCellQuantity}
                    <TableCell align="right">
                      {new Date(book.publishedDate).toLocaleDateString()}
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
                <TableCell align="right">{currentNewOrder.id}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Total quantity:</TableCell>
                <TableCell align="right">
                  {currentNewOrder.books
                    .map((book) => book.quantity)
                    .reduce((a, b) => a + b, 0)}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Status:</TableCell>
                <TableCell align="right">
                  {Status[currentNewOrder.status]}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell colSpan={2} align="right">
                  <Button
                    onClick={(): void => cancelOrder(currentNewOrder.id)}
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
  } else if (currentUserRole === Role.admin) {
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
              <TableCell align="left">Order number:</TableCell>
              <TableCell align="left">Book</TableCell>
              <TableCell align="right">Client</TableCell>
              <TableCell align="right">Date</TableCell>
              <TableCell align="right" colSpan={2}>
                Status
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {newOrders.map((newOrder) => {
              const TableCellActions: JSX.Element = (
                <>
                  {newOrder.status === Status.Paid && (
                    <Tooltip
                      id="send-book"
                      title="Send books"
                      placement="top"
                      classes={{ tooltip: classes.tooltip }}
                    >
                      <IconButton
                        aria-label="Edit"
                        className={classes.tableActionButton}
                        onClick={(): void => sendBooks(newOrder.id)}
                      >
                        <Send className={classes.tableActionButtonIcon} />
                      </IconButton>
                    </Tooltip>
                  )}
                  {newOrder.status === Status.New && (
                    <Tooltip
                      id="cancel-book"
                      title="Cancel order"
                      placement="top"
                      classes={{ tooltip: classes.tooltip }}
                    >
                      <IconButton
                        aria-label="cancel"
                        className={classes.tableActionButton}
                        onClick={(): void => cancelOrder(newOrder.id)}
                      >
                        <Cancel className={classes.tableActionButtonIcon} />
                      </IconButton>
                    </Tooltip>
                  )}
                </>
              );

              let books = '';
              newOrder.books.forEach((book) => {
                books += `${book.title} (${book.author}), `;
              });
              books = books.slice(0, books.length - 2);

              return (
                <TableRow key={newOrder.id}>
                  <TableCell align="left">{newOrder.id}</TableCell>
                  <TableCell align="left">{books}</TableCell>
                  <TableCell align="right">{getUserFullname(newOrder.clientId)}</TableCell>
                  <TableCell align="right">
                    {new Date(newOrder.date).toLocaleDateString()}
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
    getHistoryTable = (
      <Collapse in={isOrdersHistoryPresent} timeout="auto" unmountOnExit>
        <TableContainer component={Paper}>
          <Table aria-label="client-order-history-table">
            <TableHead>
              <TableRow>
                <TableCell colSpan={5}>
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
                <TableCell align="left">Order Nr.</TableCell>
                <TableCell align="left">Customer</TableCell>
                <TableCell align="left">Books</TableCell>
                <TableCell align="right">Quantity</TableCell>
                <TableCell align="right">Published date</TableCell>
                <TableCell align="right">Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {ordersHistory.map((order) => {
                let books = '';
                order.books.forEach((book) => {
                  books += `${book.title} (${book.author}), `;
                });
                books = books.slice(0, books.length - 2);

                return (
                  <TableRow key={order.id}>
                    <TableCell align="left">{order.id}</TableCell>
                    <TableCell align="left">{getUserFullname(order.clientId)}</TableCell>
                    <TableCell align="left">{books}</TableCell>
                    <TableCell align="right">
                      {order.books
                        .map((book) => book.quantity)
                        .reduce((a, b) => a + b, 0)}
                    </TableCell>
                    <TableCell align="right">
                      {new Date(order.date).toLocaleDateString()}
                    </TableCell>
                    <TableCell align="right">{Status[order.status]}</TableCell>
                  </TableRow>
                );
              })}
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
