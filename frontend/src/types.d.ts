export interface User {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  phoneNumber: string;
  token?: string;
  favorites: string[];
  isVerified: boolean;
}

export interface LoginMutation {
  email: string;
  password: string;
}

export interface RegisterMutation extends LoginMutation {
  firstName: string;
  lastName: string;
  phoneNumber: string;
}

export interface RegisterResponse {
  message: string;
  user: User;
}

export interface ValidationError {
  errors: {
    [key: string]: {
      name: string;
      message: string;
    };
  };
  message: string;
  name: string;
  _name: string;
}

export interface GlobalError {
  error: string;
}

export interface GlobalSuccess {
  message: {
    ru: string;
    en: string;
  };
}

export interface MenuType {
  name: string;
  value: boolean;
}

export interface CategoriesType {
  _id: string;
  name: string;
}

export interface ProductType {
  _id: string;
  categoryId: string;
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

export interface ProductBasketType extends ProductType {
  quantity: number;
}

export interface CabinetState {
  [key: string]: boolean;
}
