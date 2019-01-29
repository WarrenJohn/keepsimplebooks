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

module.exports.verifyToken = (req, res, next) => {
    const token = req.headers.authorization.split(' ')[1];
    jwt.verify(token, jwtCert, (err, result) => {
        if(err){
            next(403);
        }else{
            next();
        }
            // returns token if verified
            // returns undefined if incorrect
        });
}


module.exports.registerUser = user => {
    let errors = Array();
    if (user.email.length < 4){
        errors.push('Email is not valid!');
    }
    if (user.password !== user.confirmPassword){
        errors.push('Passwords do not match!');
    }
    if (user.password.length < 4){
        errors.push('Password must be at least 5 characters!');
    }

    return errors;
}

// possible future use
module.exports.handleCSV_row = file => {
    // inserts csv data row by row
    fs.readFile(file, function (err, fileData) {
        parse(fileData, {columns: false, trim: true}, function(err, data) {
            // CSV data is in an array of arrys passed to this callback as rows.
            data.forEach(row => {
                m.insertRowBank({
                    transaction_date: row[0],
                    description: row[1],
                    withdrawl: row[2],
                    deposit: row[3],
                    balance: row[4],
                    user: 'warren'
                });
            });
        });
    });
};
