var express = require('express');
var router = express.Router();
var passport = require('passport');

const bodyParser = require('body-parser');
var User = require('../models/user');
var authenticate = require('../authenticate');//for token authentication

router.use(bodyParser.json());

/* GET users listing. */
router.route('/')
.get(authenticate.verifyOrdinaryUser, authenticate.verifyAdmin,
  (req, res, next) => {
    User.find()
    .then((users) => {
      //console.log("user is: "+req.user);
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json(users);
  }, (err) => next(err))
  .catch((err) => next(err));
  })

router.post('/signup', (req, res, next) => {
  User.register(new User({username: req.body.username}), 
    req.body.password, (err, user) => {
    if(err) {
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.json({err: err});
    }
    else {
      if (req.body.firstname)
        user.firstname = req.body.firstname;
      if (req.body.lastname)
        user.lastname = req.body.lastname;
      user.save((err, user) => {
        if (err) {
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.json({err: err});
          return ;
        }
      passport.authenticate('local')(req, res, () => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json({success: true, status: 'Registration Successful!'});
      });
    });
  }
});
});


router.post('/login', passport.authenticate('local'), (req, res) => {
  console.log("req.user",req.user); //token is not contained in user docs
  var token = authenticate.getToken({_id: req.user._id}); //issuing a token when logging in
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.json({success: true, token: token, status: 'You are successfully logged in!'});
});

router.get('/logout', (req, res, next) => {
  req.logout(); //the generated token should become invalid but even after logging out using the token grants updation and deletion privileges
  res.redirect('/');
  // if (req.session) {
  //   console.log("req.session is : " +  req.session);
  //   req.session.destroy();
  //   res.clearCookie('session-id');
  //   res.redirect('/');
  // }
  // else {
  //   console.log('inside not logged in');
  //   var err = new Error('You are not logged in!');
  //   err.status = 403;
  //   next(err);
  // }
});

module.exports = router;
