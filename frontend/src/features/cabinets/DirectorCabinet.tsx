import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { getByRole } from '../users/usersThunks';
import { selectGetUsersByRoleLoading, selectUsersByRole } from '../users/usersSlice';
import { Box, Card, CardContent, Grid, List, Typography } from '@mui/material';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import PersonIcon from '@mui/icons-material/Person';

import { useTranslation } from 'react-i18next';
import GroupIcon from '@mui/icons-material/Group';
import { CabinetState } from '../../types';
import UserItems from '../users/components/UserItems';
import WcIcon from '@mui/icons-material/Wc';
import MyInformation from './components/MyInformation';
import { someStyle } from '../../styles';
import FavoriteIcon from '@mui/icons-material/Favorite';
import Favorites from './components/Favorites';

const initialState: CabinetState = {
  myInfo: true,
  simpleUsers: false,
  admins: false,
  favorites: false,
};

interface Props {
  exist?: CabinetState;
}

const DirectorCabinet: React.FC<Props> = ({ exist = initialState }) => {
  const dispatch = useAppDispatch();
  const loading = useAppSelector(selectGetUsersByRoleLoading);
  const gotUsers = useAppSelector(selectUsersByRole);

  const [selectedIndex, setSelectedIndex] = React.useState<number>(0);
  const [state, setState] = React.useState<CabinetState>(exist);

  useEffect(() => {
    if (state.simpleUsers) {
      dispatch(getByRole('user'));
    } else if (state.admins) {
      dispatch(getByRole('admin'));
    }
  }, [dispatch, state.simpleUsers, state.admins]);

  const options = [
    { option: 'myInfo', icon: <PersonIcon />, text: 'Моя информация' },
    { option: 'simpleUsers', icon: <GroupIcon />, text: 'Пользователи' },
    { option: 'admins', icon: <WcIcon />, text: 'Админы' },
    { option: 'favorites', icon: <FavoriteIcon />, text: 'Избранное' },
  ];

  const handleClickOption = (option: string, index: number) => {
    setState((prev) => ({ ...Object.fromEntries(Object.keys(prev).map((key) => [key, false])), [option]: true }));
    setSelectedIndex(index);
  };

  return (
    <Box mt={3}>
      {loading && <Typography>loading...</Typography>}
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
              {state.simpleUsers && <UserItems prop={gotUsers} role="user" />}
              {state.admins && <UserItems prop={gotUsers} role="admin" />}
              {state.favorites && <Favorites />}
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};

export default DirectorCabinet;
