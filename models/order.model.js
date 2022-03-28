const mongoose = require('mongoose');
const Schema = mongoose.Schema;
let {ProductsInOrder, productsInOrderSchema} = require('../models/productsInOrder.model');

const orderSchema = new Schema({
    status: {type: String,default:'shopping', required:true},
    title: {type: String, required:true},
    total: {type: Number, required:true},
    userID: {type: String, required:true},
    net:{type: Number, default:0},
    taxes:{type: Number, default:0},
    shipping:{type: Number, default:0},
    dateString:{type: String},
    items:   [productsInOrderSchema],
}, {
  timestamps: true,
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;