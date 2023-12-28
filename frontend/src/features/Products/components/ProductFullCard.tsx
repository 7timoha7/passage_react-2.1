import React, { useEffect, useState } from 'react';
import { Box, Button, Grid, Paper, Tooltip, Typography } from '@mui/material';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import noImage from '../../../assets/images/no_image.jpg';
import { BasketTypeOnServerMutation, ProductType } from '../../../types';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { apiURL } from '../../../constants';
import { useNavigate } from 'react-router-dom';
import { selectUser } from '../../users/usersSlice';
import { selectBasket } from '../../Basket/basketSlice';
import { fetchBasket, updateBasket } from '../../Basket/basketThunks';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { changeFavorites, reAuthorization } from '../../users/usersThunks';
import { getFavoriteProducts } from '../productsThunks';

interface Props {
  product: ProductType;
}

const ProductFullCard: React.FC<Props> = ({ product }) => {
  const [selectedImage, setSelectedImage] = useState(product.images.length ? product.images[0] : '');
  const [stateBasket, setStateBasket] = useState<BasketTypeOnServerMutation | null>(null);
  const user = useAppSelector(selectUser);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const basket = useAppSelector(selectBasket);
  const storedBasketId = localStorage.getItem('sessionKey');

  useEffect(() => {
    if (storedBasketId) {
      dispatch(fetchBasket(storedBasketId));
    } else if (user) {
      dispatch(fetchBasket('1'));
    }
  }, [dispatch, storedBasketId, user]);

  useEffect(() => {
    if (basket) {
      setStateBasket(basket);
    }
  }, [basket]);

  const indicator = (item: ProductType) => {
    if (stateBasket && item) {
      return stateBasket.items.some((itemBasket) => itemBasket.product._id === item._id);
    } else {
      return false;
    }
  };

  const handleAddToCart = async () => {
    if (basket?.session_key) {
      await dispatch(
        updateBasket({
          sessionKey: basket.session_key,
          product_id: product._id,
          action: 'increase',
        }),
      );
      await dispatch(fetchBasket(basket.session_key));
    } else if (user) {
      await dispatch(
        updateBasket({
          sessionKey: '1',
          product_id: product._id,
          action: 'increase',
        }),
      );
      await dispatch(fetchBasket('1'));
    }
  };

  const onClickFavorite = async (id: string) => {
    if (!favorite) {
      await dispatch(changeFavorites({ addProduct: id }));
      await dispatch(reAuthorization());
    } else {
      await dispatch(changeFavorites({ deleteProduct: id }));
      await dispatch(reAuthorization());
      await dispatch(getFavoriteProducts());
    }
  };

  const favorite =
    (user?.role === 'user' || user?.role === 'director' || user?.role === 'admin') &&
    user.favorites.includes(product._id);

  return (
    <Paper elevation={3} sx={{ maxWidth: '600px', margin: 'auto', position: 'relative' }}>
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          right: 0,
          cursor: 'pointer',
          padding: '8px',
        }}
        onClick={(e) => {
          e.stopPropagation();
          onClickFavorite(product._id);
        }}
      >
        {user &&
          user.isVerified &&
          (user.role === 'user' || user.role === 'director' || user.role === 'admin') &&
          (favorite ? <FavoriteIcon color="error" /> : <FavoriteBorderIcon />)}
      </Box>
      <Grid container>
        <Grid item xs={12} md={6}>
          <img
            src={product.images.length ? apiURL + '/' + selectedImage : noImage}
            alt={product.name}
            style={{ width: '100%', height: 'auto' }}
          />
          <Grid container spacing={1} mt={2}>
            {product.images.length
              ? product.images.map((image, index) => (
                  <Grid item key={index}>
                    <img
                      src={apiURL + '/' + image}
                      alt={product.name}
                      style={{ width: '50px', height: 'auto', cursor: 'pointer', border: '1px solid #ccc' }}
                      onClick={() => setSelectedImage(image)}
                    />
                  </Grid>
                ))
              : null}
          </Grid>
        </Grid>
        <Grid item xs={12} md={6}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              p: 2,
              height: '100%',
            }}
          >
            <div>
              <Typography variant="h5" gutterBottom>
                {product.name}
              </Typography>
              <Typography variant="body1" paragraph>
                {product.desc}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                Цена: {product.price} сом
              </Typography>
            </div>
            <Grid container spacing={2}>
              <Grid item>
                <Tooltip title={indicator(product) ? 'Товар уже в корзине' : 'Добавить в корзину'} arrow>
                  <div>
                    <Button
                      onClick={handleAddToCart}
                      disabled={indicator(product)}
                      variant="outlined"
                      endIcon={<AddShoppingCartIcon />}
                      color={'error'}
                    >
                      {indicator(product) ? 'В корзине' : 'Добавить в корзину'}
                    </Button>
                  </div>
                </Tooltip>
              </Grid>
              <Grid item>
                <Button onClick={() => navigate('/basket')} variant="outlined" color="error">
                  Перейти в корзину
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Grid>
        {user?.role === 'admin' || user?.role === 'director' ? (
          <Button onClick={() => navigate('/edit-product/' + product._id)}>Изменить</Button>
        ) : null}
      </Grid>
    </Paper>
  );
};

export default ProductFullCard;
