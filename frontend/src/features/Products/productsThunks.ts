import { createAsyncThunk } from '@reduxjs/toolkit';
import { GlobalSuccess, ProductType, ProductTypeMutation, ValidationError } from '../../types';
import axiosApi from '../../axiosApi';
import { RootState } from '../../app/store';
import { isAxiosError } from 'axios';

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

export const editProduct = createAsyncThunk<
  GlobalSuccess,
  ProductTypeMutation,
  {
    state: RootState;
    rejectValue: ValidationError;
  }
>('products/editProduct', async (product, { getState, rejectWithValue }) => {
  try {
    const user = getState().users.user;
    if (user) {
      const formData = new FormData();

      formData.append('name', product.name);
      if (product.desc) {
        formData.append('desc', product.desc);
      }
      formData.append('unit', product.unit);
      formData.append('vendorCode', JSON.stringify(product.vendorCode));
      formData.append('group', product.group);
      formData.append('cod', product.cod);
      formData.append('dimensions', product.dimensions);
      formData.append('weight', product.weight);
      formData.append('price', JSON.stringify(product.price));

      if (product.images) {
        for (const image of product.images) {
          if (image) {
            formData.append('images', image);
          }
        }
      }

      const response = await axiosApi.patch(`/products/${product._id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data;
    }
  } catch (e) {
    if (isAxiosError(e) && e.response && e.response.status === 400) {
      return rejectWithValue(e.response.data as ValidationError);
    }
    throw e;
  }
});

export const removeProductImage = createAsyncThunk<
  void,
  {
    productId: string;
    imageIndex: number;
  }
>('products/removeImage', async ({ productId, imageIndex }) => {
  try {
    await axiosApi.delete(`/products/${productId}/images/${imageIndex}`);
  } catch {
    throw new Error();
  }
});
