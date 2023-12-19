import React from 'react';
import { selectGetUsersByRoleLoading } from '../usersSlice';
import { useAppSelector } from '../../../app/hooks';
import Spinner from '../../../components/UI/Spinner/Spinner';
import { Typography } from '@mui/material';
import UserItem from './UserItem';
import { User } from '../../../types';

interface Props {
  prop: User[];
  role: string;
}

const UserItems: React.FC<Props> = ({ prop, role }) => {
  const loading = useAppSelector(selectGetUsersByRoleLoading);
  return (
    <>
      {loading && <Spinner />}
      {prop.length > 0 ? (
        prop.map((item) => <UserItem key={item._id} prop={item} role={role} />)
      ) : (
        <Typography>There are no users</Typography>
      )}
    </>
  );
};

export default UserItems;
