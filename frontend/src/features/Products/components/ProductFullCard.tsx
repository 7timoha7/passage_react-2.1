import React, { useEffect, useState } from 'react';
import { Box, Paper, Typography, Tooltip, Button, Grid } from '@mui/material';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import noImage from '../../../assets/images/no_image.jpg';
import { ProductBasketType, ProductType } from '../../../types';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { selectProductBasket, setProductBasket } from '../productsSlise';
import { apiURL } from '../../../constants';

interface Props {
  product: ProductType;
}

const ProductFullCard: React.FC<Props> = ({ product }) => {
  const [isAddedToCart, setIsAddedToCart] = useState(false);

  const dispatch = useAppDispatch();
  const basketMarker = useAppSelector(selectProductBasket);

  useEffect(() => {
    const currentCart = JSON.parse(localStorage.getItem('cart') || '[]');
    const isProductAlreadyAdded = currentCart.some((item: ProductType) => item._id === product._id);

    setIsAddedToCart(isProductAlreadyAdded);
  }, [basketMarker, product._id]);

  const handleAddToCart = () => {
    dispatch(setProductBasket());
    const currentCart = JSON.parse(localStorage.getItem('cart') || '[]');
    const updatedCart = currentCart.map((item: ProductBasketType) =>
      item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item,
    );
    const existingProduct = updatedCart.find((item: ProductType) => item._id === product._id);
    if (!existingProduct) {
      updatedCart.push({ ...product, quantity: 1 });
    }
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    setIsAddedToCart(true);
  };

  let imgProduct = noImage;
  if (product.image) {
    imgProduct = apiURL + product.image;
  }

  return (
    <Paper elevation={3} sx={{ maxWidth: '600px', margin: 'auto' }}>
      <Grid container>
        <Grid item xs={12} md={6}>
          <img src={imgProduct} alt={product.name} style={{ width: '100%', height: 'auto' }} />
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
            <Tooltip title={isAddedToCart ? 'Товар уже в корзине' : 'Добавить в корзину'} arrow>
              <div>
                <Button
                  onClick={handleAddToCart}
                  disabled={isAddedToCart}
                  variant="outlined"
                  endIcon={<AddShoppingCartIcon />}
                  color={'error'}
                >
                  {isAddedToCart ? 'В корзине' : 'Добавить в корзину'}
                </Button>
              </div>
            </Tooltip>
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default ProductFullCard;
