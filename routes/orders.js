const router = require('express').Router();
let Order = require('../models/order.model');
let {ProductsInOrder, productsInOrderSchema} = require('../models/productsInOrder.model');

const moment = require('moment')
// GET ALL

router.route('/').get((req, res) => {
  Order.find().sort({ date: 'desc' })
    .then(orders => res.json(orders))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/filtered/:filterStatus').get((req, res) => {
  let  userObj={}, statusObj={},filterStatus= req.params.filterStatus,filterUser = req.query.filterUser;
  if(filterStatus && filterStatus !== 'all'){
    statusObj = {status :filterStatus };
  }
  if(filterUser && filterUser !== ''){
    userObj =  {userID :filterUser }
  }
  Order.find({ status: { $ne: "shopping" } ,...statusObj,...userObj }).sort({ title: 'desc' })
    .then(orders => {res.json(orders)})
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/shoppingCart/:filterUser').get((req, res) => {
  if(!req.params.filterUser){
    res.status(400).json({message:'Error: userID not defined' })
  }else{
    Order.findOne ({status:  "shopping" ,userID :req.params.filterUser})
    .then(orders => {
      res.json(orders)
    })
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
router.route('/addToShoppingCart').post((req, res) => {
  Order.findOne({ status:"shopping" ,userID :req.body.userID })
  .then(order => {
    if(order){
      order.total +=  parseFloat(req.body.newItem.totalItem);
      order.taxes = parseFloat(order.total * 0.13);
      order.shipping = parseFloat(order.total * 0.10);
      order.net = parseFloat(order.total + order.taxes + order.shipping);
      order.items.push(req.body.newItem)
      order.save() 
        .then(() => res.json('Item added!'))
        .catch(err => res.status(400).json('Error: ' + err));
    }else{
      Order.find().sort({ title: 'desc' }).limit(1).then(response => {
        const consecutive = response.length > 0 ? parseInt(response[0].title) : 0;
        const addSubtotal = parseFloat(req.body.newItem.totalItem);
        const dateString = moment().format('DD/MM/YYYY hh:mm a').toString();
        const taxes = parseFloat(addSubtotal * 0.13);
        const shipping = parseFloat(addSubtotal * 0.10);
        const net = parseFloat(addSubtotal + taxes + shipping);
        const newOrder = new Order({
          "status" : "shopping",
          "title" : (consecutive+1).toString().padStart(6, '0'),
          "total" : addSubtotal,
          "net" : net,
          "taxes" : taxes,
          "shipping" : shipping,
          "date" : dateString,
          "userID" : req.body.userID,
          "items" : [{...req.body.newItem,
            categoryId:req.body.newItem.categoryId,
            categoryName:req.body.newItem.categoryName,
            date:dateString,
            description:req.body.newItem.description,
            name:req.body.newItem.name,
            price:req.body.newItem.price,
            quantity:req.body.newItem.quantity,
            totalItem:req.body.newItem.totalItem,
            productId:req.body.newItem.productId
          }],
      });
      newOrder.save() 
        .then(() => res.json('Item added!'))
        .catch(err => res.status(400).json('Error: ' + err));
      })
    }
  
  })
  .catch(err => res.status(400).json('Error: ' + err));
});
//DELETE ONE
router.route('/removeFromShoppingCart/:userID').delete((req, res) => {
  Order.findOne({ status:"shopping" ,userID :req.params.userID }).then(order => {
    if(order.items.length > 1){
      order.total = parseFloat(order.total) - order.items[req.query.productIndex].totalItem;
      order.taxes = parseFloat(order.total * 0.13);
      order.shipping = parseFloat(order.total * 0.10);
      order.net = parseFloat(order.total + order.taxes + order.shipping);
      order.items.splice(req.query.productIndex,1);
      order.save().then((orderSaved) => res.json(orderSaved))
      .catch(err => res.status(400).json('Error: ' + err));
    }else{
      order.delete()
      .then(()=>{ res.json(null)})
      .catch(err => res.status(400).json('Error: ' + err));
    }
  })
});


//UPDATE STATE

router.route('/changeState/:orderID').put((req, res) => {
  const newStatus = req.query.newStatus;
  Order.findById(req.params.orderID)
  .then(order => {
    if(order){
      order.status = newStatus;
      if(order.status === 'completed'){
        ProductsInOrder.insertMany(order.items.map(item =>{
          return {
            categoryId:item.categoryId,
            categoryName:item.categoryName,
            date:order.date,
            description:item.description,
            name:item.name,
            price:item.price,
            quantity:item.quantity,
            totalItem:item.totalItem,
            productId:item.productId
          }
        }))
        .then(async () => {
          await order.save() 
          .then(() => res.json('Order Updated'))
          .catch(err => res.status(400).json('Error: ' + err));
        })
        .catch(err => res.status(400).json('Error: ' + err));
      }else{
        order.save() 
        .then(() => res.json('Order Updated'))
        .catch(err => res.status(400).json('Error: ' + err));
      }

    }else{
      order.save() 
      .then(() => res.json('Order Updated'))
      .catch(err => res.status(400).json('Error: ' + err));
    }
  
  })
  .catch(err => res.status(400).json('Error: ' + err));
});


module.exports = router;