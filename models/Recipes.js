import mongoose, { Schema } from 'mongoose';

const recipeSchema = new Schema({
  recipeName: {
    type: String,
    required: true,
    unique: true
  },
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'categories'
  },
  ingredients: [
    {
      name: {
        type: String,
        required: true
      },
      measurement: {
        type: String,
        enum: ['teaspoon', 'tablespoon', 'cup', 'grams', 'pieces']
      },
      quantity: {
        type: Number,
        required: true
      }
    }
  ],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users'
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
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

const Recipe = mongoose.model('recipes', recipeSchema);

export default Recipe;
