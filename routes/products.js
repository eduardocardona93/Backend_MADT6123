const router = require('express').Router();
let Product = require('../models/product.model');

// GET ALL
router.route('/').get((req, res) => {
  Product.find()
    .then(products => res.json(products))
    .catch(err => res.status(400).json('Error: ' + err));
});


//GET ONE
router.route('/:id').get((req, res) => {
  Product.findById(req.params.id)
    .then(product => res.json(product))
    .catch(err => res.status(400).json('Error: ' + err));
});

//DETELTE ONE
router.route('/:id').delete((req, res) => {
  Product.findByIdAndDelete(req.params.id)
    .then(() => res.json('Product deleted.'))
    .catch(err => res.status(400).json('Error: ' + err));
});


// CREATE 
router.route('/add').post((req, res) => {
  const newProduct = new Product({
    "categoryId" : req.body.categoryId,
    "categoryName" : req.body.categoryName,
    "description" : req.body.description,
    "name" : req.body.name,
    "price" : parseFloat(req.body.password),
  });

  newProduct.save()
    .then(() => res.json('Product added!'))
    .catch(err => res.status(400).json('Error: ' + err));
});


// UPDATE
router.route('/update/:id').post((req, res) => {
  Product.findById(req.params.id)
    .then(product => {
      product["categoryId"] = req.body.categoryId;
      product["categoryName"] = req.body.categoryName;
      product["description"] = req.body.description;
      product["name"] = req.body.name;
      product["price"] = parseFloat(req.body.password);
      product.save()
        .then(() => res.json('Product updated!'))
        .catch(err => res.status(400).json('Error: ' + err));
    })
    .catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router;