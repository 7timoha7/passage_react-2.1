import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosApi from '../../axiosApi';
import { isAxiosError } from 'axios';
import { BasketTypeOnServerMutation, BasketUpdateRequest, GlobalSuccess, ValidationError } from '../../types';
import { RootState } from '../../app/store';

export const createBasket = createAsyncThunk<
  BasketTypeOnServerMutation,
  {
    sessionKey?: string;
  },
  {
    state: RootState;
    rejectValue: ValidationError;
  }
>('basket/create', async (basketData, { getState, rejectWithValue }) => {
  try {
    const user = getState().users.user;
    if (user) {
      const response = await axiosApi.post('/basket/user', basketData);
      return response.data;
    } else if (basketData.sessionKey) {
      const response = await axiosApi.post('/basket', basketData);
      return response.data;
    }
  } catch (e) {
    if (isAxiosError(e) && e.response && e.response.status === 400) {
      return rejectWithValue(e.response.data as ValidationError);
    }
    throw e;
  }
});

// export const updateBasket = createAsyncThunk<
//   GlobalSuccess,
//   {
//     basketMass?: { product: string; quantity: number }[];
//     id?: string;
//   },
//   { state: RootState; rejectValue: ValidationError }
// >('basket/updateBasket', async (updatedBasket, { getState, rejectWithValue }) => {
//   try {
//     const user = getState().users.user;
//     console.log(updatedBasket);
//     if (user) {
//       const response = await axiosApi.patch('/basket', updatedBasket.basketMass);
//       return response.data;
//     } else {
//       const response = await axiosApi.patch('/basket/' + updatedBasket.id, updatedBasket.basketMass);
//       return response.data;
//     }
//   } catch (e) {
//     if (isAxiosError(e) && e.response && e.response.status === 400) {
//       return rejectWithValue(e.response.data as ValidationError);
//     }
//     throw e;
//   }
// });

// export const updateBasket = createAsyncThunk<
//   GlobalSuccess,
//   BasketUpdateRequest, // Обновленный интерфейс запроса
//   { state: RootState; rejectValue: ValidationError }
// >('basket/updateBasket', async (updatedBasket, { getState, rejectWithValue }) => {
//   try {
//     const user = getState().users.user;
//     console.log(updatedBasket);
//     if (user) {
//       const response = await axiosApi.patch('/basket', updatedBasket);
//       return response.data;
//     } else {
//       const response = await axiosApi.patch('/basket/' + updatedBasket, updatedBasket);
//       return response.data;
//     }
//   } catch (e) {
//     if (isAxiosError(e) && e.response && e.response.status === 400) {
//       return rejectWithValue(e.response.data as ValidationError);
//     }
//     throw e;
//   }
// });

export const updateBasket = createAsyncThunk<
  GlobalSuccess,
  BasketUpdateRequest,
  {
    state: RootState;
    rejectValue: ValidationError;
  }
>('basket/updateBasket', async (updatedBasket, { getState, rejectWithValue }) => {
  try {
    const user = getState().users.user;
    const { sessionKey, product_id, action } = updatedBasket;
    const url = user ? '/basket' : `/basket/${sessionKey}`;
    const response = await axiosApi.patch(url, {
      product_id,
      action,
    });
    return response.data;
  } catch (e) {
    if (isAxiosError(e) && e.response && e.response.status === 400) {
      return rejectWithValue(e.response.data as ValidationError);
    }
    throw e;
  }
});

export const fetchBasket = createAsyncThunk<
  BasketTypeOnServerMutation,
  string,
  {
    state: RootState;
  }
>('basket/fetchBasket', async (sessionKey, { getState }) => {
  try {
    const user = getState().users.user;
    if (user) {
      const response = await axiosApi.get<BasketTypeOnServerMutation>('/basket');
      return response.data;
    } else {
      const response = await axiosApi.get<BasketTypeOnServerMutation>('/basket/' + sessionKey);
      return response.data;
    }
  } catch {
    throw new Error();
  }
});
