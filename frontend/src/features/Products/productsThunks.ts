import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  GlobalSuccess,
  PageInfo,
  ProductsSearchPreview,
  ProductType,
  ProductTypeMutation,
  ValidationError,
} from '../../types';
import axiosApi from '../../axiosApi';
import { RootState } from '../../app/store';
import { isAxiosError } from 'axios';

export const productsFetch = createAsyncThunk<
  { products: ProductType[]; pageInfo: PageInfo },
  { id: string; page: number }
>('products/fetch', async ({ id, page }) => {
  const pageSize = 30; // Установите желаемый размер страницы
  const response = await axiosApi.get(`/products?category=${id}&page=${page}&pageSize=${pageSize}`);
  return response.data;
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

// export const searchProducts = createAsyncThunk<
//   { products: ProductType[]; pageInfo: PageInfo },
//   { text: string; page: number }
// >('products/search', async ({ text, page }) => {
//   const pageSize = 30; // Установите желаемый размер страницы
//
//   const response = await axiosApi.get(`/products/search?text=${text}&page=${page}&pageSize=${pageSize}`);
//   return response.data;
// });

export const searchProductsFull = createAsyncThunk<
  { products: ProductType[]; pageInfo: PageInfo },
  { text: string; page: number }
>('products/search', async ({ text, page }) => {
  try {
    // Проверяем, что поисковый запрос содержит минимум 3 символа
    if (text.length < 3) {
      throw new Error('Search term should be at least 3 characters long');
    }

    // Выполняем запрос к бэкенду с параметрами текста и страницы
    const response = await axiosApi.get(`/products/search/get?text=${text}&page=${page}`);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
});

export const searchProductsPreview = createAsyncThunk<ProductsSearchPreview, { text: string }>(
  'products/searchPreview',
  async ({ text }) => {
    try {
      // Выполняем запрос к бэкенду для предварительного поиска
      const response = await axiosApi.get(`/products/search/preview?text=${text}`);
      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
);
