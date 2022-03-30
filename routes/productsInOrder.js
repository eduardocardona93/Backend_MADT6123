const router = require('express').Router();
let Order = require('../models/order.model')
let {ProductsInOrder,productsInOrderSchema} = require('../models/productsInOrder.model');
const moment = require('moment')
// GET ALL
router.route('/').get((req, res) => {
  ProductsInOrder.find()
    .then(productsInOrder => res.json(productsInOrder))
    .catch(err => res.status(400).json('Error: ' + err));
});


// GET ALL
router.route('/getSales').get((req, res) => {
  // let timeFilter = {}, typeFilter={};
  // if(req.query.time === 'week'){
  //   timeFilter = {
  //     $match: {
  //       $date: {
  //         $gte: moment().add(-1,'weeks').format('DD/MM/YYYY hh:mm a'),
  //         $lt: moment().format('DD/MM/YYYY hh:mm a')
  //       }
  //     }
  //   }
  // }else if(req.query.time === 'month'){
  //   timeFilter = {
  //     $match: {
  //       date: {
  //         $gte: moment().add(-1,'month').format('DD/MM/YYYY hh:mm a'),
  //         $lt: moment().format('DD/MM/YYYY hh:mm a')
  //       }
  //     }
  //   }
  // }
  // if(req.query.type === 'categories'){
  //   typeFilter =  {
  //     "id" : "$categoryId",
  //     "Name":"$categoryName"
  //  }
  // }else{
  //   typeFilter = {
  //     "id" : "$productId",
  //     "Name":"$name"
  //  }
  // }
  // console.log({
  //   ...timeFilter,
  //     $group: {
  //       _id: {...typeFilter},
  //       totalItem: {
  //         $sum: "$totalItem"
  //       }
  //     }
  // })
  //   ProductsInOrder.aggregate([{
  //     ...timeFilter,
  //     $group: {
  //       _id: {...typeFilter},
  //       totalItem: {
  //         $sum: "$totalItem"
  //       }
  //     }
  //   }]).then(sales => {
  //     res.json(sales)
  //   }).catch(err => res.status(400).json('Error: ' + err));
  ProductsInOrder.find().then(sales => {
  let products = {}
  let categories = {}
  sales.forEach(itemObj => {


    if (!products[itemObj.productId]) {
      products[itemObj.productId] = {
        id: itemObj.productId,
        name: itemObj.name,
        total: 0,
        totalWeek: 0,
        totalMonth: 0
      }
    }
    products[itemObj.productId].total = parseFloat(products[itemObj.productId].total) + parseFloat(itemObj.totalItem)
    if (Math.abs(moment().diff(moment(itemObj.date), 'weeks')) < 1) {
      products[itemObj.productId].totalWeek = parseFloat(products[itemObj.productId].totalWeek) + parseFloat(itemObj.totalItem)
    }
    if (Math.abs(moment().diff(moment(itemObj.date), 'months')) < 1) {
      products[itemObj.productId].totalMonth = parseFloat(products[itemObj.productId].totalMonth) + parseFloat(itemObj.totalItem)
    }


    if (!categories[itemObj.categoryId]) {
      categories[itemObj.categoryId] = {
        id: itemObj.categoryId,
        name: itemObj.categoryName,
        total: 0,
        totalWeek: 0,
        totalMonth: 0
      }
    }
    console.log(parseFloat(itemObj.totalItem))
    categories[itemObj.categoryId].total = parseFloat(categories[itemObj.categoryId].total) + parseFloat(itemObj.totalItem)
    if (Math.abs(moment().diff(moment(itemObj.date), 'weeks')) < 1) {
      categories[itemObj.categoryId].totalWeek = parseFloat(categories[itemObj.categoryId].totalWeek) + parseFloat(itemObj.totalItem)
    }
    if (Math.abs(moment().diff(moment(itemObj.date), 'months')) < 1) {
      categories[itemObj.categoryId].totalMonth = parseFloat(categories[itemObj.categoryId].totalMonth) + parseFloat(itemObj.totalItem)
    }
  })
  res.json({
    products: Object.values(products),
    categories: Object.values(categories)
  })
  }).catch(err => res.status(400).json('Error: ' + err));

  });
router.route('/setSales').get((req, res) => {
  Order.find().sort({ date: 'desc' })
  .then(orders => {
    try {
      orders.forEach(order => {
        order.dateString = moment().format('DD/MM/YYYY hh:mm a').toString();

        order.items.forEach(async item=>{
          const newPr = new ProductsInOrder( {
            categoryId: item.categoryId,
            categoryName: item.categoryName,
            date: order.dateString,
            description: item.description,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            totalItem: item.totalItem,
            productId: item.productId,
          })
          await newPr.save()
        })

      })
    } catch (error) {
      res.status(400).json('Error: ' + error)
    }

  })
  .catch(err => res.status(400).json('Error: ' + err));

})
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