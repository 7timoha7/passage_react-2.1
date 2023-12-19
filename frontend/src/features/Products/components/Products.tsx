import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Grid } from '@mui/material';
import Typography from '@mui/material/Typography';
import { CategoriesType } from '../../../types';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { selectProductsState } from '../productsSlise';
import { productsFetch } from '../productsThunks';
import ProductCard from './ProductCard';

interface Props {
  categoryName: CategoriesType | null;
}

const Products: React.FC<Props> = ({ categoryName }) => {
  const [name, setName] = useState('');
  const dispatch = useAppDispatch();
  const { id } = useParams();
  const productsInCategory = useAppSelector(selectProductsState);

  useEffect(() => {
    if (id) {
      dispatch(productsFetch(id));
    }
    if (categoryName) {
      setName(categoryName.name);
    }
  }, [categoryName, dispatch, id]);

  return (
    <>
      <Typography variant={'h2'} textAlign={'center'}>
        {name}
      </Typography>
      <Grid container spacing={4} mt={2} mb={2}>
        {productsInCategory.map((item) => {
          return (
            <Grid item key={item._id}>
              <ProductCard product={item} />
            </Grid>
          );
        })}
      </Grid>
    </>
  );
};

export default Products;
