import { Box, CircularProgress } from '@mui/material';
import React from 'react';

const Spinner = () => {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <CircularProgress color="error" thickness={6} />
    </Box>
  );
};

export default Spinner;
