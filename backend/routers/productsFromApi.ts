import axios from 'axios';
import express from 'express';
import { ICategoryFromApi, IProductFromApi, IProductPriceFromApi, IProductQuantityFromApi } from '../types';
import path from 'path';
import * as fs from 'fs';
import Product from '../models/Product';
import Category from '../models/Category';

const productFromApiRouter = express.Router();

const fetchData = async (method: string) => {
  const apiUrl = 'https://fresh-test.1c-cloud.kg/a/edoc/hs/ext_api/execute';
  const username = 'AUTH_TOKEN';
  const password = 'jU5gujas';

  try {
    const response = await axios.post(
      apiUrl,
      {
        auth: {
          clientID: '422ba5da-2560-11ee-8135-005056b73475',
        },
        general: {
          method,
          deviceID: '00000001-0001-0001-0001-000000015941',
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

    return response.data;
  } catch (error) {
    console.error('Ошибка при выполнении запроса:', error);
    throw error;
  }
};

const createProducts = async (
  products: IProductFromApi[],
  prices: IProductPriceFromApi[],
  quantities: IProductQuantityFromApi[],
): Promise<void> => {
  try {
    for (const productData of products) {
      const quantityData = quantities.find((q) => q.goodID === productData.goodID);
      if (!quantityData || quantityData.quantity <= 0) {
        // Пропускаем продукты с нулевым количеством
        continue;
      }

      // Проверяем, есть ли у товара артикул
      if (!productData.article) {
        // console.log(`Продукт ${productData.name} (goodID: ${productData.goodID}) не имеет артикула, пропускаем.`);
        continue;
      }

      const priceData = prices.find((p) => p.goodID === productData.goodID);

      // Проверяем наличие цены перед созданием товара
      if (!priceData || !priceData.price) {
        // console.log(`Для продукта ${productData.name} (goodID: ${productData.goodID}) отсутствует цена, пропускаем.`);
        continue;
      }

      const imageFolder = path.join(process.cwd(), 'public/images/imagesProduct', productData.goodID);

      // Создаем папку только если у товара есть изображение
      if (productData.imageBase64 && !fs.existsSync(imageFolder)) {
        fs.mkdirSync(imageFolder, { recursive: true });
      }

      const imageName = 'image.jpg';
      const imagePath = path.join(imageFolder, imageName);

      const product = new Product({
        name: productData.name,
        article: productData.article,
        goodID: productData.goodID,
        measureCode: productData.measureCode,
        measureName: productData.measureName,
        ownerID: productData.ownerID,
        quantity: quantityData.quantity,
        price: priceData.price,
      });

      await product.save();

      // Проверяем, что у продукта есть изображение перед добавлением в массив
      if (productData.imageBase64) {
        fs.writeFileSync(imagePath, productData.imageBase64, 'base64');
        // console.log(`Изображение сохранено: ${imagePath}`);

        // Обновляем товар, добавляя относительный путь к изображению в массив images
        await Product.updateOne(
          { goodID: productData.goodID },
          { $push: { images: path.join('/images/imagesProduct', productData.goodID, imageName) } },
        );
      }
    }

    console.log('Товары успешно созданы и обновлены в базе данных.');
  } catch (error) {
    console.error('Ошибка при создании товаров:', error);
  }
};

const createCategories = async (categoriesData: ICategoryFromApi[]): Promise<void> => {
  try {
    // Шаг 1: Создаем категории, в которых есть товары
    for (const categoryData of categoriesData) {
      const productsForCategory = await Product.find({ ownerID: categoryData.ID });
      if (productsForCategory.length > 0) {
        const newCategory = new Category({
          name: categoryData.name,
          ID: categoryData.ID,
          ownerID: categoryData.ownerID,
        });
        await newCategory.save();
      }
    }

    // Шаг 2: Создаем вышестоящие категории
    for (const categoryData of categoriesData) {
      // Находим родительскую категорию
      const ownerCategory = categoriesData.find((item) => item.ID === categoryData.ownerID);

      // Проверяем, есть ли такая родительская категория и создана ли она
      if (ownerCategory && !(await Category.exists({ ID: ownerCategory.ID }))) {
        const newCategory = new Category({
          name: ownerCategory.name,
          ID: ownerCategory.ID,
          ownerID: ownerCategory.ownerID,
        });
        await newCategory.save();
      }
    }

    console.log('Все категории успешно созданы в базе данных.');
  } catch (error) {
    console.error('Ошибка при создании категорий:', error);
  }
};

productFromApiRouter.get('/', async (req, res) => {
  try {
    console.log('loading...');
    const responseProducts = await fetchData('goods-get');
    const responseQuantity = await fetchData('goods-quantity-get');
    const responsePrice = await fetchData('goods-price-get');

    const products: IProductFromApi[] = responseProducts.result.goods;
    const quantity: IProductQuantityFromApi[] = responseQuantity.result.goods;
    const price: IProductPriceFromApi[] = responsePrice.result.goods;
    const categories: ICategoryFromApi[] = responseProducts.result.goodsGroups;

    await createProducts(products, price, quantity);
    await createCategories(categories);

    console.log('loadingTRUE ! ! ! ');
  } catch (error) {
    console.error('Ошибка:', error);
    return res.sendStatus(500);
  }
});

export default productFromApiRouter;
