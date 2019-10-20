import mongoose, { Schema } from 'mongoose';

const categorySchema = new Schema({
  categoryName: {
    type: String,
    required: true,
    unique: true
  },
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

const Category = mongoose.model('categories', categorySchema);

export default Category;
