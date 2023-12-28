import mongoose from 'mongoose';
import config from './config';
import Category from './models/Category';
import Product from './models/Product';
import crypto from 'crypto';
import User from './models/User';

const run = async () => {
  mongoose.set('strictQuery', false);
  await mongoose.connect(config.db);
  const db = mongoose.connection;

  try {
    await db.dropCollection('users');
    await db.dropCollection('categories');
    await db.dropCollection('products');
    await db.dropCollection('baskets');
  } catch (e) {
    console.log('Collections were not present, skipping drop...');
  }

  await User.create(
    {
      email: 'admin@gmail.com',
      firstName: 'Admin',
      lastName: 'Adminich',
      password: '123',
      token: crypto.randomUUID(),
      role: 'admin',
      phoneNumber: '0555 777777',
      isVerified: true,
    },
    {
      email: 'user@gmail.com',
      firstName: 'User',
      lastName: 'Userovich',
      password: '123',
      token: crypto.randomUUID(),
      role: 'user',
      phoneNumber: '0555 9999999',
      isVerified: true,
    },
    {
      email: 'director@gmail.com',
      firstName: 'Director',
      lastName: 'Directorovich',
      password: '123',
      token: crypto.randomUUID(),
      role: 'director',
      phoneNumber: '0555 888888',
      isVerified: true,
    },
  );

  const [plumbing, ceramicTile, dishes, carpet, laminate] = await Category.create(
    {
      name: 'plumbing',
    },
    {
      name: 'ceramicTile',
    },
    {
      name: 'dishes',
    },
    {
      name: 'carpet',
    },
    {
      name: 'laminate',
    },
  );

  for (let i = 0; i < 10; i++) {
    await Product.create(
      {
        categoryId: plumbing._id,
        name: 'plumbing1',
        unit: '123',
        vendorCode: 123,
        group: 'group',
        cod: 'cod',
        dimensions: 'dimensions',
        weight: '100kg',
        images: ['/images/toilet.jpg'],
        price: 555,
        desc: 'desc',
      },
      {
        categoryId: plumbing._id,
        name: 'plumbing2',
        unit: '123',
        vendorCode: 123,
        group: 'group',
        cod: 'cod',
        dimensions: 'dimensions',
        weight: '100kg',
        images: ['/images/toilet.jpg'],
        price: 555,
        desc: 'desc',
      },
      {
        categoryId: plumbing._id,
        name: 'plumbing3',
        unit: '123',
        vendorCode: 123,
        group: 'group',
        cod: 'cod',
        dimensions: 'dimensions',
        weight: '100kg',
        images: ['/images/toilet.jpg'],
        price: 555,
        desc: 'desc',
      },

      {
        categoryId: ceramicTile._id,
        name: 'ceramicTile1',
        unit: '123',
        vendorCode: 123,
        group: 'group',
        cod: 'cod',
        dimensions: 'dimensions',
        weight: '100kg',
        images: ['/images/kerama.jpg'],
        price: 555,
        desc: 'desc',
      },
      {
        categoryId: ceramicTile._id,
        name: 'ceramicTile2',
        unit: '123',
        vendorCode: 123,
        group: 'group',
        cod: 'cod',
        dimensions: 'dimensions',
        weight: '100kg',
        images: ['/images/kerama.jpg'],
        price: 555,
        desc: 'desc',
      },
      {
        categoryId: ceramicTile._id,
        name: 'ceramicTile3',
        unit: '123',
        vendorCode: 123,
        group: 'group',
        cod: 'cod',
        dimensions: 'dimensions',
        weight: '100kg',
        images: ['/images/kerama.jpg'],
        price: 555,
        desc: 'desc',
      },

      {
        categoryId: dishes._id,
        name: 'dishes1',
        unit: '123',
        vendorCode: 123,
        group: 'group',
        cod: 'cod',
        dimensions: 'dimensions',
        weight: '100kg',
        images: ['/images/dishes.jpg'],
        price: 555,
        desc: 'desc',
      },
      {
        categoryId: dishes._id,
        name: 'dishes2',
        unit: '123',
        vendorCode: 123,
        group: 'group',
        cod: 'cod',
        dimensions: 'dimensions',
        weight: '100kg',
        images: ['/images/dishes.jpg'],
        price: 555,
        desc: 'desc',
      },
      {
        categoryId: dishes._id,
        name: 'dishes3',
        unit: '123',
        vendorCode: 123,
        group: 'group',
        cod: 'cod',
        dimensions: 'dimensions',
        weight: '100kg',
        images: ['/images/dishes.jpg'],
        price: 555,
        desc: 'desc',
      },

      {
        categoryId: carpet._id,
        name: 'carpet1',
        unit: '123',
        vendorCode: 123,
        group: 'group',
        cod: 'cod',
        dimensions: 'dimensions',
        weight: '100kg',
        images: ['/images/karpet.jpg'],
        price: 555,
        desc: 'desc',
      },
      {
        categoryId: carpet._id,
        name: 'carpet2',
        unit: '123',
        vendorCode: 123,
        group: 'group',
        cod: 'cod',
        dimensions: 'dimensions',
        weight: '100kg',
        images: ['/images/karpet.jpg'],
        price: 555,
        desc: 'desc',
      },
      {
        categoryId: carpet._id,
        name: 'carpet3',
        unit: '123',
        vendorCode: 123,
        group: 'group',
        cod: 'cod',
        dimensions: 'dimensions',
        weight: '100kg',
        images: ['/images/karpet.jpg'],
        price: 555,
        desc: 'desc',
      },

      {
        categoryId: laminate._id,
        name: 'laminate1',
        unit: '123',
        vendorCode: 123,
        group: 'group',
        cod: 'cod',
        dimensions: 'dimensions',
        weight: '100kg',
        images: ['/images/laminat.jpg'],
        price: 555,
        desc: 'desc',
      },
      {
        categoryId: laminate._id,
        name: 'laminate2',
        unit: '123',
        vendorCode: 123,
        group: 'group',
        cod: 'cod',
        dimensions: 'dimensions',
        weight: '100kg',
        images: [],
        price: 555,
        desc: 'desc',
      },
      {
        categoryId: laminate._id,
        name: 'laminate3',
        unit: '123',
        vendorCode: 123,
        group: 'group',
        cod: 'cod',
        dimensions: 'dimensions',
        weight: '100kg',
        images: ['/images/laminat.jpg'],
        price: 555,
        desc: 'desc',
      },
      {
        categoryId: plumbing._id,
        name: 'plumbing1',
        unit: '123',
        vendorCode: 123,
        group: 'group',
        cod: 'cod',
        dimensions: 'dimensions',
        weight: '100kg',
        images: ['/images/toilet.jpg'],
        price: 555,
        desc: 'desc',
      },
      {
        categoryId: plumbing._id,
        name: 'plumbing2',
        unit: '123',
        vendorCode: 123,
        group: 'group',
        cod: 'cod',
        dimensions: 'dimensions',
        weight: '100kg',
        images: ['/images/toilet.jpg'],
        price: 555,
        desc: 'desc',
      },
      {
        categoryId: plumbing._id,
        name: 'plumbing3',
        unit: '123',
        vendorCode: 123,
        group: 'group',
        cod: 'cod',
        dimensions: 'dimensions',
        weight: '100kg',
        images: ['/images/toilet.jpg'],
        price: 555,
        desc: 'desc',
      },

      {
        categoryId: ceramicTile._id,
        name: 'ceramicTile1',
        unit: '123',
        vendorCode: 123,
        group: 'group',
        cod: 'cod',
        dimensions: 'dimensions',
        weight: '100kg',
        images: ['/images/kerama.jpg'],
        price: 555,
        desc: 'desc',
      },
      {
        categoryId: ceramicTile._id,
        name: 'ceramicTile2',
        unit: '123',
        vendorCode: 123,
        group: 'group',
        cod: 'cod',
        dimensions: 'dimensions',
        weight: '100kg',
        images: ['/images/kerama.jpg'],
        price: 555,
        desc: 'desc',
      },
      {
        categoryId: ceramicTile._id,
        name: 'ceramicTile3',
        unit: '123',
        vendorCode: 123,
        group: 'group',
        cod: 'cod',
        dimensions: 'dimensions',
        weight: '100kg',
        images: ['/images/kerama.jpg'],
        price: 555,
        desc: 'desc',
      },

      {
        categoryId: dishes._id,
        name: 'dishes1',
        unit: '123',
        vendorCode: 123,
        group: 'group',
        cod: 'cod',
        dimensions: 'dimensions',
        weight: '100kg',
        images: ['/images/dishes.jpg'],
        price: 555,
        desc: 'desc',
      },
      {
        categoryId: dishes._id,
        name: 'dishes2',
        unit: '123',
        vendorCode: 123,
        group: 'group',
        cod: 'cod',
        dimensions: 'dimensions',
        weight: '100kg',
        images: ['/images/dishes.jpg'],
        price: 555,
        desc: 'desc',
      },
      {
        categoryId: dishes._id,
        name: 'dishes3',
        unit: '123',
        vendorCode: 123,
        group: 'group',
        cod: 'cod',
        dimensions: 'dimensions',
        weight: '100kg',
        images: ['/images/dishes.jpg'],
        price: 555,
        desc: 'desc',
      },

      {
        categoryId: carpet._id,
        name: 'carpet1',
        unit: '123',
        vendorCode: 123,
        group: 'group',
        cod: 'cod',
        dimensions: 'dimensions',
        weight: '100kg',
        images: ['/images/karpet.jpg'],
        price: 555,
        desc: 'desc',
      },
      {
        categoryId: carpet._id,
        name: 'carpet2',
        unit: '123',
        vendorCode: 123,
        group: 'group',
        cod: 'cod',
        dimensions: 'dimensions',
        weight: '100kg',
        images: ['/images/karpet.jpg'],
        price: 555,
        desc: 'desc',
      },
      {
        categoryId: carpet._id,
        name: 'carpet3',
        unit: '123',
        vendorCode: 123,
        group: 'group',
        cod: 'cod',
        dimensions: 'dimensions',
        weight: '100kg',
        images: ['/images/karpet.jpg'],
        price: 555,
        desc: 'desc',
      },

      {
        categoryId: laminate._id,
        name: 'laminate1',
        unit: '123',
        vendorCode: 123,
        group: 'group',
        cod: 'cod',
        dimensions: 'dimensions',
        weight: '100kg',
        images: ['/images/laminat.jpg'],
        price: 555,
        desc: 'desc',
      },
      {
        categoryId: laminate._id,
        name: 'laminate2',
        unit: '123',
        vendorCode: 123,
        group: 'group',
        cod: 'cod',
        dimensions: 'dimensions',
        weight: '100kg',
        images: [],
        price: 555,
        desc: 'desc',
      },
      {
        categoryId: laminate._id,
        name: 'laminate3',
        unit: '123',
        vendorCode: 123,
        group: 'group',
        cod: 'cod',
        dimensions: 'dimensions',
        weight: '100kg',
        images: ['/images/laminat.jpg'],
        price: 555,
        desc: 'desc',
      },
    );
  }

  await db.close();

  // ----------------------------------------------------------------------

  // const apiUrl = 'https://fresh-test.1c-cloud.kg/a/edoc/hs/ext_api/execute';
  // const username = 'AUTH_TOKEN';
  // const password = 'jU5gujas';
  //
  // try {
  //   const response: AxiosResponse = await axios.post(apiUrl, {
  //     auth: {
  //       clientID: 'c02c593e-4c90-11ee-813c-005056b73475',
  //     },
  //     general: {
  //       method: 'goods-get',
  //       deviceID: '00000001-0001-0001-0001-000000015939',
  //     },
  //   }, {
  //     headers: {
  //       Authorization: `Basic ${Buffer.from(`${username}:${password}`, 'utf-8').toString('base64')}`,
  //       configName: 'AUTHORIZATION',
  //       configVersion: 'Basic Auth',
  //     },
  //   });
  //
  //   // Обработка ответа от API
  //   const parsedData = JSON.stringify(response.data, null, 2);
  //   console.log('API Response:', parsedData);
  //
  //   // Ваш код для создания продуктов на основе данных из API response
  //
  // } catch (error) {
  //   console.log(error);
  // }

  // ********************получает с ключом картинкой
  // const apiUrl = 'https://fresh-test.1c-cloud.kg/a/edoc/hs/ext_api/execute';
  // const username = 'AUTH_TOKEN';
  // const password = 'jU5gujas';
  //
  // interface Product {
  //   name: string;
  //   sku: string;
  //   goodID: string;
  //   type: number;
  //   vat: string;
  //   st: string;
  //   barcode: string;
  //   markType: number;
  //   measureCode: string;
  //   measureName: string;
  //   imageBase64?: string; // Добавляем опциональное свойство для изображения
  // }
  //
  // try {
  //   const response: AxiosResponse = await axios.post(apiUrl, {
  //     auth: {
  //       clientID: '0adee25e-53a3-11ee-813e-005056b73475',
  //     },
  //     general: {
  //       method: 'goods-get',
  //       deviceID: '00000001-0001-0001-0001-000000015933',
  //     },
  //   }, {
  //     headers: {
  //       Authorization: `Basic ${Buffer.from(`${username}:${password}`, 'utf-8').toString('base64')}`,
  //       configName: 'AUTHORIZATION',
  //       configVersion: 'Basic Auth',
  //     },
  //   });
  //
  //   // Обработка ответа от API
  //   const goods: Product[] = response.data.result.goods;
  //
  //   // Обновление каждого товара с добавлением ключа imageBase64
  //   goods.forEach((product) => {
  //     // Добавление ключа imageBase64 с данными изображения
  //     product.imageBase64 = product.imageBase64 || ''; // Проверка, чтобы избежать ошибок, если данных об изображении нет
  //   });
  //
  //   // Вывод обновленного массива товаров
  //   console.log('Updated Goods:', goods);
  //
  //   // Ваш код для создания продуктов на основе данных из API response
  //
  // } catch (error) {
  //   console.log(error);
  // }

  // -------------------**************************сохраняет картинки___________________

  //
  // interface Product {
  //   name: string;
  //   barcode: string;
  //   imageBase64: string;
  // }
  //
  // const apiUrl = 'https://fresh-test.1c-cloud.kg/a/edoc/hs/ext_api/execute';
  // const username = 'AUTH_TOKEN';
  // const password = 'jU5gujas';
  //
  // try {
  //   const response: AxiosResponse = await axios.post(apiUrl, {
  //     auth: {
  //       clientID: 'c02c593e-4c90-11ee-813c-005056b73475',
  //     },
  //     general: {
  //       method: 'goods-get',
  //       deviceID: '00000001-0001-0001-0001-000000015939',
  //     },
  //   }, {
  //     headers: {
  //       Authorization: `Basic ${Buffer.from(`${username}:${password}`, 'utf-8').toString('base64')}`,
  //       configName: 'AUTHORIZATION',
  //       configVersion: 'Basic Auth',
  //     },
  //   });
  //
  //   const goods: Product[] = response.data.result.goods;
  //
  //   // Папка, в которую будут сохраняться изображения (в текущей директории)
  //   const imageFolder = path.join(process.cwd(), 'images');
  //
  //   // Создание папки, если её нет
  //   if (!fs.existsSync(imageFolder)) {
  //     fs.mkdirSync(imageFolder);
  //   }
  //
  //   // Сохранение изображений в папку
  //   goods.forEach((product, index) => {
  //     if (product.imageBase64) {
  //       const imageName = `image_${index + 1}.png`;
  //       const imagePath = path.join(imageFolder, imageName);
  //
  //       // Сохранение изображения
  //       fs.writeFileSync(imagePath, product.imageBase64, 'base64');
  //
  //       console.log(`Image saved: ${imagePath}`);
  //     }
  //   });
  //
  //   // Ваш код для создания продуктов на основе данных из API response
  //
  // } catch (error) {
  //   console.log(error);
  // }
};

run().catch(console.error);
