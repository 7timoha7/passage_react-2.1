import React from 'react';
import { Box, useMediaQuery, Container } from '@mui/material';
import AppToolbar from '../AppToolbar/AppToolbar';
import MenuCategories from '../../../features/MenuCategories/MenuCategories';
import Footer from '../Footer/Footer';

const Layout: React.FC<React.PropsWithChildren> = ({ children }) => {
  const isMobile = useMediaQuery('(max-width:1200px)');

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
          <Container sx={{ mt: 2, mb: 2 }}>{children}</Container>
        </Box>
      </Box>
      <footer style={{ flexShrink: 0 }}>
        <Footer />
      </footer>
    </Box>
  );
};

export default Layout;
