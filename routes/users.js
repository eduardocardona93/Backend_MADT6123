const router = require('express').Router();
let User = require('../models/user.model');

// GET ALL
router.route('/').get((req, res) => {
  User.find()
    .then(users => res.json(users))
    .catch(err => res.status(400).json('Error: ' + err));
});
router.route('/:filterTerm').get((req, res) => {
  filterSearch = { $or: 
    [ {name: { $regex: '.*' + req.params.filterTerm + '.*' , $options: 'i'} } ,  
      {phoneNumber: { $regex: '.*' + req.params.filterTerm + '.*' , $options: 'i'} } ,  
      {email: { $regex: '.*' + req.params.filterTerm + '.*', $options: 'i' } } ] }

  User.find(filterSearch)
    .then(users => res.json(users))
    .catch(err => res.status(400).json('Error: ' + err));
});

//GET ONE
router.route('/:id').get((req, res) => {
  User.findById(req.params.id)
    .then(user => res.json(user))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/findByEmail/:email').get((req, res) => {
  User.findOne({ email: req.params.email })
    .then(user => res.json(user))
    .catch(err => res.status(400).json('Error: ' + err));
});

//DELETE ONE
router.route('/:id').delete((req, res) => {
  User.findByIdAndDelete(req.params.id)
    .then(() => res.json('User deleted.'))
    .catch(err => res.status(400).json('Error: ' + err));
});


// CREATE 
router.route('/add').post((req, res) => {
  const newUser = new User({
    "address" : req.body.address,
    "email" : req.body.email,
    "isAdmin" : req.body.isAdmin,
    "name" : req.body.name,
    "password" : req.body.password,
    "phoneNumber" : req.body.phoneNumber,
  });

  newUser.save()
    .then((response) => {
      console.log(response)
      res.send({message: 'User added!', newUser:response})
    })
    .catch(err => {
      res.status(400).json('Error: ' + err)
    });
});


// UPDATE
router.route('/update/:id').post((req, res) => {
  console.log(req.params.id,req.body.name)
  User.findById(req.params.id)
    .then(user => {

      user['address'] = req.body.address;
      user['name'] = req.body.name;
      user['phoneNumber'] = req.body.phoneNumber;
      user.save()
        .then(() => res.json('User updated!'))
        .catch(err => res.status(400).json('Error: ' + err));
    })
    .catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router;