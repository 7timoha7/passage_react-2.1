import React, { useEffect, useState } from 'react';
import { Badge, Divider, Grid, IconButton, List, ListItem, ListItemText, Popover, Typography } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import Button from '@mui/material/Button';
import { ProductBasketType } from '../../../types';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { selectProductBasket, setProductBasket } from '../../../features/Products/productsSlise';

const Basket = () => {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [cartItems, setCartItems] = useState<ProductBasketType[]>([]);

  const dispatch = useAppDispatch();
  const basketMarker = useAppSelector(selectProductBasket);
  const navigate = useNavigate();

  const handlePopoverOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

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
    handlePopoverClose();
  };

  const navClick = () => {
    navigate('/basket/');
    handlePopoverClose();
  };

  return (
    <>
      <IconButton aria-label="Shopping Cart" color="inherit" onClick={handlePopoverOpen}>
        <Badge badgeContent={cartItems.reduce((acc, item) => acc + item.quantity, 0)} color="info">
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
          {cartItems.map((item) => (
            <ListItem key={item._id}>
              <ListItemText primary={item.name + ' x ' + item.quantity + 'шт'} />
              <IconButton color="primary" onClick={() => updateCartItemQuantity(item._id, item.quantity + 1)}>
                <AddCircleOutlineIcon style={{ color: 'red' }} />
              </IconButton>
              <IconButton
                color="primary"
                onClick={() => updateCartItemQuantity(item._id, Math.max(0, item.quantity - 1))}
              >
                <RemoveCircleOutlineIcon style={{ color: 'black' }} />
              </IconButton>
              <Typography variant="body2">{`${item.price * item.quantity} сом`}</Typography>
            </ListItem>
          ))}
          <Divider />
          <ListItem>
            <Typography variant="subtitle1">
              Общая сумма: {cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0)} сом
            </Typography>
          </ListItem>
          <Divider />
          <ListItem>
            <Grid container spacing={2}>
              <Grid item>
                <Button onClick={() => navClick()} variant="outlined" color="error">
                  Перейти в корзину
                </Button>
              </Grid>
              <Grid item>
                <Button onClick={clearCart} variant="text" color="error">
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
