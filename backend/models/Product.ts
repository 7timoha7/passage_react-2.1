import mongoose from 'mongoose';
import { IProduct } from '../types';

const Schema = mongoose.Schema;

const ProductSchema = new Schema<IProduct>({
  // categoryId: {
  //   type: Schema.Types.ObjectId,
  //   ref: 'Category',
  //   // required: true,
  //   validate: {
  //     validator: async (value: Types.ObjectId) => Category.findById(value),
  //     message: 'Category does not exist',
  //   },
  name: {
    type: String,
    // required: true,
  },

  images: {
    type: [String],
    default: [],
  },
  price: {
    type: Number,
    required: true,
    // default: 0,
  },
  quantity: {
    type: Number,
    required: true,
  },
  article: {
    type: String,
    required: true,
  },
  goodID: {
    type: String,
    required: true,
  },
  measureCode: {
    type: String,
    // required: true,
  },
  measureName: {
    type: String,
    // required: true,
  },
  ownerID: {
    type: String,
    required: true,
  },
});

const Product = mongoose.model('Product', ProductSchema);
export default Product;
