const express = require('express');
const cors = require('cors');
const app = express();
//whitelist contains all origins that are accepted
const whitelist = ['http://localhost:3000', 'https://localhost:3443'];
var corsOptionsDelegate = (req, callback) => {
    var corsOptions;
    console.log(req.header('Origin'));
    //checking if req header contains Origin feed in the whitelist
    if(whitelist.indexOf(req.header('Origin')) !== -1) {
        corsOptions = { origin: true }; //server replies back access-control-allow-origin
    }
    else {
        corsOptions = { origin: false };
    }
    callback(null, corsOptions);
};

exports.cors = cors();//no params: allow access control with wild card toll
exports.corsWithOptions = cors(corsOptionsDelegate);