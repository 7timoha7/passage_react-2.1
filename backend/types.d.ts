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
}

export interface IProduct {
  categoryId: ObjectId;
  name: string;
  desc?: string;
  unit: string;
  vendorCode: number;
  group: string;
  cod: string;
  dimensions: string;
  weight: string;
  image: string | null;
  price: number;
}

export interface IProductFromApi {
  article: string;
  barcode: string;
  goodID: string;
  imageBase64: string;
  markType: number;
  measureCode: string;
  measureName: string;
  name: string;
  sku: string;
  st: string;
  type: number;
  vat: string;
}
