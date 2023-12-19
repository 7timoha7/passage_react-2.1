import axios, { AxiosResponse } from 'axios';
import { IProductFromApi } from '../types';
import express from 'express';
import Product from '../models/Product';

const productFromApiRouter = express.Router();

productFromApiRouter.get('/', async (req, res) => {
  const apiUrl = 'https://fresh-test.1c-cloud.kg/a/edoc/hs/ext_api/execute';
  const username = 'AUTH_TOKEN';
  const password = 'jU5gujas';

  try {
    const response: AxiosResponse = await axios.post(
      apiUrl,
      {
        auth: {
          clientID: 'c02c593e-4c90-11ee-813c-005056b73475',
        },
        general: {
          method: 'goods-get',
          deviceID: '00000001-0001-0001-0001-000000015939',
        },
      },
      {
        headers: {
          Authorization: `Basic ${Buffer.from(`${username}:${password}`, 'utf-8').toString('base64')}`,
          configName: 'AUTHORIZATION',
          configVersion: 'Basic Auth',
        },
      },
    );

    const parsedData = JSON.stringify(response.data.result.goods);

    const productMAss: IProductFromApi[] = JSON.parse(parsedData);
    productMAss.forEach((item) => {
      Product.create({
        categoryId: '657834580a840c9781d65ecb',
        name: item.name,
        unit: '123',
        vendorCode: 123,
        group: 'group',
        cod: 'cod',
        dimensions: 'dimensions',
        weight: '100kg',
        image: '/images/toilet.jpg',
        price: 555,
        desc: 'desc',
      });
    });

    return res.send(parsedData);
  } catch (error) {
    return res.sendStatus(500);
  }
});

export default productFromApiRouter;
