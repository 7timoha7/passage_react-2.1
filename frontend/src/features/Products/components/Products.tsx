import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Grid } from '@mui/material';
import Typography from '@mui/material/Typography';
import { BasketTypeOnServerMutation, CategoriesType, ProductType } from '../../../types';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { selectProductsState } from '../productsSlise';
import { productsFetch } from '../productsThunks';
import ProductCard from './ProductCard';
import { selectBasket } from '../../Basket/basketSlice';
import { selectUser } from '../../users/usersSlice';

interface Props {
  categoryName: CategoriesType | null;
}

const Products: React.FC<Props> = ({ categoryName }) => {
  const [name, setName] = useState('');
  const [stateBasket, setStateBasket] = useState<BasketTypeOnServerMutation | null>(null);
  const dispatch = useAppDispatch();
  const { id } = useParams();
  const productsInCategory = useAppSelector(selectProductsState);
  const basket = useAppSelector(selectBasket);

  useEffect(() => {
    if (basket) {
      setStateBasket(basket);
    }
  }, [basket]);

  useEffect(() => {
    if (id) {
      dispatch(productsFetch(id));
    }
    if (categoryName) {
      setName(categoryName.name);
    }
  }, [categoryName, dispatch, id]);

  const indicator = (item: ProductType) => {
    if (stateBasket && item) {
      return stateBasket.items.some((itemBasket) => itemBasket.product._id === item._id);
    } else {
      return false;
    }
  };

  return (
    <>
      <Typography variant={'h2'} textAlign={'center'}>
        {name}
      </Typography>
      <Grid container spacing={4} mt={2} mb={2}>
        {productsInCategory.map((item) => {
          return (
            <Grid item key={item._id}>
              <ProductCard product={item} indicator={indicator(item)} />
            </Grid>
          );
        })}
      </Grid>
    </>
  );
};

export default Products;
