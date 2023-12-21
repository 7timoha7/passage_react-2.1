import React, { useState } from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Button, Typography } from '@mui/material';
import AccordionDetails from '@mui/material/AccordionDetails';
import { User } from '../../../types';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { selectUser } from '../usersSlice';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import { LoadingButton } from '@mui/lab';
import { changeRole, getByRole } from '../usersThunks';

interface Props {
  prop: User;
  role: string;
}

const UserItem: React.FC<Props> = ({ prop, role }) => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);

  const [state] = useState({
    id: prop._id,
    role: role === 'hotel' ? 'user' : role === 'user' ? 'hotel' : 'hotel',
  });

  const [open, setOpen] = useState(false);

  const handleClick = () => {
    setOpen(true);
  };

  const handleYes = async () => {
    if (user?.role === 'admin') {
      await dispatch(changeRole(state));
      await dispatch(getByRole(role));
      await setOpen(false);
    } else {
      if (role === 'admin' || role === 'user') {
        await dispatch(
          changeRole({
            ...state,
            role: role === 'admin' ? 'user' : role === 'user' ? 'admin' : 'admin',
          }),
        );
        await dispatch(getByRole(role));
        await setOpen(false);
      } else {
        await dispatch(changeRole(state));
        await dispatch(getByRole(role));
        await setOpen(false);
      }
    }
  };
  return (
    <Accordion
      sx={{
        boxShadow:
          '0px 2px 1px -1px rgba(3, 201, 136, 0.7), 0px 1px 1px 0px rgba(3, 201, 136, 0.7), 0px 1px 3px 0px rgba(3, 201, 136, 0.7)',
      }}
    >
      <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
        <Typography textTransform="capitalize">
          {prop.firstName} {prop.lastName}
        </Typography>
      </AccordionSummary>
      <AccordionDetails sx={{ background: 'WhiteSmoke' }}>
        <Typography textTransform="capitalize">
          {'Имя' + ': '}
          {prop.firstName}
        </Typography>
        <Typography textTransform="capitalize">
          {' '}
          {'Фамилия' + ': '} {prop.lastName}
        </Typography>
        <Typography>
          {' '}
          {'Email' + ': '} {prop.email}
        </Typography>
        <Typography>
          {' '}
          {'Номер телефона' + ': '} {prop.phoneNumber}
        </Typography>
        <Typography>
          {' '}
          {'Верификация' + ': '} {prop.isVerified ? '+' : '-'}
        </Typography>
        <Typography textTransform="capitalize">
          {' '}
          {'Роль' + ': '} {prop.role}
        </Typography>
        {user?.role === 'director' && (
          <LoadingButton color="success" onClick={handleClick}>
            {'Изменить роль'}
          </LoadingButton>
        )}
      </AccordionDetails>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <>
          <DialogContent>
            <Typography variant="body1">
              <>
                {role === 'user' &&
                  `Вы уверены, что хотите ${prop.firstName.toUpperCase()} ${prop.lastName.toUpperCase()} сделать админом?`}
                {role === 'admin' &&
                  `Вы уверены, что хотите забрать у ${prop.firstName.toUpperCase()} ${prop.lastName.toUpperCase()} возможность быть админом?`}
              </>
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpen(false)}>отмена</Button>
            <Button onClick={handleYes}>да</Button>
          </DialogActions>
        </>
      </Dialog>
    </Accordion>
  );
};

export default UserItem;
