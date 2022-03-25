const router = require('express').Router();
let ProductsCategory = require('../models/productsCategory.model');

// GET ALL
router.route('/').get((req, res) => {
  ProductsCategory.find().sort({ name: 'asc' })
    .then(productsCategories => res.json(productsCategories))
    .catch(err => res.status(400).json('Error: ' + err));
});


//GET ONE
router.route('/:id').get((req, res) => {
  ProductsCategory.findById(req.params.id)
    .then(productsCategory => res.json(productsCategory))
    .catch(err => res.status(400).json('Error: ' + err));
});

//DETELTE ONE
router.route('/:id').delete((req, res) => {
  ProductsCategory.findByIdAndDelete(req.params.id)
    .then(() => res.json('Products Category deleted.'))
    .catch(err => res.status(400).json('Error: ' + err));
});


// CREATE 
router.route('/add').post((req, res) => {
  const newProductsCategory = new ProductsCategory({
    "name" : req.body.name,
  });

  newProductsCategory.save()
    .then(() => res.json('Products Category added!'))
    .catch(err => res.status(400).json('Error: ' + err));
});


// UPDATE
router.route('/update/:id').post((req, res) => {
  ProductsCategory.findById(req.params.id)
    .then(productsCategory => {
      productsCategory["name"] = req.body.name;
      productsCategory.save()
        .then(() => res.json('ProductsCategory updated!'))
        .catch(err => res.status(400).json('Error: ' + err));
    })
    .catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router;