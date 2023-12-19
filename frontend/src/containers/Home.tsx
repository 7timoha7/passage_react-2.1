import Layout from '../components/UI/Layout/Layout';
import React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import { Outlet } from 'react-router-dom';

const Home = () => {
  return (
    <>
      <CssBaseline />
      <Layout>
        <Outlet />
      </Layout>
    </>
  );
};

export default Home;
