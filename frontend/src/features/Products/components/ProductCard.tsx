import React, { useEffect, useState } from 'react';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';
import { ProductBasketType, ProductType } from '../../../types';
import noImage from '../../../assets/images/no_image.jpg';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { selectProductBasket, setProductBasket } from '../productsSlise';
import { apiURL } from '../../../constants';
import { selectUser } from '../../users/usersSlice';
import { changeFavorites, reAuthorization } from '../../users/usersThunks';
import { getFavoriteProducts } from '../productsThunks';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';

interface Props {
  product: ProductType;
}

const ProductCard: React.FC<Props> = ({ product }) => {
  const [isAddedToCart, setIsAddedToCart] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const dispatch = useAppDispatch();
  const basketMarker = useAppSelector(selectProductBasket);
  const navigate = useNavigate();
  const user = useAppSelector(selectUser);

  let imgProduct = noImage;
  if (product.image) {
    imgProduct = apiURL + product.image;
  }

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

  const favorite = user?.role === 'user' && user.favorites.includes(product._id);

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

  return (
    <Box>
      <Card
        onClick={() => navigate('/product/' + product._id)}
        sx={{
          width: 345,
          display: 'flex',
          flexDirection: 'column',
          position: 'relative', // Добавлен стиль, чтобы позволить позиционирование иконки "Добавить в избранное"
          transition: 'box-shadow 0.3s',
          '&:hover': {
            boxShadow: isAddedToCart ? 'none' : '0px 0px 10px 2px rgba(255,0,0,0.75)',
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
            padding: '8px', // Подберите подходящий вам отступ
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
            <Tooltip title={isAddedToCart ? 'Товар уже в корзине' : 'Добавить в корзину'} arrow>
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  if (!isAddedToCart) {
                    handleAddToCart();
                  }
                }}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                style={{
                  cursor: isAddedToCart ? 'not-allowed' : 'pointer',
                }}
              >
                <AddShoppingCartIcon
                  fontSize="large"
                  color={isAddedToCart ? 'disabled' : isHovered ? 'error' : 'inherit'}
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
