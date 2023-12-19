import express from 'express';
import Product from '../models/Product';
import mongoose from 'mongoose';
import auth, { RequestWithUser } from '../middleware/auth';
import permit from '../middleware/permit';

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
    if (req.query.category) {
      const productCategory = await Product.find({ categoryId: req.query.category });
      return res.send(productCategory);
    }
    const products = await Product.find();
    return res.send(products);
  } catch {
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

productRouter.get('/get/favorites', auth, permit('user'), async (req, res, next) => {
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

export default productRouter;
