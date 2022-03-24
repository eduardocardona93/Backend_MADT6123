const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const productSchema = new Schema({
  categoryId:{type: String,required: true,trim: true,minlength: 3},
  categoryName:{type: String,required: true,trim: true,minlength: 3},
  description:{type: String,required: true,trim: true,minlength: 3},
  name:{type: String,required: true,trim: true,minlength: 3},
  price:{type: Number,required: true}
}, {
  timestamps: true,
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;