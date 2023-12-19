import express from 'express';
import mongoose from 'mongoose';
import User from '../models/User';
import auth, { RequestWithUser } from '../middleware/auth';
import permit from '../middleware/permit';
import { OAuth2Client } from 'google-auth-library';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import config from '../config';
import Product from '../models/Product';

const usersRouter = express.Router();

const client = new OAuth2Client(config.google.clientId);

usersRouter.post('/', async (req, res, next) => {
  try {
    const user = new User({
      email: req.body.email,
      lastName: req.body.lastName,
      firstName: req.body.firstName,
      password: req.body.password,
      phoneNumber: req.body.phoneNumber,
    });

    user.generateToken();
    await user.save();
    return res.send({ message: 'Registered successfully!', user });
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      return res.status(400).send(error);
    }
    return next(error);
  }
});

usersRouter.post('/sessions', async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return res.status(400).send({ error: 'Email incorrect' });
  }

  const isMatch = await user.checkPassword(req.body.password);

  if (!isMatch) {
    return res.status(400).send({ error: 'Password incorrect' });
  }

  try {
    user.generateToken();
    await user.save();

    return res.send({ message: 'Email and password correct!', user });
  } catch (e) {
    return next(e);
  }
});

usersRouter.post('/session/token', auth, async (req, res, next) => {
  try {
    const user = (req as RequestWithUser).user;
    await user.save();
    return res.send({ message: 're-authorization was successful', user });
  } catch (e) {
    return next(e);
  }
});

usersRouter.get('/getByRole', auth, permit('admin', 'director'), async (req, res, next) => {
  try {
    const roleUsers = req.query.roleUsers as string;
    if (roleUsers === 'admin') {
      const admins = await User.find({ role: 'admin' }).select(['-token', '-verificationToken', '-favorites']);
      return res.send(admins);
    }
    if (roleUsers === 'user') {
      const users = await User.find({ role: 'user' }).select(['-token', '-verificationToken', '-favorites']);
      return res.send(users);
    }
    if (roleUsers === 'hotel') {
      const users = await User.find({ role: 'hotel' }).select(['-token', '-verificationToken', '-favorites']);
      return res.send(users);
    }
  } catch (e) {
    return next(e);
  }
});

usersRouter.get('/getMatched', auth, permit('director'), async (req, res, next) => {
  try {
    const lastNameMatch = req.query.nameMatch as string;
    const emailMatch = req.query.emailMatch as string;
    if (lastNameMatch) {
      const matchedUsers = await User.find({
        lastName: { $regex: new RegExp(lastNameMatch, 'i') },
        role: 'user',
      }).limit(20);
      return res.send(matchedUsers);
    }
    if (emailMatch) {
      const matchedUsers = await User.find({
        email: { $regex: new RegExp(emailMatch, 'i') },
        role: 'user',
      }).limit(20);
      return res.send(matchedUsers);
    }
  } catch (e) {
    return next(e);
  }
});

usersRouter.patch('/status/:id', auth, permit('director', 'admin'), async (req, res, next) => {
  try {
    const currentUser = await User.findById(req.params.id);
    if (currentUser) {
      await User.updateOne({ _id: req.params.id }, { $set: { status: req.body.status } });
      res.send({ message: 'Status changed' });
    } else {
      res.status(400).send({ message: 'User is not found' });
    }
  } catch (e) {
    return next(e);
  }
});

