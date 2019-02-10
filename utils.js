const m = require('./models.js');
const fs = require('fs');
const parse = require('csv-parse');
const jwt = require('jsonwebtoken');

const jwtCert = process.env.JWT_SECRET_KEY;


// verify token exists, and verify the actual token
module.exports.hasToken = (req, res, next) => {
    const authToken = req.headers.authorization.split(' ')[1];
    if (authToken !== 'undefined'){
        next();
    }else{
        next(403);
    }
}


module.exports.registerUser = user => {
    let errors = Array();
    if (user.email.length < 4){
        errors.push('Email is not valid!');
    }
    if (user.password !== user.confirmPassword){
        errors.push('Passwords do not match!');
    }
    if (user.password.length <= 4){
        errors.push('Password must be at least 5 characters!');
    }

    return errors;
}
