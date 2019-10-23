/* eslint-disable no-underscore-dangle */
import { hashSync } from 'bcryptjs';
import faker from 'faker';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import connectToDb from './config';
import User from '../models/User';
import Category from '../models/Categories';
import Recipe from '../models/Recipes';
import Slug from '../helpers/Slugify';

dotenv.config();

const { log } = console;

const seletRandomElement = (array) => {
  const randomNumber = Math.floor(Math.random() * array.length);
  const randomElement = array[randomNumber];
  return randomElement;
};

const adminPassword = process.env.NODE_ENV === 'test' ? 'SomeSuperLongPass1' : process.env.ADMIN_PASSWORD;

const createUsersWithCategoriesAndRecipes = async () => {
  const user1 = new User({
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    email: 'adminuser1@mockeatery.com',
    password: hashSync(adminPassword),
    userType: 'admin',
    isVerified: true
  });

  const user2 = new User({
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    email: 'adminuser2@mockeatery.com',
    password: hashSync(adminPassword),
    userType: 'admin',
    isVerified: true
  });

  await user1.save();
  await user2.save();

  const category1 = await new Category({
    categoryName: 'Ice Cream',
    description: 'A category of gourmet ice cream recipes you can make at home',
    createdBy: user1._id,
    updatedBy: user1._id
  }).save();

  const category2 = await new Category({
    categoryName: 'Nigerian Street Food',
    description: 'A category of Nigerian street food recipes you can make at home',
    createdBy: user2._id,
    updatedBy: user2._id
  }).save();

  const category3 = await new Category({
    categoryName: 'African Appetizers',
    description: 'A category of African Appetizers',
    createdBy: user2._id,
    updatedBy: user2._id
  }).save();

  const category4 = await new Category({
    categoryName: 'Italian Pasta',
    description: 'A category of Italian pasta recipes you can make at home',
    createdBy: user1._id,
    updatedBy: user2._id
  }).save();

  const category5 = await new Category({
    categoryName: 'Mock Category',
    description: 'A category of mock category recipes you can make at home',
    createdBy: user2._id,
    updatedBy: user1._id
  }).save();

  const categories = [category1, category2, category3, category4, category5];
  const bulkRecipes = [];

  for (let i = 0; i <= 50; i += 1) {
    const recipe = new Recipe({
      recipeName: `${faker.random.words()} ${seletRandomElement(['teaspoon', 'tablespoon', 'cup', 'grams', 'pieces'])}`,
      categoryId: seletRandomElement(categories)._id,
      ingredients: [
        {
          name: faker.random.word(),
          measurement: seletRandomElement(['teaspoon', 'tablespoon', 'cup', 'grams', 'pieces']),
          quantity: faker.random.number()
        },
        {
          name: faker.random.word(),
          measurement: seletRandomElement(['teaspoon', 'tablespoon', 'cup', 'grams', 'pieces']),
          quantity: faker.random.number()
        },
        {
          name: faker.random.word(),
          measurement: seletRandomElement(['teaspoon', 'tablespoon', 'cup', 'grams', 'pieces']),
          quantity: faker.random.number()
        }
      ],
      slug: new Slug(faker.random.word()).generateUniqueSlug(),
      createdBy: seletRandomElement([user1, user2]),
      updatedBy: seletRandomElement([user1, user2])
    });

    bulkRecipes.push(recipe);
  }

  await Recipe.insertMany(bulkRecipes, (err, docs) => {
    if (err) log(err);
    process.exit(0);
  });
};

connectToDb()
  .then(async () => {
    log('Connected to db');
    await Promise.all([User.deleteMany({}), Category.deleteMany({}), Recipe.deleteMany({}), createUsersWithCategoriesAndRecipes()]);
  })
  .catch((err) => {
    log(err);
    mongoose.connection.close();
    throw new Error(err);
  });