// usersRouter.patch('/role/:id', auth, permit('director', 'admin'), async (req, res, next) => {
//   try {
//     const currentUser = await User.findById(req.params.id);
//     if (currentUser) {
//       if (currentUser.role === 'hotel') {
//         const hotels = await Hotel.find({ userId: currentUser._id });
//         await Hotel.deleteMany({ userId: currentUser._id });
//
//         const hotelIds = hotels.map((hotel) => hotel._id);
//         await Apartment.deleteMany({ hotelId: { $in: hotelIds } });
//
//         currentUser.role = 'user';
//         await currentUser.save();
//
//         res.send({ message: 'Role changed, and all hotels and apartments deleted' });
//       } else {
//         await User.updateOne({ _id: req.params.id }, { $set: { role: req.body.role } });
//         res.send({ message: 'Role changed' });
//       }
//     } else {
//       res.send(400).send({ message: 'User is not found' });
//     }
//   } catch (e) {
//     return next(e);
//   }
// });
//
usersRouter.patch('/toggleAddProductToFavorites', auth, permit('user'), async (req, res, next) => {
  const user = (req as RequestWithUser).user;
  const addProductId = req.body.addProduct;
  const deleteProductId = req.body.deleteProduct;

  try {
    if (addProductId) {
      const foundProduct = await Product.findById(addProductId);
      if (!foundProduct) {
        return res.send({ error: 'Product is not found' });
      }

      if (user.favorites.includes(addProductId)) {
        return res.send({ message: 'The product is already in the favorites' });
      } else {
        user.favorites.push(addProductId);
        await user.save();
        return res.send({
          message: {
            en: foundProduct.name + ' added to favorites successfully',
            ru: foundProduct.name + ' успешно добавлен в избраное',
          },
        });
      }
    }
    if (deleteProductId) {
      const foundProduct = await Product.findById(deleteProductId);
      if (!foundProduct) {
        return res.send({ error: 'Product is not found' });
      }
      if (!user.favorites.includes(deleteProductId)) {
        return res.send({ message: 'You dont have this product in the favorites' });
      }
      user.favorites = user.favorites.filter((favProduct) => favProduct.toString() !== deleteProductId);
      await user.save();
      return res.send({
        message: {
          en: foundProduct.name + ' removed from favorites successfully',
          ru: foundProduct.name + ' успешно уделён из избраное',
        },
      });
    }
  } catch (e) {
    return next(e);
  }
});

// usersRouter.patch('/toggleAddProductToFavorites', auth, permit('user'), async (req, res, next) => {
//   const user = (req as RequestWithUser).user;
//   const addProductId = req.body.addProduct;
//   const deleteProductId = req.body.deleteProduct;
//   console.log(req.body);
//
//   try {
//     if (addProductId) {
//       const foundProduct = await Product.findById(addProductId);
//       if (!foundProduct) {
//         return res.status(404).json({ error: 'Product is not found' });
//       }
//
//       if (user.favorites.includes(addProductId)) {
//         return res.status(400).json({ message: 'The product is already in the favorites' });
//       } else {
//         user.favorites.push(addProductId);
//         await user.save();
//         return res.status(200).json({
//           message: {
//             en: foundProduct.name + ' added to favorites successfully',
//             ru: foundProduct.name + ' успешно добавлен в избранное',
//           },
//         });
//       }
//     }
//
//     if (deleteProductId) {
//       const foundProduct = await Product.findById(deleteProductId);
//       if (!foundProduct) {
//         return res.status(404).json({ error: 'Product is not found' });
//       }
//
//       if (!user.favorites.includes(deleteProductId)) {
//         return res.status(400).json({ message: 'You dont have this product in the favorites' });
//       }
//
//       user.favorites = user.favorites.filter((favProduct) => favProduct.toString() !== deleteProductId);
//       await user.save();
//       return res.status(200).json({
//         message: {
//           en: foundProduct.name + ' removed from favorites successfully',
//           ru: foundProduct.name + ' успешно уделён из избранного',
//         },
//       });
//     }
//   } catch (e) {
//     return next(e);
//   }
// });

usersRouter.delete('/sessions', async (req, res, next) => {
  try {
    const token = req.get('Authorization');
    const success = { message: 'Success' };

    if (!token) {
      return res.send(success);
    }

    const user = await User.findOne({ token });

    if (!user) {
      return res.send(success);
    }

    user.generateToken();
    await user.save();
    return res.send(success);
  } catch (e) {
    return next(e);
  }
});

