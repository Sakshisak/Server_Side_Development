var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('./models/user');
//Using tokens------
var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;
var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens

var config = require('./config.js');
//-----------

passport.use(new LocalStrategy(User.authenticate())); //Authentication done with the username and password provided in the json body of the incoming request 

//serializeUser and deserializeUser are provided in the passport User model
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//Using tokens-----
exports.getToken = function(user) {
    return jwt.sign(user, config.secretKey, //user is the payload
        {expiresIn: 3600}); //3600 seconds later the token becomes invalid
};

var opts = {}; //Options for jwt Strategy
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = config.secretKey;

exports.jwtPassport = passport.use(new JwtStrategy(opts,
    (jwt_payload, done) => {                                //done is the callback
        console.log("JWT payload: ", jwt_payload);
        User.findOne({_id: jwt_payload._id}, (err, user) => {
            if (err) {
                return done(err, false);
            }
            else if (user) {
                return done(null, user);
            }
            else {
                return done(null, false);
            }
        });
    }));

exports.verifyUser = passport.authenticate('jwt', {session: false});