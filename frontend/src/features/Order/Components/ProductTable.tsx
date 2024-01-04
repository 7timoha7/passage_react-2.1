import React from 'react';
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import { useSelector } from 'react-redux';
import { selectBasket } from '../../Basket/basketSlice';

const ProductTable = () => {
  const basket = useSelector(selectBasket);

  return (
    <TableContainer component={Paper} style={{ marginBottom: '20px' }}>
      <Typography variant="h6" textAlign={'center'}>
        Товары в корзине
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Название товара</TableCell>
            <TableCell align="right">Количество</TableCell>
            <TableCell align="right">Итого</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {basket?.items.map((product) => (
            <TableRow key={product._id}>
              <TableCell>{product.product.name}</TableCell>
              <TableCell align="center">{product.quantity}</TableCell>
              <TableCell align="right">{product.product.price * product.quantity} сом</TableCell>
            </TableRow>
          ))}
          <TableRow>
            <TableCell>
              {basket && (
                <Typography variant="h6" gutterBottom>
                  Итоговая стоимость: {basket.totalPrice} сом
                </Typography>
              )}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ProductTable;
