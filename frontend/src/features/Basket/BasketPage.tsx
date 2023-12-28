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
import React, { useEffect, useState } from 'react';
import { BasketTypeOnServerMutation } from '../../types';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { selectBasket } from './basketSlice';
import { fetchBasket, updateBasket } from './basketThunks';
import { useNavigate } from 'react-router-dom';
import { selectUser } from '../users/usersSlice';

const BasketPage = () => {
  const [stateBasket, setStateBasket] = useState<BasketTypeOnServerMutation | null>(null);
  const basket = useAppSelector(selectBasket);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const user = useAppSelector(selectUser);

  useEffect(() => {
    if (basket) {
      setStateBasket(basket);
    }
  }, [basket]);

  useEffect(() => {
    if (user) {
      dispatch(fetchBasket('1'));
    }
  }, [dispatch, user]);

  const handleUpdateBasket = async (product_id: string, action: 'increase' | 'decrease' | 'remove') => {
    if (user) {
      await dispatch(updateBasket({ sessionKey: user._id, product_id, action }));
      await dispatch(fetchBasket(user._id));
    } else if (stateBasket?.session_key) {
      await dispatch(updateBasket({ sessionKey: stateBasket.session_key, product_id, action }));
      await dispatch(fetchBasket(stateBasket.session_key));
    }
  };

  const clearBasket = async (action: 'clear') => {
    if (stateBasket?.session_key) {
      await dispatch(updateBasket({ action: action, sessionKey: stateBasket.session_key, product_id: action }));
      await dispatch(fetchBasket(stateBasket.session_key));
    } else if (user) {
      await dispatch(updateBasket({ action: action, sessionKey: user._id, product_id: action }));
      await dispatch(fetchBasket(user._id));
    }
  };

  return (
    <Paper elevation={3} sx={{ m: 2, p: 2, height: '100vh' }}>
      <Typography variant="h4" gutterBottom textAlign={'center'}>
        Корзина
      </Typography>
      {stateBasket?.items ? (
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
                {stateBasket.items.map((item) => (
                  <TableRow key={item._id}>
                    <TableCell>{item.product.name}</TableCell>
                    <TableCell align="center">{item.quantity}</TableCell>
                    <TableCell align="center">
                      <IconButton color="primary" onClick={() => handleUpdateBasket(item.product._id, 'increase')}>
                        <AddCircleOutlineIcon style={{ color: 'red' }} />
                      </IconButton>
                      <IconButton
                        color="primary"
                        onClick={() =>
                          item.quantity === 1
                            ? handleUpdateBasket(item.product._id, 'remove')
                            : handleUpdateBasket(item.product._id, 'decrease')
                        }
                      >
                        <RemoveCircleOutlineIcon style={{ color: 'black' }} />
                      </IconButton>
                    </TableCell>
                    <TableCell align="center">{`${item.product.price * item.quantity} сом`}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Divider sx={{ marginY: 2 }} />
          <Typography variant="h5" gutterBottom>
            Общая сумма: {stateBasket.totalPrice} сом
          </Typography>
          <Grid container spacing={2} justifyContent="flex-end">
            <Grid item>
              <Button
                disabled={stateBasket?.items.length === 0}
                onClick={() => navigate('/order')}
                variant="contained"
                color="error"
                sx={{ marginLeft: 2 }}
              >
                Оформить заказ
              </Button>
            </Grid>
            <Grid item>
              <Button
                disabled={stateBasket?.items.length === 0}
                variant="outlined"
                color="error"
                onClick={() => clearBasket('clear')}
              >
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
