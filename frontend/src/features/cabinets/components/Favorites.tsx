import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { BasketTypeOnServerMutation, ProductType } from '../../../types';
import { selectFavoriteProducts, selectFetchFavoriteProductsLoading } from '../../Products/productsSlise';
import { getFavoriteProducts } from '../../Products/productsThunks';
import { selectBasket } from '../../Basket/basketSlice';
import Typography from '@mui/material/Typography';
import { Grid } from '@mui/material';
import ProductCard from '../../Products/components/ProductCard';
import Spinner from '../../../components/UI/Spinner/Spinner';
import { fetchBasket } from '../../Basket/basketThunks';

const Favorites = () => {
  const dispatch = useAppDispatch();
  const favoriteProducts = useAppSelector(selectFavoriteProducts);
  const favoriteProductsLoading = useAppSelector(selectFetchFavoriteProductsLoading);
  const basket = useAppSelector(selectBasket);

  const indicator = (item: ProductType) => {
    if (basket?.items && item) {
      return basket?.items.some((itemBasket) => itemBasket.product._id === item._id);
    } else {
      return false;
    }
  };

  useEffect(() => {
    dispatch(getFavoriteProducts());
    dispatch(fetchBasket('1'));
  }, [dispatch]);
  return (
    <>
      <Typography variant={'h5'} textAlign={'center'}>
        Любимые товары
      </Typography>
      <Grid container spacing={4} mt={1} mb={2}>
        {favoriteProductsLoading ? (
          <Spinner />
        ) : (
          favoriteProducts.map((item) => {
            return (
              <Grid item key={item._id}>
                <ProductCard product={item} indicator={indicator(item)} />
              </Grid>
            );
          })
        )}
      </Grid>
    </>
  );
};

export default Favorites;
