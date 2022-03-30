const router = require('express').Router();
let User = require('../models/user.model');
var nodemailer = require('nodemailer');

require('dotenv').config();

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
  User.findById (req.params.userID)
    .then(user => {
      if(!user){
        res.json({message:"Incorrect User email" ,success:false})

      }else{
        user.password = req.query.password;
        user.save()
        .then(() => res.json({message:"Password successfully changed!!" ,success:true}))
        .catch(err => res.status(400).json({errorMsg: 'Error: ' + err}));
        
      }
    })
    .catch(err => res.status(400).json({errorMsg: 'Error: ' + err}));
});

router.route('/recoverPassword/:id').get((req, res) => {
  if(!req.params.id){
    res.sendStatus(404)
  }else{
    res.sendFile('./views/recoverPassword.html', { root: __dirname.replace('\\routes','') }, (err) => {
      if (err) res.sendStatus(404);
    });
  }
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
      res.send({message: 'User added!', newUser:response})
    })
    .catch(err => {
      res.status(400).json('Error: ' + err)
    });
});


// UPDATE
router.route('/update/:id').post((req, res) => {
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

// SEND EMAIL
router.route('/sendEmail').post((req, res) => {

  // res.json("{response: 'send email API called'}")
  const from_email = 'mangoplace.app@gmail.com';
  const to_email = req.body.to_email;
  const email_subject = req.body.email_subject;
  const email_body = req.body.email_body;

  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: from_email,
      pass: process.env.gmail_pass
    }
  });
  
  var mailOptions = {
    from: from_email,
    to: to_email,
    subject: email_subject,
    text: `You have requested to change your password, click in the link to reset the password:  ${email_body} </a>`,
    html: `You have requested to change your password <a href='${email_body}'>Click here to reset the password</a>`,
    amp: `You have requested to change your password <a href='${email_body}'>Click here to reset the password</a>`
  };
  
  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      res.json('error')
      console.log(error);
    } else {
      res.json(`{"message": "An email was sent to your address"}`)
      console.log('Email sent: ' + info.response);
    }
  });

})

module.exports = router;