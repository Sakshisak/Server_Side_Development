var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('./models/user');

passport.use(new LocalStrategy(User.authenticate())); //Authentication done with the username and password provided in the json body of the incoming request 

//serializeUser and deserializeUser are provided in the passport User model
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());