const router = require('express').Router();
let Order = require('../models/order.model')
let {ProductsInOrder,productsInOrderSchema} = require('../models/productsInOrder.model');

// GET ALL
router.route('/').get((req, res) => {
  ProductsInOrder.find()
    .then(productsInOrder => res.json(productsInOrder))
    .catch(err => res.status(400).json('Error: ' + err));
});


// GET ALL
router.route('/getSales').get((req, res) => {
  let timeFilter = {}, typeFilter={}
  if(req.query.time === 'week'){

  }else if(req.query.time === 'month'){

  }
  if(req.query.type === 'categories'){
    typeFilter =  {
      "id" : "$categoryId",
      "Name":"$categoryName"
   }
  }else{
    typeFilter = {
      "id" : "$productId",
      "Name":"$name"
   }
  }
    ProductsInOrder.aggregate([{
      ...timeFilter,
      $group: {
        _id: {...typeFilter},
        totalItem: {
          $sum: "$totalItem"
        }
      }
    }]).then(sales => {
      res.json(sales)
    }).catch(err => res.status(400).json('Error: ' + err));
  


});

//GET ONE
router.route('/:id').get((req, res) => {
  ProductsInOrder.findById(req.params.id)
    .then(productsInOrder => res.json(productsInOrder))
    .catch(err => res.status(400).json('Error: ' + err));
});

//DELETE ONE
router.route('/:id').delete((req, res) => {
  ProductsInOrder.findByIdAndDelete(req.params.id)
    .then(() => res.json('ProductsInOrder deleted.'))
    .catch(err => res.status(400).json('Error: ' + err));
});


// CREATE 
router.route('/add').post((req, res) => {
  const newProductsCategory = new ProductsInOrder({
    "categoryId":req.body.categoryId,
    "categoryName":req.body.categoryName,
    "date":req.body.date,
    "description":req.body.description,
    "name":req.body.name,
    "price": parseFloat(req.body.price),
    "quantity": parseInt(req.body.quantity),
    "totalItem": parseFloat(req.body.totalItem),
    "productId":req.body._id,
  });

  newProductsCategory.save()
    .then(() => res.json('ProductsInOrder added!'))
    .catch(err => res.status(400).json('Error: ' + err));
});


// UPDATE
router.route('/update/:id').post((req, res) => {
  ProductsInOrder.findById(req.params.id)
    .then(productsInOrder => {
      productsInOrder["name"] = req.body.name,
      productsInOrder["categoryId"] = req.body.categoryId,
      productsInOrder["categoryName"] = req.body.categoryName,
      productsInOrder["date"] = req.body.date,
      productsInOrder["description"] = req.body.description,
      productsInOrder["name"] = req.body.name,
      productsInOrder["price"] = parseFloat(req.body.price),
      productsInOrder["quantity"] = parseInt(req.body.quantity),
      productsInOrder["totalItem"] = parseFloat(req.body.totalItem),
      productsInOrder["id"] = req.body.id,
      productsInOrder.save()
        .then(() => res.json('ProductsInOrder updated!'))
        .catch(err => res.status(400).json('Error: ' + err));
    })
    .catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router;