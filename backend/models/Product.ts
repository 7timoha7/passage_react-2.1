import mongoose, { Types } from 'mongoose';
import { IProduct } from '../types';
import Category from './Category';

const Schema = mongoose.Schema;

const ProductSchema = new Schema<IProduct>({
  categoryId: {
    type: Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
    validate: {
      validator: async (value: Types.ObjectId) => Category.findById(value),
      message: 'Category does not exist',
    },
  },
  name: {
    type: String,
    required: true,
  },
  desc: {
    type: String,
  },
  unit: {
    type: String,
    required: true,
  },
  vendorCode: {
    type: Number,
    required: true,
  },
  group: {
    type: String,
    required: true,
  },
  cod: {
    type: String,
    required: true,
  },
  dimensions: {
    type: String,
    required: true,
  },
  weight: {
    type: String,
    required: true,
  },
  image: {
    type: String,
  },
  price: {
    type: Number,
    required: true,
  },
});

const Product = mongoose.model('Product', ProductSchema);
export default Product;
