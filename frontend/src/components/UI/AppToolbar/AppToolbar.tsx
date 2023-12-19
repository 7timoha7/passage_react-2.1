import { AppBar, Box, Container, Grid, styled, Toolbar, Typography } from '@mui/material';
import { useAppSelector } from '../../../app/hooks';
import { selectUser } from '../../../features/users/usersSlice';
import { NavLink } from 'react-router-dom';
import { ToolBarStyles } from '../../../styles';
import NavigateTop from './NavigateTop/NavigateTop';
import Search from './NavigateTop/Components/Search';
import UserMenu from './UserMenu';
import AnonymousMenu from './AnonymousMenu';
import Basket from '../Basket/Basket';
import React from 'react';

const AppToolbar = () => {
  const user = useAppSelector(selectUser);

  const Link = styled(NavLink)({
    color: 'inherit',
    textDecoration: 'none',
    '&:hover': {
      color: 'inherit',
    },
  });
  return (
    <Box mb={3} sx={{ flexGrow: 1, margin: 0 }}>
      <AppBar position="sticky" sx={ToolBarStyles}>
        <Toolbar>
          <Container maxWidth="xl">
            <Grid
              container
              justifyContent="space-between"
              alignItems="center"
              spacing={2}
              sx={{ '@media (max-width: 550px)': { justifyContent: 'center' } }}
            >
              <Grid item>
                <Grid container alignItems="center">
                  <Typography variant="h6" component="div" fontWeight="bold" mr={3}>
                    <Link to="/" style={{ margin: 'auto' }}>
                      <img style={{ maxWidth: '100px' }} src="/logo.svg" alt="passage" />
                    </Link>
                  </Typography>
                </Grid>
              </Grid>
              <Grid item>
                <NavigateTop />
              </Grid>
              <Grid item>
                <Search />
              </Grid>
              <Grid item>{user ? <UserMenu user={user} /> : <AnonymousMenu />}</Grid>
              <Grid item>
                <Basket />
              </Grid>
            </Grid>
          </Container>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default AppToolbar;
