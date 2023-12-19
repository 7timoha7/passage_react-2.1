import React, { useEffect } from 'react';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { selectCategories } from './menuCategoriesSlice';
import { fetchCategories } from './menuCategoriesThunks';
import AccordionCategories from './AccordionCategories';
import { Typography } from '@mui/material';

const drawerWidth = 240;

const MenuCategories = () => {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  // const categoriesMass = ['Сантехника', 'Керамогранит', 'Ламинат', 'Посуда', 'Ковролин'];
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  const dispatch = useAppDispatch();
  const categories = useAppSelector(selectCategories);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const closeMenu = () => {
    setMobileOpen(false);
  };

  const drawer = (
    <>
      <AccordionCategories categories={categories} close={closeMenu} />
    </>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <Box
        component="nav"
        sx={{
          width: { lg: drawerWidth },
          flexShrink: { sm: 0 },
          background: 'linear-gradient(270deg, rgb(47, 36, 36), rgb(204, 43, 43))',
        }}
        aria-label="mailbox folders"
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', lg: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              background: 'linear-gradient(270deg, rgb(47, 36, 36), rgb(204, 43, 43))',
            },
            '& .MuiDrawer-paperAnchorLeft': {
              width: drawerWidth,
            },
          }}
        >
          <Box sx={{ m: 0, background: 'rgba(166,143,143,0.38)', pt: 1.5, pb: 1.5 }}>
            <Typography variant={'h6'} textAlign={'center'}>
              Каталог товаров
            </Typography>
          </Box>
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', lg: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              position: 'unset',
              background: 'rgba(47,36,36,0)',
            },
          }}
          open
        >
          <Box sx={{ m: 0, background: 'rgba(166,143,143,0.38)', pt: 2, pb: 2 }}>
            <Typography variant={'h5'} textAlign={'center'}>
              Каталог товаров
            </Typography>
          </Box>
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          pl: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          background: 'rgba(166,143,143,0.38)',
          display: { lg: 'none' },
        }}
      >
        <IconButton color="inherit" aria-label="open drawer" edge="start" onClick={handleDrawerToggle} sx={{ mr: 2 }}>
          <MenuIcon fontSize={'large'} />
          <Typography variant={'h6'} textAlign={'center'} sx={{ ml: 1 }}>
            Каталог товаров
          </Typography>
        </IconButton>
      </Box>
    </Box>
  );
};

export default MenuCategories;
