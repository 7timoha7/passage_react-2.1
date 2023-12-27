import React, { useState, ChangeEvent, FormEvent } from 'react';
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
  Paper,
  Typography,
} from '@mui/material';
import { MuiTelInput } from 'mui-tel-input';
import ProductTable from './Components/ProductTable';

interface FormData {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  address: string;
  email: string;
  paymentMethod: string;
  deliveryMethod: string;
  orderComments: string;
}

const Order = () => {
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    address: '',
    email: '',
    paymentMethod: '',
    deliveryMethod: '',
    orderComments: '',
  });

  const [deliveryMethod, setDeliveryMethod] = useState<string>('');

  const deliveryMethods = ['самовывоз', 'доставка'];

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSelectChange = (e: SelectChangeEvent) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleDeliveryChange = (e: SelectChangeEvent) => {
    const { value } = e.target;
    setDeliveryMethod(value as string);
    setFormData((prevData) => ({
      ...prevData,
      deliveryMethod: value as string,
      address: value === 'самовывоз' ? '' : prevData.address,
    }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Отправка данных', formData);
  };

  const phoneChangeHandler = (newPhone: string) => {
    setFormData((prevState) => ({ ...prevState, phoneNumber: newPhone }));
  };

  return (
    <Paper
      style={{
        maxWidth: '600px',
        margin: 'auto',
        marginTop: '10px',
        padding: '20px',
        backgroundColor: '#fff',
        borderRadius: '8px',
        boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
      }}
    >
      <ProductTable />
      <Typography variant="h6" gutterBottom>
        Заполните данные
      </Typography>
      <form style={{ display: 'flex', flexDirection: 'column' }} onSubmit={handleSubmit}>
        <TextField
          label="Имя"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          required
          style={{ marginBottom: '15px' }}
        />
        <TextField
          label="Фамилия"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          required
          style={{ marginBottom: '15px' }}
        />
        <MuiTelInput
          label={'Номер телефона'}
          onChange={phoneChangeHandler}
          defaultCountry={'KG'}
          name="phoneNumber"
          value={formData.phoneNumber}
          style={{ marginBottom: '15px' }}
        />
        <TextField
          label="Email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          style={{ marginBottom: '15px' }}
          type={'email'}
        />
        <FormControl style={{ marginBottom: '15px', width: '100%' }}>
          <InputLabel id="paymentMethodLabel">Способ оплаты *</InputLabel>
          <Select
            labelId="paymentMethodLabel"
            name="paymentMethod"
            value={formData.paymentMethod}
            onChange={handleSelectChange}
            required
            label={'Способ оплаты *'}
          >
            <MenuItem value="наличные">Наличные</MenuItem>
            <MenuItem value="безналичные">Безналичные</MenuItem>
          </Select>
        </FormControl>
        <FormControl style={{ marginBottom: '15px', width: '100%' }}>
          <InputLabel id="deliveryMethodLabel">Способ доставки *</InputLabel>
          <Select
            labelId="deliveryMethodLabel"
            name="deliveryMethod"
            value={deliveryMethod}
            onChange={handleDeliveryChange}
            required
            label={'Способ доставки *'}
          >
            {deliveryMethods.map((method) => (
              <MenuItem key={method} value={method}>
                {method}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          label="Адрес доставки"
          name="address"
          value={formData.address}
          onChange={handleChange}
          required={deliveryMethod === 'доставка'}
          disabled={deliveryMethod === 'самовывоз' || !deliveryMethod}
          style={{ marginBottom: '15px' }}
        />
        <TextField
          label="Комментарии к заказу"
          name="orderComments"
          value={formData.orderComments}
          onChange={handleChange}
          multiline
          rows={4}
          style={{ marginBottom: '15px' }}
        />
        <Button variant="contained" color="primary" type="submit" style={{ marginTop: '15px' }}>
          Отправить заказ
        </Button>
      </form>
    </Paper>
  );
};

export default Order;
