import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';
import React from 'react';

const NavigateTop = () => {
  const menu = [
    {
      name: 'Главная',
      link: '/',
    },
    {
      name: 'Контакты',
      link: '/contacts',
    },
    {
      name: 'Акции',
      link: '/special-offers',
    },
    {
      name: 'О нас',
      link: '/about',
    },
  ];

  return (
    <Box display="flex" sx={{ flexWrap: 'wrap' }}>
      {menu.map((item) => (
        <Button
          component={Link}
          to={item.link}
          sx={{
            color: 'black',
            fontSize: '17px',
            fontWeight: 'bold',
            textDecoration: 'none',
            marginRight: '20px',
          }}
          key={item.name}
        >
          {item.name}
        </Button>
      ))}
    </Box>
  );
};

export default NavigateTop;
