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
router.route('/loginUser/:email').get((req, res) => {
  User.findOne({ email: req.params.email })
    .then(user => {
      if(!user){
        res.json({message:"Incorrect User email" ,loggedUser:null})

      }else if(user && user.password !== req.query.password){

        res.json({message:"Incorrect User password" ,loggedUser:null})
      }else{
        res.json({message:"User logged" ,loggedUser:user})
      }
    })
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/passwordChange/:userID').get((req, res) => {
  User.findById (userID)
    .then(user => {
      if(!user){
        res.json({message:"Incorrect User email" ,success:false})

      }else{
        user.password = req.query.password;
        user.save()
        .then(() => res.json({message:"Password successfully changed!!" ,success:true}))
        .catch(err => res.status(400).json('Error: ' + err));
        
      }
    })
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/recoverPassword/:userID').get((req, res) => {
  res.sendFile('./views/recoverPassword.html', { root: __dirname.replace('\\routes','') }, (err) => {
    if (err) res.sendStatus(404);
});
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