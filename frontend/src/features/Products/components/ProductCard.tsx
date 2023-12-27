import React from 'react';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';
import { ProductType } from '../../../types';
import noImage from '../../../assets/images/no_image.jpg';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { apiURL } from '../../../constants';
import { selectUser } from '../../users/usersSlice';
import { changeFavorites, reAuthorization } from '../../users/usersThunks';
import { getFavoriteProducts } from '../productsThunks';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { fetchBasket, updateBasket } from '../../Basket/basketThunks';

interface Props {
  product: ProductType;
  indicator?: boolean;
}

const ProductCard: React.FC<Props> = ({ product, indicator }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const user = useAppSelector(selectUser);
  const sessionKey = localStorage.getItem('sessionKey');

  const handleAddToCart = async () => {
    if (sessionKey) {
      await dispatch(
        updateBasket({
          sessionKey: sessionKey,
          product_id: product._id,
          action: 'increase',
        }),
      );
      await dispatch(fetchBasket(sessionKey));
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

  const favorite = user?.role === 'user' && user.favorites.includes(product._id);

  let imgProduct = noImage;
  if (product.images.length) {
    imgProduct = apiURL + product.images[0];
  }

  return (
    <Box>
      <Card
        onClick={() => navigate('/product/' + product._id)}
        sx={{
          width: 345,
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          transition: 'box-shadow 0.3s',
          '&:hover': {
            boxShadow: indicator ? 'none' : '0px 0px 10px 2px rgba(255,0,0,0.75)',
          },
        }}
      >
        <CardMedia component="img" height="194" image={imgProduct} alt="Product" />
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
            user.role === 'user' &&
            (favorite ? <FavoriteIcon color="error" /> : <FavoriteBorderIcon />)}
        </Box>
        <CardContent
          sx={{
            flexGrow: 1,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Typography variant="body2" color="black">
            {product.name}
          </Typography>
          <Typography color="red">{product.price + ' сом'}</Typography>
          <Box
            sx={{
              marginTop: 'auto',
              alignSelf: 'flex-end',
            }}
          >
            <Tooltip title={indicator ? 'Товар уже в корзине' : 'Добавить в корзину'} arrow>
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  if (!indicator) {
                    handleAddToCart();
                  }
                }}
                style={{
                  cursor: indicator ? 'not-allowed' : 'pointer',
                }}
              >
                <AddShoppingCartIcon
                  fontSize="large"
                  color={indicator ? 'disabled' : indicator ? 'error' : 'inherit'}
                />
              </div>
            </Tooltip>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ProductCard;
