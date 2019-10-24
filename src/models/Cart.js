import { Schema, model } from 'mongoose';

const cartSchema = new Schema({
  recipeCount: {
    type: Number
  },
  recipes: [{ type: Schema.Types.ObjectId, ref: 'recipes' }],
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'users'
  },
  createdOn: {
    type: Date,
    default: Date.now
  },
  updatedOn: {
    type: Date,
    default: Date.now
  }
});

const Cart = model('carts', cartSchema);

export default Cart;
