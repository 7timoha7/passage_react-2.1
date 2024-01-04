import React, { useEffect } from 'react';
import { Card, CardContent, Grid, List } from '@mui/material';
import MapsHomeWorkIcon from '@mui/icons-material/MapsHomeWork';
import ListItemButton from '@mui/material/ListItemButton';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import HomeIcon from '@mui/icons-material/Home';
import MyInformation from './components/MyInformation';
import { CabinetState } from '../../types';
import { someStyle } from '../../styles';
import { useAppDispatch } from '../../app/hooks';
import { getFavoriteProducts } from '../Products/productsThunks';
import Favorites from './components/Favorites';

const initialState: CabinetState = {
  orders: false,
  favorites: false,
  myInfo: true,
};

interface Props {
  exist?: CabinetState;
}

const UserCabinet: React.FC<Props> = ({ exist = initialState }) => {
  const dispatch = useAppDispatch();
  const [state, setState] = React.useState<CabinetState>(exist);

  useEffect(() => {
    if (state.favorites) {
      dispatch(getFavoriteProducts());
    }
  }, [dispatch, state.favorites, state.orders]);

  const handleClickOrders = () => {
    setState((prev) => ({ ...prev, orders: true, favorites: false, myInfo: false }));
  };

  const handleClickFavorites = () => {
    setState((prev) => ({ ...prev, orders: false, favorites: true, myInfo: false }));
  };

  const handleClickMyInfo = () => {
    setState((prev) => ({ ...prev, orders: false, favorites: false, myInfo: true }));
  };

  return (
    <Card sx={{ minHeight: '600px' }}>
      <CardContent>
        <Grid container flexDirection="row" spacing={2} alignItems="self-start">
          <Grid item xs={12} sm={6} md={3}>
            <List
              sx={{
                width: '100%',
                // maxWidth: 360,
                boxShadow: someStyle.boxShadow,
              }}
              component="nav"
              aria-labelledby="nested-list-subheader"
            >
              <ListItemButton onClick={handleClickMyInfo}>
                <ListItemIcon>
                  <HomeIcon style={state.myInfo ? { color: '#822020' } : {}} />
                </ListItemIcon>
                <ListItemText style={state.myInfo ? { color: '#822020' } : {}} primary={'Моя информация'} />
              </ListItemButton>
              <ListItemButton onClick={handleClickOrders}>
                <ListItemIcon>
                  <MapsHomeWorkIcon style={state.orders ? { color: '#822020' } : {}} />
                </ListItemIcon>
                <ListItemText style={state.orders ? { color: '#822020' } : {}} primary={'Мои заказы'} />
              </ListItemButton>
              <ListItemButton onClick={handleClickFavorites}>
                <ListItemIcon>
                  <FavoriteIcon style={state.favorites ? { color: '#822020' } : {}} />
                </ListItemIcon>
                <ListItemText style={state.favorites ? { color: '#822020' } : {}} primary={'Избранные'} />
              </ListItemButton>
            </List>
          </Grid>
          <Grid item xs>
            {state.myInfo && <MyInformation />}
            {state.favorites && <Favorites />}
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default UserCabinet;
