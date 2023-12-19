import {
  Button,
  Divider,
  Grid,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { selectProductBasket, setProductBasket } from '../../../features/Products/productsSlise';
import React from 'react';

const BasketPage = () => {
  const [cartItems, setCartItems] = useState<{ _id: string; name: string; quantity: number; price: number }[]>([]);
  const dispatch = useAppDispatch();
  const basketMarker = useAppSelector(selectProductBasket);

  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      const parsedCart = JSON.parse(savedCart);
      const nonZeroQuantityCart = parsedCart.filter((item: { _id: string; quantity: number }) => item.quantity > 0);
      setCartItems(nonZeroQuantityCart);
      if (nonZeroQuantityCart.length > 0) {
        localStorage.setItem('cart', JSON.stringify(nonZeroQuantityCart));
      } else {
        localStorage.removeItem('cart');
      }
    } else {
      setCartItems([]);
    }
  }, [basketMarker]);

  const updateCartItemQuantity = (_id: string, quantity: number) => {
    dispatch(setProductBasket());
    const updatedCart = cartItems
      .map((item) => (_id === item._id ? { ...item, quantity } : item))
      .filter((item) => item.quantity > 0);

    setCartItems(updatedCart);

    if (updatedCart.length > 0) {
      localStorage.setItem('cart', JSON.stringify(updatedCart));
    } else {
      localStorage.removeItem('cart');
    }
  };

  const clearCart = () => {
    dispatch(setProductBasket());
    setCartItems([]);
    localStorage.removeItem('cart');
  };

  return (
    <Paper elevation={3} sx={{ m: 2, p: 2, height: '100vh' }}>
      <Typography variant="h4" gutterBottom textAlign={'center'}>
        Корзина
      </Typography>
      {cartItems.length > 0 ? (
        <>
          <TableContainer component={Paper} sx={{ marginBottom: 2 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Название</TableCell>
                  <TableCell align="center">Количество</TableCell>
                  <TableCell align="center">+/-</TableCell>
                  <TableCell align="center">Цена</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {cartItems.map((item) => (
                  <TableRow key={item._id}>
                    <TableCell>{item.name}</TableCell>
                    <TableCell align="center">{item.quantity}</TableCell>
                    <TableCell align="center">
                      <IconButton color="primary" onClick={() => updateCartItemQuantity(item._id, item.quantity + 1)}>
                        <AddCircleOutlineIcon style={{ color: 'red' }} />
                      </IconButton>
                      <IconButton
                        color="primary"
                        onClick={() => updateCartItemQuantity(item._id, Math.max(0, item.quantity - 1))}
                      >
                        <RemoveCircleOutlineIcon style={{ color: 'black' }} />
                      </IconButton>
                    </TableCell>
                    <TableCell align="center">{`${item.price * item.quantity} сом`}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Divider sx={{ marginY: 2 }} />
          <Typography variant="h5" gutterBottom>
            Общая сумма: {cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0)} сом
          </Typography>
          <Grid container spacing={2} justifyContent="flex-end">
            <Grid item>
              <Button variant="contained" color="error" sx={{ marginLeft: 2 }}>
                Оформить заказ
              </Button>
            </Grid>
            <Grid item>
              <Button variant="outlined" color="error" onClick={clearCart}>
                Очистить корзину
              </Button>
            </Grid>
          </Grid>
        </>
      ) : (
        <Typography variant="h5" gutterBottom textAlign={'center'}>
          Нет товаров
        </Typography>
      )}
    </Paper>
  );
};

export default BasketPage;
