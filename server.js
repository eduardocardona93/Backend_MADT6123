const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.options('*', cors());
app.use(express.json());

const uri = process.env.ATLAS_URI;
mongoose.connect(uri, { useNewUrlParser: true }
);
const connection = mongoose.connection;
connection.once('open', () => {
  console.log("MongoDB database connection established successfully");
})

const usersRouter = require('./routes/users');
const productsRouter = require('./routes/products');
const productsCategoriesRouter = require('./routes/productsCategory');
const productsInOrdersRouter = require('./routes/productsInOrder');
const ordersRouter = require('./routes/orders');

app.use('/users', usersRouter);
app.use('/products', productsRouter);
app.use('/productsCategories', productsCategoriesRouter);
app.use('/productsInOrders', productsInOrdersRouter);
app.use('/orders', ordersRouter);

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});