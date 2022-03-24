const mongoose = require('mongoose');
const Schema = mongoose.Schema;
let {ProductsInOrder, productsInOrderSchema} = require('../models/productsInOrder.model');

const orderSchema = new Schema({
    date:{type: String,required: true,trim: true,minlength: 3}, 

    status: {type: String,default:'shopping', required:true},
    title: {type: String, required:true},
    total: {type: Number, required:true},
    userID: {type: String, required:true},
    items:   [productsInOrderSchema]
}, {
  timestamps: true,
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;