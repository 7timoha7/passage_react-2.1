import express from 'express';
import Product from '../models/Product';
import mongoose, { HydratedDocument } from 'mongoose';
import auth, { RequestWithUser } from '../middleware/auth';
import permit from '../middleware/permit';
import { imagesUpload } from '../multer';
import { IProduct } from '../types';
import { promises as fs } from 'fs';

const productRouter = express.Router();

productRouter.post('/', async (req, res, next) => {
  try {
    const product = new Product({
      categoryId: req.body.categoryId,
      name: req.body.name,
      desc: req.body.desc,
      unit: req.body.unit,
      vendorCode: parseInt(req.body.vendorCode),
      group: req.body.group,
      cod: req.body.cod,
      dimensions: req.body.dimensions,
      weight: req.body.weight,
      image: req.files ? (req.files as Express.Multer.File[]).map((file) => file.filename) : null,
      price: parseFloat(req.body.price),
    });

    await product.save();
    return res.send({ message: 'Product created successfully' });
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      return res.status(400).send(error);
    }
    return next(error);
  }
});

productRouter.get('/', async (req, res) => {
  try {
    const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
    const pageSize = 20;

    let query = {};

    if (req.query.category) {
      query = { ownerID: req.query.category };
    }

    const totalProducts = await Product.countDocuments(query);
    const totalPages = Math.ceil(totalProducts / pageSize);

    const products = await Product.find(query)
      .skip((page - 1) * pageSize)
      .limit(pageSize);

    return res.send({
      products,
      pageInfo: {
        currentPage: page,
        totalPages,
        pageSize,
        totalItems: totalProducts,
      },
    });
  } catch (error) {
    console.error(error);
    return res.sendStatus(500);
  }
});

productRouter.get('/:id', async (req, res, next) => {
  try {
    const productRes = await Product.findById(req.params.id);
    return res.send(productRes);
  } catch (e) {
    return next(e);
  }
});

productRouter.get('/get/favorites', auth, async (req, res, next) => {
  try {
    const user = (req as RequestWithUser).user;
    const favoriteProductsId = user.favorites;
    const products = await Product.find({ _id: { $in: favoriteProductsId } });
    if (!products) {
      return res.send({ message: 'You do not have favorites Products' });
    }
    return res.json(products);
  } catch (e) {
    return next(e);
  }
});

// productRouter.patch('/:id', auth, permit('admin', 'director'), imagesUpload.array('images'), async (req, res, next) => {
//   try {
//     const product: HydratedDocument<IProduct> | null = await Product.findById(req.params.id);
//     if (!product) {
//       return res.status(404).send({ message: 'Not found product!' });
//     }
//     product.categoryId = req.body.categoryId;
//     product.name = req.body.name;
//     product.desc = req.body.desc;
//     product.unit = req.body.unit;
//     product.vendorCode = JSON.parse(req.body.vendorCode);
//     product.group = req.body.group;
//     product.cod = req.body.cod;
//     product.dimensions = req.body.dimensions;
//     product.weight = req.body.weight;
//     product.price = JSON.parse(req.body.price);
//
//     if (req.files) {
//       if (product.images) {
//         const uploadedImages = (req.files as Express.Multer.File[]).map((file) => file.filename);
//         product.images.push(...uploadedImages);
//       } else {
//         product.images = (req.files as Express.Multer.File[]).map((file) => file.filename);
//       }
//     }
//
//     await Product.findByIdAndUpdate(req.params.id, {
//       categoryId: product.categoryId,
//       name: product.name,
//       desc: product?.desc,
//       unit: product.unit,
//       vendorCode: product.vendorCode,
//       group: product.group,
//       cod: product.cod,
//       dimensions: product.dimensions,
//       weight: product.weight,
//       images: product.images,
//       price: product.price,
//     });
//
//     return res.send({
//       message: {
//         en: 'Product updated successfully',
//         ru: 'Продукт успешно изменен',
//       },
//     });
//   } catch (error) {
//     if (error instanceof mongoose.Error.ValidationError) {
//       return res.status(400).send(error);
//     }
//     return next(error);
//   }
// });

productRouter.delete('/:id/images/:index', auth, permit('admin', 'director'), async (req, res, next) => {
  try {
    const user = (req as RequestWithUser).user;
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).send({ message: 'Not found product!' });
    }

    if (user.role === 'admin' || user.role === 'director') {
      const index = parseInt(req.params.index);
      if (product.images && index >= 0 && index < product.images.length) {
        const deletingImage = product.images[index];
        product.images.splice(index, 1);
        await product.save();
        await fs.unlink('public/' + deletingImage);
        res.send({
          message: {
            en: 'Image deleted successfully',
            ru: 'картинка успешно удалена',
          },
        });
      } else {
        return res.status(404).send({ message: 'Not found image!' });
      }
    } else {
      return res.status(403).send({ message: 'You do not have permission!' });
    }
  } catch (e) {
    return next(e);
  }
});

productRouter.get('/search/get', async (req, res, next) => {
  try {
    const searchTerm: string = req.query.text as string;
    const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
    const pageSize = 20;
    if (searchTerm.length < 3) {
      return res.status(400).send('Search term should be at least 3 characters long');
    }
    const regex = new RegExp(searchTerm, 'i');
    const skip = (page - 1) * pageSize;
    const products = await Product.find({ name: { $regex: regex } })
      .skip(skip)
      .limit(pageSize);
    const totalProducts = await Product.countDocuments({ name: { $regex: regex } });
    const totalPages = Math.ceil(totalProducts / pageSize);

    res.send({
      products,
      pageInfo: {
        currentPage: page,
        totalPages,
        pageSize,
        totalItems: totalProducts,
      },
    });
  } catch (e) {
    return next(e);
  }
});

productRouter.get('/search/preview', async (req, res, next) => {
  try {
    const searchTerm: string = req.query.text as string;
    if (searchTerm.length < 3) {
      return res.status(400).send('Search term should be at least 3 characters long');
    }
    const regex = new RegExp(searchTerm, 'i');
    const products = await Product.find({ name: { $regex: regex } }).limit(20);
    const hasMore = products.length === 20;
    res.send({
      results: products,
      hasMore,
    });
  } catch (e) {
    return next(e);
  }
});

export default productRouter;
