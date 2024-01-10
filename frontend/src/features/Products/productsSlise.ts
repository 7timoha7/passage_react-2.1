import { createSlice } from '@reduxjs/toolkit';
import { GlobalSuccess, PageInfo, ProductsSearchPreview, ProductType, ValidationError } from '../../types';
import { RootState } from '../../app/store';
import {
  editProduct,
  getFavoriteProducts,
  productFetch,
  productsFetch,
  productsFromApi,
  searchProductsFull,
  searchProductsPreview,
} from './productsThunks';

interface ProductsState {
  products: ProductType[];
  product: ProductType | null;
  productsFromApi: ProductType[];
  productsLoading: boolean;
  productLoading: boolean;
  error: boolean;
  favoriteProducts: ProductType[];
  fetchFavoriteProductsLoading: boolean;
  productError: ValidationError | null;
  loadingProductEdit: boolean;
  productSuccess: GlobalSuccess | null;
  pageInfo: PageInfo | null;
  searchResults: ProductType[];
  searchLoading: boolean;
  pageInfoSearch: PageInfo | null;
  searchResultsPreview: ProductsSearchPreview;
  searchLoadingPreview: boolean;
}

const initialState: ProductsState = {
  products: [],
  product: null,
  productsFromApi: [],
  productsLoading: false,
  productLoading: false,
  error: false,
  favoriteProducts: [],
  fetchFavoriteProductsLoading: false,
  productError: null,
  loadingProductEdit: false,
  productSuccess: null,
  pageInfo: null,
  searchResults: [],
  searchLoading: false,
  pageInfoSearch: null,
  searchResultsPreview: { results: [], hasMore: false },
  searchLoadingPreview: false,
};

export const productsSLice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setProductSuccessNull: (state) => {
      state.productSuccess = null;
    },
    clearSearchResults: (state) => {
      state.searchResults = [];
    },
    clearSearchResultsPreview: (state) => {
      state.searchResultsPreview = { results: [], hasMore: false };
    },
  },
  extraReducers: (builder) => {
    builder.addCase(productsFetch.pending, (state) => {
      state.productsLoading = true;
    });
    builder.addCase(productsFetch.fulfilled, (state, action) => {
      state.products = action.payload.products;
      state.pageInfo = action.payload.pageInfo;
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
      state.productSuccess = success;
    });
    builder.addCase(editProduct.rejected, (state, { payload: error }) => {
      state.loadingProductEdit = false;
      state.productError = error || null;
    });

    builder.addCase(searchProductsFull.pending, (state) => {
      state.searchLoading = true;
    });
    builder.addCase(searchProductsFull.fulfilled, (state, action) => {
      state.searchResults = action.payload.products;
      state.pageInfoSearch = action.payload.pageInfo;
      state.searchLoading = false;
    });
    builder.addCase(searchProductsFull.rejected, (state) => {
      state.searchLoading = false;
      state.error = true;
    });

    builder.addCase(searchProductsPreview.pending, (state) => {
      state.searchLoadingPreview = true;
    });
    builder.addCase(searchProductsPreview.fulfilled, (state, action) => {
      state.searchResultsPreview = action.payload;
      state.searchLoadingPreview = false;
    });
    builder.addCase(searchProductsPreview.rejected, (state) => {
      state.searchLoadingPreview = false;
      state.error = true;
    });
  },
});

export const productsReducer = productsSLice.reducer;

export const { setProductSuccessNull, clearSearchResults, clearSearchResultsPreview } = productsSLice.actions;

export const selectProductsState = (state: RootState) => state.products.products;
export const selectProductOne = (state: RootState) => state.products.product;
export const selectFavoriteProducts = (state: RootState) => state.products.favoriteProducts;
export const selectFetchFavoriteProductsLoading = (state: RootState) => state.products.fetchFavoriteProductsLoading;
export const selectProductsFromApi = (state: RootState) => state.products.productsFromApi;
export const selectProductLoading = (state: RootState) => state.products.productLoading;
export const selectProductsLoading = (state: RootState) => state.products.productsLoading;
export const selectLoadingEditProduct = (state: RootState) => state.products.loadingProductEdit;
export const selectProductError = (state: RootState) => state.products.productError;
export const selectProductSuccess = (state: RootState) => state.products.productSuccess;
export const selectPageInfo = (state: RootState) => state.products.pageInfo;
export const selectSearchResults = (state: RootState) => state.products.searchResults;
export const selectSearchLoading = (state: RootState) => state.products.searchLoading;
export const selectPageInfoSearch = (state: RootState) => state.products.pageInfoSearch;

export const selectSearchResultsPreview = (state: RootState) => state.products.searchResultsPreview;
export const selectSearchLoadingPreview = (state: RootState) => state.products.searchLoadingPreview;
