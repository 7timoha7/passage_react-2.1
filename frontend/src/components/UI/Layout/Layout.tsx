import React from 'react';
import { Box, useMediaQuery, Container } from '@mui/material';
import AppToolbar from '../AppToolbar/AppToolbar';
import MenuCategories from '../../../features/MenuCategories/MenuCategories';
import Footer from '../Footer/Footer';
import { useLocation } from 'react-router-dom';

const Layout: React.FC<React.PropsWithChildren> = ({ children }) => {
  const isMobile = useMediaQuery('(max-width:1200px)');
  const location = useLocation();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <header>
        <AppToolbar />
      </header>
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
        }}
      >
        <MenuCategories />
        <Box maxWidth={'100%'} component="main" sx={{ flex: 1, boxSizing: 'border-box' }}>
          {location.pathname === '/' ? <Box>{children}</Box> : <Container sx={{ mt: 2, mb: 2 }}>{children}</Container>}
          {/*<Container sx={{ mt: 2, mb: 2 }}>{children}</Container>*/}
          {/*<Box>{children}</Box>*/}
        </Box>
      </Box>
      <footer style={{ flexShrink: 0 }}>
        <Footer />
      </footer>
    </Box>
  );
};

export default Layout;
