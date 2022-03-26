const router = require('express').Router();
let Order = require('../models/order.model');

// GET ALL
router.route('/:filterStatus').get((req, res) => {
  let  userObj={}, statusObj={},filterStatus= req.params.filterStatus,filterUser = req.query.filterUser;
  if(filterStatus && filterStatus !== 'all'){
    statusObj = {status :filterStatus };
  }
  if(filterUser && filterUser !== ''){
    userObj =  {userId :filterUser }
  }
  Order.find({ status: { $ne: "shopping" } ,...filterStatus,...userObj }).sort({ date: 'desc' })
    .then(orders => res.json(orders))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('shoppingCart/:filterUser').get((req, res) => {
  if(!req.query.filterUser){
    res.status(400).json('Error: userID not defined' )
  }else{
    Order.find({ status: { $ne: "shopping" } ,userId :req.query.filterUser }).sort({ date: 'desc' })
    .then(orders => res.json(orders))
    .catch(err => res.status(400).json('Error: ' + err));

  }

});

//GET ONE
router.route('/:id').get((req, res) => {
  Order.findById(req.params.id)
    .then(order => res.json(order))
    .catch(err => res.status(400).json('Error: ' + err));
});

//DELETE ONE
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
    "userId" : req.body.userId,
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