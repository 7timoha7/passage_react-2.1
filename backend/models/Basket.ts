import mongoose, { Schema, Types } from 'mongoose';
import { IBasket } from '../types';
import Product from './Product';

const BasketSchema = new Schema<IBasket>({
  user_id: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    validate: {
      validator: async (value: Types.ObjectId) => mongoose.model('User').findById(value),
      message: 'User does not exist',
    },
  },
  session_key: {
    type: String,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
  items: {
    type: [
      {
        product: {
          type: Schema.Types.ObjectId,
          ref: 'Product',
          validate: {
            validator: async (value: Types.ObjectId) => Product.findById(value),
            message: 'Product does not exist',
          },
        },
        quantity: {
          type: Number,
          required: true,
          default: 1,
        },
      },
    ],
    default: [],
  },
  totalPrice: {
    type: Number,
    default: 0,
  },
});

const Basket = mongoose.model<IBasket>('Basket', BasketSchema);

export default Basket;
