import mongoose from 'mongoose';
import { ICategory } from '../types';

const Schema = mongoose.Schema;

const CategorySchema = new Schema<ICategory>({
  name: {
    type: String,
    required: true,
  },
});

const Category = mongoose.model('Category', CategorySchema);
export default Category;
