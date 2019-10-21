import mongoose, { Schema } from 'mongoose';

const categorySchema = new Schema({
  categoryName: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String
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

categorySchema.pre('remove', function(next) {
  this.model('Recipe').deleteMany({ categorId: this._id }, next);
});

const Category = mongoose.model('categories', categorySchema);

export default Category;
