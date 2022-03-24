const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const productsCategorySchema = new Schema({
  categoryId:{type: String,required: true,trim: true,minlength: 3},
  categoryName:{type: String,required: true,trim: true,minlength: 3},
  date:{type: String,required: true,trim: true,minlength: 3},
  description:{type: String,required: true,trim: true,minlength: 3},
  name:{type: String,required: true,trim: true,minlength: 3},
  price:{type: Number,required: true},
  quantity:{type: Number,required: true},
  totalItem:{type: Number,required: true},
}, {
  timestamps: true,
});

const ProductsCategoy = mongoose.model('ProductsCategoy', productsCategorySchema);

module.exports = ProductsCategoy;