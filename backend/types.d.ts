import { ObjectId } from 'mongoose';

export interface IUser {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: string;
  phoneNumber: string;
  token: string;
  favorites: ObjectId[];
  googleId?: string;
  isVerified: boolean;
  verificationToken: string | null;
}

export interface ICategory {
  name: string;
  ID: string;
  ownerID?: string;
}

export interface ICategoryFromApi {
  name: string;
  ID: string;
  ownerID?: string;
}

export interface IProduct {
  // categoryId: ObjectId;
  name: string;
  article: string;
  goodID: string;
  measureCode: string;
  measureName: string;
  ownerID: string;
  images: string[] | null;
  quantity: number;
  price: number;
}

export interface IProductQuantityFromApi {
  name: string;
  goodID: string;
  stockID: string;
  quantity: number;
}

export interface IProductPriceFromApi {
  name: string;
  goodID: string;
  typeID: string;
  date: string;
  price: number;
}

export interface IProductFromApi {
  name: string;
  article: string;
  sku: string;
  goodID: string;
  type: number;
  vat: string;
  st: string;
  barcode: string;
  markType: number;
  measureCode: string;
  measureName: string;
  ownerID: string;
  imageBase64: string;
  imagesBase64: [];
}

export interface IBasket {
  user_id?: ObjectId;
  session_key?: string;
  created_at: Date;
  updated_at: Date;
  items: {
    product: ObjectId;
    quantity: number;
  }[];
  totalPrice: number;
}

export interface IOrder {
  user_id: ObjectId;
  admin_id: ObjectId | undefined;
  createdAt: string;
  status: string;
  items: {
    product: ObjectId;
    quantity: number;
  }[];
  totalPrice: number;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  address: string;
  email: string;
  paymentMethod: string;
  orderComment: string;
}
