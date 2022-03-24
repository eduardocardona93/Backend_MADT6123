const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const productsCategorySchema = new Schema({
  name:{type: String,required: true,trim: true,minlength: 3},
}, {
  timestamps: true,
});

const ProductsCategory = mongoose.model('ProductsCategory', productsCategorySchema);

module.exports = ProductsCategory;