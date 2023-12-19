import React, { useEffect } from 'react';

import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { selectUser, selectUsersByRole } from '../users/usersSlice';

import { Box, Card, Grid, List, ListItemButton } from '@mui/material';
import CardContent from '@mui/material/CardContent';
import WorkIcon from '@mui/icons-material/Work';
import MapsHomeWorkIcon from '@mui/icons-material/MapsHomeWork';
import PersonIcon from '@mui/icons-material/Person';
import UnpublishedIcon from '@mui/icons-material/Unpublished';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MyInformation from './components/MyInformation';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import WorkspacesIcon from '@mui/icons-material/Workspaces';
import LocationCityIcon from '@mui/icons-material/LocationCity';
import { CabinetState } from '../../types';
import LivingIcon from '@mui/icons-material/Living';
import RoomPreferencesIcon from '@mui/icons-material/RoomPreferences';
import DeleteIcon from '@mui/icons-material/Delete';
import GroupIcon from '@mui/icons-material/Group';
import { getByRole } from '../users/usersThunks';
import UserItems from '../users/components/UserItems';
import ManageAccountsOutlinedIcon from '@mui/icons-material/ManageAccountsOutlined';
import { someStyle } from '../../styles';

const initialState: CabinetState = {
  myInfo: true,
  myOrders: false,
  myHotels: false,
  createHotel: false,
  unacceptedOrders: false,
  hotelStatus: false,
  createRoomType: false,
  roomTypes: false,
  unPublished: false,
  deleteHotel: false,
  users: false,
  serviceProviders: false,
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
      // if (state.unPublished) {
      //   dispatch(fetchUnPublishedHotels());
      // }
      // if (state.myHotels) {
      //   dispatch(fetchHotels(user._id));
      // }
      // if (state.myOrders) {
      //   dispatch(getForAdminHisOrders(user._id));
      // }
      // if (state.unacceptedOrders) {
      //   dispatch(getOrders());
      // }
      // if (state.roomTypes) {
      //   dispatch(fetchRoomTypes());
      // }
      if (state.users) {
        dispatch(getByRole('user'));
      }
      if (state.serviceProviders) {
        dispatch(getByRole('hotel'));
      }
    }
  }, [
    dispatch,
    user,
    state.myHotels,
    state.myOrders,
    state.unacceptedOrders,
    state.roomTypes,
    state.unPublished,
    state.users,
    state.serviceProviders,
  ]);

  const handleClickOption = (option: string, index: number) => {
    setState((prev) => ({ ...Object.fromEntries(Object.keys(prev).map((key) => [key, false])), [option]: true }));
    setSelectedIndex(index);
  };

  const options = [
    { option: 'myInfo', icon: <PersonIcon />, text: 'myInfo' },
    { option: 'myOrders', icon: <WorkIcon />, text: 'myOrders' },
    { option: 'unacceptedOrders', icon: <WorkspacesIcon />, text: 'unacceptedOrders' },
    { option: 'myHotels', icon: <MapsHomeWorkIcon />, text: 'myHotels' },
    { option: 'createHotel', icon: <AddCircleIcon />, text: 'createHotel' },
    { option: 'hotelStatus', icon: <LocationCityIcon />, text: 'hotelStatus' },
    { option: 'createRoomType', icon: <LivingIcon />, text: 'createRoomType' },
    { option: 'roomTypes', icon: <RoomPreferencesIcon />, text: 'roomType' },
    { option: 'unPublished', icon: <UnpublishedIcon />, text: 'UnPublished' },
    { option: 'deleteHotel', icon: <DeleteIcon />, text: 'removeHotel' },
    { option: 'users', icon: <GroupIcon />, text: 'users' },
    { option: 'serviceProviders', icon: <ManageAccountsOutlinedIcon />, text: 'serviceProviders' },
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
              {state.serviceProviders && <UserItems prop={gotUsers} role="hotel" />}
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};

export default AdminCabinet;
