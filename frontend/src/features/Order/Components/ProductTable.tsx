import React, { useEffect, useState } from 'react';
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';

interface Products {
  _id: string;
  name: string;
  price: number;
}

const ProductTable = () => {
  const [products, setProducts] = useState<Products[]>([]);

  useEffect(() => {
    // Получение данных о продуктах из локального хранилища
    const savedProducts = localStorage.getItem('cart');
    if (savedProducts) {
      setProducts(JSON.parse(savedProducts));
    }
  }, []);

  return (
    <TableContainer component={Paper} style={{ marginBottom: '20px' }}>
      <Typography variant="h6" gutterBottom>
        Товары в корзине
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Название товара</TableCell>
            <TableCell align="right">Цена</TableCell>
            {/* Другие заголовки столбцов, если необходимо */}
          </TableRow>
        </TableHead>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product._id}>
              <TableCell>{product.name}</TableCell>
              <TableCell align="right">{product.price} сом</TableCell>
              {/* Другие ячейки данных, если необходимо */}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ProductTable;
