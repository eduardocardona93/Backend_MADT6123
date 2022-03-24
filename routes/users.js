const router = require('express').Router();
let User = require('../models/user.model');

// GET ALL
router.route('/').get((req, res) => {
  User.find()
    .then(users => res.json(users))
    .catch(err => res.status(400).json('Error: ' + err));
});


//GET ONE
router.route('/:id').get((req, res) => {
  User.findById(req.params.id)
    .then(user => res.json(user))
    .catch(err => res.status(400).json('Error: ' + err));
});

//DETELTE ONE
router.route('/:id').delete((req, res) => {
  User.findByIdAndDelete(req.params.id)
    .then(() => res.json('User deleted.'))
    .catch(err => res.status(400).json('Error: ' + err));
});


// CREATE 
router.route('/add').post((req, res) => {
  const newUser = new User({
    'address' : req.body.address,
    'email' : req.body.email,
    'isAdmin' : req.body.isAdmin,
    'name' : req.body.name,
    'password' : req.body.password,
    'phoneNumber' : req.body.phoneNumber,
  });

  newUser.save()
    .then(() => res.json('User added!'))
    .catch(err => res.status(400).json('Error: ' + err));
});


// UPDATE
router.route('/update/:id').post((req, res) => {
  User.findById(req.params.id)
    .then(user => {

      user['address'] = req.body.address;
      user['email'] = req.body.email;
      user['id'] = req.body.id;
      user['isAdmin'] = req.body.isAdmin;
      user['name'] = req.body.name;
      user['password'] = req.body.password;
      user['phoneNumber'] = req.body.phoneNumber;
      user.save()
        .then(() => res.json('User updated!'))
        .catch(err => res.status(400).json('Error: ' + err));
    })
    .catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router;