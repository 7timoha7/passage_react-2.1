import React, { useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import { selectUserSuccess, selectUser, setUserSuccessNull } from './features/users/usersSlice';
import { useAppDispatch, useAppSelector } from './app/hooks';
import Home from './containers/Home';
import MainPage from './containers/MainPage';
import Login from './features/users/Login';
import Register from './features/users/Register';
import './App.css';

import { useSnackbar } from 'notistack';
import { useTranslation } from 'react-i18next';

import VerifyProtectedRoute from './components/UI/ProtectedRoute/VerifyProtectedRoute';
import VerifyPage from './components/UI/VerifyPage/VerifyPage';
import ConfirmPage from './components/UI/VerifyPage/ConfirmPage';

import GoogleProtectedRoute from './components/UI/ProtectedRoute/GoogleProtectedRoute';
import GooglePhoneNumber from './components/UI/VerifyPage/GooglePhoneNumber';
import Cabinet from './features/cabinets/Cabinet';
import ProtectedRoute from './components/UI/ProtectedRoute/ProtectedRoute';
import NoFoundPage from './components/UI/NoFoundPage/NoFoundPage';
import ProductsPage from './features/Products/ProductsPage';
import ProductFullPage from './features/Products/ProductFullPage';
import BasketPage from './components/UI/Basket/BasketPage';
import Order from './features/Order/Order';
import AboutPage from './components/UI/AboutPage/AboutPage';
import ContactsPage from './components/UI/СontactsPage/СontactsPage';

function App() {
  const user = useAppSelector(selectUser);
  const userSuccess = useAppSelector(selectUserSuccess);
  const dispatch = useAppDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const { i18n } = useTranslation();

  useEffect(() => {
    if (userSuccess) {
      if (i18n.language === 'en') {
        enqueueSnackbar(userSuccess.message.en, {
          variant: 'success',
          preventDuplicate: true,
        });
      } else {
        enqueueSnackbar(userSuccess.message.ru, {
          variant: 'success',
          preventDuplicate: true,
        });
      }
    }
    dispatch(setUserSuccessNull());
  }, [userSuccess, i18n.language, dispatch, enqueueSnackbar]);

  return (
    <Routes>
      <Route path="/" element={<Home />}>
        <Route path="/" element={<MainPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/products/:id" element={<ProductsPage />} />
        <Route path="/product/:id" element={<ProductFullPage />} />
        <Route path="/basket/" element={<BasketPage />} />
        <Route path="/order/" element={<Order />} />
        <Route path="/about/" element={<AboutPage />} />
        <Route path="/contacts/" element={<ContactsPage />} />
        <Route
          path="/my-cabinet"
          element={
            user?.phoneNumber === '000' ? (
              <GoogleProtectedRoute google={user && user.phoneNumber !== '000'}>
                <Cabinet />
              </GoogleProtectedRoute>
            ) : (
              <VerifyProtectedRoute isVerify={user && user.isVerified}>
                <Cabinet />
              </VerifyProtectedRoute>
            )
          }
        />
        <Route
          path="/google"
          element={
            <ProtectedRoute isAllowed={user && Boolean(user)}>
              <GooglePhoneNumber />
            </ProtectedRoute>
          }
        />
        <Route
          path="/verifyPage"
          element={
            <ProtectedRoute isAllowed={user && Boolean(user)}>
              <VerifyPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/verify/:token"
          element={
            <ProtectedRoute isAllowed={user && Boolean(user)}>
              <ConfirmPage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<NoFoundPage />} />
      </Route>
    </Routes>
  );
}

export default App;
