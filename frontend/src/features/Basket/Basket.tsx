import React, { useEffect, useState } from 'react';
import { Badge, Button, Grid, IconButton, List, ListItem, ListItemText, Popover, Typography } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { v4 as uuidv4 } from 'uuid';
import { createBasket, fetchBasket, updateBasket } from './basketThunks';
import { selectBasket } from './basketSlice';
import { BasketTypeOnServerMutation } from '../../types';
import { selectUser } from '../users/usersSlice';
import Divider from '@mui/material/Divider';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import { useNavigate } from 'react-router-dom';

const Basket = () => {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [stateBasket, setStateBasket] = useState<BasketTypeOnServerMutation | null>(null);
  const dispatch = useAppDispatch();
  const basket = useAppSelector(selectBasket);
  const user = useAppSelector(selectUser);
  const navigate = useNavigate();
  const handlePopoverOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  useEffect(() => {
    let storedBasketId = localStorage.getItem('sessionKey');
    if (storedBasketId) {
      dispatch(createBasket({ sessionKey: storedBasketId }));
    }
    if (!storedBasketId) {
      storedBasketId = uuidv4();
      localStorage.setItem('sessionKey', storedBasketId);
    }
  }, [user, dispatch]);

  useEffect(() => {
    setStateBasket(basket);
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
      setAnchorEl(null);
    } else if (user) {
      await dispatch(updateBasket({ action: action, sessionKey: user._id, product_id: action }));
      await dispatch(fetchBasket(user._id));
      setAnchorEl(null);
    }
  };

  const navigateToFullBasket = async () => {
    navigate('/basket');
    setAnchorEl(null);
  };

  return (
    <>
      <IconButton aria-label="Корзина" color="inherit" onClick={handlePopoverOpen}>
        <Badge badgeContent={stateBasket?.items.length || 0} color="error">
          <ShoppingCartIcon fontSize="large" />
        </Badge>
      </IconButton>
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handlePopoverClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <List sx={{ background: 'linear-gradient(45deg, rgb(172, 172, 172), rgb(252, 140, 140))' }}>
          {stateBasket?.items.map((item) => (
            <ListItem key={item._id}>
              <ListItemText primary={item.product.name + ' x ' + item.quantity + 'шт'} />
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
              <Typography variant="body2">{`${item.product.price * item.quantity} сом`}</Typography>
            </ListItem>
          ))}
          <Divider />
          <ListItem>
            <Typography variant="subtitle1">Общая сумма: {stateBasket?.totalPrice} сом</Typography>
          </ListItem>
          <Divider />
          <ListItem>
            <Grid container spacing={2}>
              <Grid item>
                <Button onClick={() => navigateToFullBasket()} variant="outlined" color="error">
                  Перейти в корзину
                </Button>
              </Grid>
              <Grid item>
                <Button
                  disabled={stateBasket?.items.length === 0}
                  onClick={() => clearBasket('clear')}
                  variant="text"
                  color="error"
                >
                  Очистить корзину
                </Button>
              </Grid>
            </Grid>
          </ListItem>
        </List>
      </Popover>
    </>
  );
};

export default Basket;
