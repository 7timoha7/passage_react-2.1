import { createSlice } from '@reduxjs/toolkit';
import { GlobalSuccess, ProductType, ValidationError } from '../../types';
import { RootState } from '../../app/store';
import { editProduct, getFavoriteProducts, productFetch, productsFetch, productsFromApi } from './productsThunks';

interface ProductsState {
  products: ProductType[];
  product: ProductType | null;
  productsFromApi: ProductType[];
  productsLoading: boolean;
  productLoading: boolean;
  productBasket: boolean;
  error: boolean;
  favoriteProducts: ProductType[];
  fetchFavoriteProductsLoading: boolean;
  productError: ValidationError | null;
  loadingProductEdit: boolean;
  ProductSuccess: GlobalSuccess | null;
}

const initialState: ProductsState = {
  products: [],
  product: null,
  productsFromApi: [],
  productsLoading: false,
  productLoading: false,
  productBasket: false,
  error: false,
  favoriteProducts: [],
  fetchFavoriteProductsLoading: false,
  productError: null,
  loadingProductEdit: false,
  ProductSuccess: null,
};

export const productsSLice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setProductBasket: (state) => {
      state.productBasket = !state.productBasket;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(productsFetch.pending, (state) => {
      state.productsLoading = true;
    });
    builder.addCase(productsFetch.fulfilled, (state, action) => {
      state.products = action.payload;
      state.productsLoading = false;
    });
    builder.addCase(productsFetch.rejected, (state) => {
      state.productsLoading = false;
      state.error = true;
    });

    builder.addCase(productFetch.pending, (state) => {
      state.productLoading = true;
    });
    builder.addCase(productFetch.fulfilled, (state, action) => {
      state.product = action.payload;
      state.productLoading = false;
    });
    builder.addCase(productFetch.rejected, (state) => {
      state.productLoading = false;
      state.error = true;
    });

    builder.addCase(productsFromApi.pending, (state) => {
      state.productsLoading = true;
    });
    builder.addCase(productsFromApi.fulfilled, (state, action) => {
      state.productsFromApi = action.payload;
      state.productsLoading = false;
    });
    builder.addCase(productsFromApi.rejected, (state) => {
      state.productsLoading = false;
      state.error = true;
    });
    builder.addCase(getFavoriteProducts.pending, (state) => {
      state.favoriteProducts = [];
      state.fetchFavoriteProductsLoading = true;
    });
    builder.addCase(getFavoriteProducts.fulfilled, (state, { payload: favoriteProducts }) => {
      state.fetchFavoriteProductsLoading = false;
      state.favoriteProducts = favoriteProducts;
    });
    builder.addCase(getFavoriteProducts.rejected, (state) => {
      state.fetchFavoriteProductsLoading = false;
    });

    builder.addCase(editProduct.pending, (state) => {
      state.loadingProductEdit = true;
      state.productError = null;
    });
    builder.addCase(editProduct.fulfilled, (state, { payload: success }) => {
      state.loadingProductEdit = false;
      state.ProductSuccess = success;
    });
    builder.addCase(editProduct.rejected, (state, { payload: error }) => {
      state.loadingProductEdit = false;
      state.productError = error || null;
    });
  },
});

export const productsReducer = productsSLice.reducer;

export const { setProductBasket } = productsSLice.actions;

export const selectProductsState = (state: RootState) => state.products.products;
export const selectProductOne = (state: RootState) => state.products.product;
export const selectProductBasket = (state: RootState) => state.products.productBasket;
export const selectFavoriteProducts = (state: RootState) => state.products.favoriteProducts;
export const selectFetchFavoriteProductsLoading = (state: RootState) => state.products.fetchFavoriteProductsLoading;
export const selectProductsFromApi = (state: RootState) => state.products.productsFromApi;
export const selectProductLoading = (state: RootState) => state.products.productLoading;
export const selectProductsLoading = (state: RootState) => state.products.productsLoading;
export const selectLoadingEditProduct = (state: RootState) => state.products.loadingProductEdit;
export const selectProductError = (state: RootState) => state.products.productError;
export const selectProductSuccess = (state: RootState) => state.products.ProductSuccess;
