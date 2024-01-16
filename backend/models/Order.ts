import mongoose, { HydratedDocument, Schema, Types } from 'mongoose';
import User from './User';
import { IOrder, IUser } from '../types';
import Product from './Product';

const OrderSchema = new Schema<IOrder>({
  user_id: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    validate: {
      validator: async (value: Types.ObjectId) => await User.findById(value),
      message: 'User not found!',
    },
  },
  admin_id: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    default: null,
    validate: {
      validator: async (value: Types.ObjectId) => {
        if (value === null) {
          return true;
        }
        const user: HydratedDocument<IUser> | null = await User.findById(value);
        return user && user.role === 'admin';
      },
      message: 'cant find admin',
    },
  },
  createdAt: {
    type: String,
    required: true,
    default: new Date().toISOString(),
  },
  status: {
    type: String,
    required: true,
    default: 'open',
    enum: ['open', 'in progress', 'closed', 'return'],
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
    required: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  paymentMethod: {
    type: String,
    required: true,
  },
  orderComment: {
    type: String,
  },
});

const Order = mongoose.model<IOrder>('Order', OrderSchema);

export default Order;
