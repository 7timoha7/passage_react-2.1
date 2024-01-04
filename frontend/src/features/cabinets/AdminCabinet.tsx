import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { selectUser, selectUsersByRole } from '../users/usersSlice';
import { Box, Card, Grid, List, ListItemButton } from '@mui/material';
import CardContent from '@mui/material/CardContent';
import PersonIcon from '@mui/icons-material/Person';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MyInformation from './components/MyInformation';
import { CabinetState } from '../../types';
import GroupIcon from '@mui/icons-material/Group';
import { getByRole } from '../users/usersThunks';
import UserItems from '../users/components/UserItems';
import { someStyle } from '../../styles';
import Favorites from './components/Favorites';
import FavoriteIcon from '@mui/icons-material/Favorite';

const initialState: CabinetState = {
  myInfo: true,
  myOrders: false,
  users: false,
  favorites: false,
};

interface Props {
  exist?: CabinetState;
}

const AdminCabinet: React.FC<Props> = ({ exist = initialState }) => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const gotUsers = useAppSelector(selectUsersByRole);
  const [selectedIndex, setSelectedIndex] = React.useState<number>(0);
  const [state, setState] = React.useState<CabinetState>(exist);

  useEffect(() => {
    if (user) {
      if (state.users) {
        dispatch(getByRole('user'));
      }
    }
  }, [dispatch, user, state.users]);

  const handleClickOption = (option: string, index: number) => {
    setState((prev) => ({ ...Object.fromEntries(Object.keys(prev).map((key) => [key, false])), [option]: true }));
    setSelectedIndex(index);
  };

  const options = [
    { option: 'myInfo', icon: <PersonIcon />, text: 'Моя информация' },
    { option: 'users', icon: <GroupIcon />, text: 'Пользователи' },
    { option: 'favorites', icon: <FavoriteIcon />, text: 'Избранное' },
  ];

  return (
    <Box mt={3}>
      <Card sx={{ minHeight: '600px' }}>
        <CardContent>
          <Grid container flexDirection="row" spacing={2} alignItems="self-start">
            <Grid item xs={12} sm={6} md={3}>
              <List
                sx={{
                  width: '100%',
                  maxWidth: 360,
                  boxShadow: someStyle.boxShadow,
                }}
                component="nav"
                aria-labelledby="nested-list-subheader"
              >
                {options.map((option, index) => (
                  <ListItemButton
                    key={index}
                    selected={selectedIndex === index}
                    onClick={() => handleClickOption(option.option, index)}
                  >
                    <ListItemIcon style={selectedIndex === index ? { color: '#03C988' } : {}}>
                      {option.icon}
                    </ListItemIcon>
                    <ListItemText style={selectedIndex === index ? { color: '#03C988' } : {}} primary={option.text} />
                  </ListItemButton>
                ))}
              </List>
            </Grid>
            <Grid item xs>
              {state.myInfo && <MyInformation />}
              {state.users && <UserItems prop={gotUsers} role="user" />}
              {state.favorites && <Favorites />}
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};

export default AdminCabinet;
