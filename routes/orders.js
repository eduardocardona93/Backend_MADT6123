const router = require('express').Router();
let Order = require('../models/order.model');

// GET ALL
router.route('/').get((req, res) => {
  Order.find()
    .then(orders => res.json(orders))
    .catch(err => res.status(400).json('Error: ' + err));
});


//GET ONE
router.route('/:id').get((req, res) => {
  Order.findById(req.params.id)
    .then(order => res.json(order))
    .catch(err => res.status(400).json('Error: ' + err));
});

//DETELTE ONE
router.route('/:id').delete((req, res) => {
  Order.findByIdAndDelete(req.params.id)
    .then(() => res.json('Order deleted.'))
    .catch(err => res.status(400).json('Error: ' + err));
});


// CREATE 
router.route('/add').post((req, res) => {
  const newOrder = new Order({
    "date" : req.body.date,
    "status" : req.body.status,
    "title" : req.body.title,
    "total" : req.body.total,
    "userID" : req.body.userID,
    "items" : req.body.items,
  });

  newOrder.save()
    .then(() => res.json('Order added!'))
    .catch(err => res.status(400).json('Error: ' + err));
});


// UPDATE
router.route('/update/:id').post((req, res) => {
    console.log(req.body)
  Order.findById(req.params.id)
    .then(order => {
        order["date"] = req.body.date;
        order["status"] = req.body.status;
        order["title"] = req.body.title;
        order["total"] = req.body.total;
        order["userID"] = req.body.userID;
        order["items"] = req.body.items;
      order.save()
        .then(() => res.json('Order updated!'))
        .catch(err => res.status(400).json('Error: ' + err));
    })
    .catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router;