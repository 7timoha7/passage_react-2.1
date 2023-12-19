import { createAsyncThunk } from '@reduxjs/toolkit';
import { ProductType } from '../../types';
import axiosApi from '../../axiosApi';

export const productsFetch = createAsyncThunk<ProductType[], string>('products/fetch', async (id) => {
  const products = await axiosApi.get('/products?category=' + id);
  return products.data;
});

export const productFetch = createAsyncThunk<ProductType, string>('products/fetchOne', async (id) => {
  const products = await axiosApi.get<ProductType>('/products/' + id);
  return products.data;
});

export const productsFromApi = createAsyncThunk('products/fetchFromApi', async () => {
  const products = await axiosApi.get('/productsFromApi/');
  console.log(products.data);
  return products.data;
});

export const getFavoriteProducts = createAsyncThunk<ProductType[]>('products/getFavoriteProducts', async () => {
  try {
    const responseFavoriteProducts = await axiosApi.get<ProductType[]>('/products/get/favorites');
    return responseFavoriteProducts.data;
  } catch {
    throw new Error();
  }
});