usersRouter.post('/google', async (req, res, next) => {
  try {
    const ticket = await client.verifyIdToken({
      idToken: req.body.credential,
      audience: config.google.clientId,
    });

    const payload = ticket.getPayload();
    if (!payload) {
      return res.status(400).send({ error: 'Google login error!' });
    }

    const email = payload['email'];
    const id = payload['sub'];
    const firstName = payload['given_name'];
    const lastName = payload['family_name'] ? payload['family_name'] : ' ';
    const phoneNumber = '000';
    if (!email) {
      return res.status(400).send({ error: 'Not enough user data to continue' });
    }

    let user = await User.findOne({ googleId: id });

    if (!user) {
      user = new User({
        email: email,
        lastName: lastName,
        firstName: firstName,
        password: crypto.randomUUID(),
        phoneNumber: phoneNumber,
        googleId: id,
        isVerified: true,
      });
    }
    user.generateToken();
    await user.save();
    return res.send({
      message: {
        en: 'You have successfully logged in with Google. ' + user.email,
        ru: 'Вы вошли через гугл успешно. ' + user.email,
      },
      user,
    });
  } catch (e) {
    return next(e);
  }
});

usersRouter.patch('/googleNumber', auth, permit('user'), async (req, res, next) => {
  try {
    const { newPhone } = req.body;
    const user = (req as RequestWithUser).user;
    user.phoneNumber = newPhone;
    await user.save();
    return res.send({
      message: {
        message: {
          en: 'Phone number added successfully.',
          ru: 'Номер телефона успешно добавлен.',
        },
      },
      user,
    });
  } catch (e) {
    return next(e);
  }
});

usersRouter.post('/getVerify', auth, async (req, res, next) => {
  try {
    const user = (req as RequestWithUser).user;
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: config.mail,
        pass: 'jczr vpof kqyp qrtj',
      },
    });
    const mailOptions = {
      from: config.mail,
      to: user.email,
      subject: 'Email Verification',
      text: `Please click the following link to verify your email: ${config.site}/verify/${user.verificationToken}`,
    };
    transporter.sendMail(mailOptions, (error) => {
      if (error) {
        console.error('Error sending email:', error);
      } else {
        return res.send({
          message: {
            en: 'Mail sent. check ' + user.email,
            ru: 'письмо отправлено. проверьте ' + user.email,
          },
        });
      }
    });
  } catch (e) {
    return next(e);
  }
});

usersRouter.get('/verify/:token', auth, async (req, res) => {
  const token = req.params.token;
  const reqUser = (req as RequestWithUser).user;
  const user = await User.findOne({ verificationToken: token, _id: reqUser.id });

  if (!user) {
    return res.status(404).json({ message: 'Invalid verification token' });
  }

  user.isVerified = true;
  user.verificationToken = null;
  await user.save();

  return res.send({
    message: {
      en: 'successfully verified',
      ru: 'успешно верифицированно ',
    },
  });
});

usersRouter.patch('/password', auth, async (req, res, next) => {
  try {
    const { newPassword } = req.body;
    const user = (req as RequestWithUser).user;
    user.password = newPassword;
    await user.save();
    return res.send({
      message: {
        en: 'Password changed successfully',
        ru: 'Пароль успешно изменен',
      },
    });
  } catch (e) {
    return next(e);
  }
});

usersRouter.post('/restorePassword', async (req, res, next) => {
  try {
    const email = req.body.email;
    const newPassword = () => {
      const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      let password = '';
      for (let i = 0; i < 8; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        password += characters.charAt(randomIndex);
      }
      return password;
    };

    const password = newPassword();

    const user = await User.findOne({ email: email });

    if (!user) {
      return res.status(400).send({ error: 'Email incorrect' });
    }
    user.password = password;
    await user.save();

    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: config.mail,
        pass: 'jczr vpof kqyp qrtj',
      },
    });
    const mailOptions = {
      from: config.mail,
      to: email,
      subject: 'Restore password',
      text: `New password: ${password}, for: ${email}`,
    };
    transporter.sendMail(mailOptions, (error) => {
      if (error) {
        console.error('Error sending email:', error);
      } else {
        return res.send({
          message: {
            en: 'Mail sent. check ' + email,
            ru: 'Письмо отправлено. проверьте ' + email,
          },
        });
      }
    });
  } catch (e) {
    return next(e);
  }
});

export default usersRouter;
