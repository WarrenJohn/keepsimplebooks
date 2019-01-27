const m = require('./models.js');
const fs = require('fs');
const parse = require('csv-parse');
const jwt = require('jsonwebtoken');

const jwtCert = process.env.JWT_SECRET_KEY;

// module.exports.hasToken = (req, res, next) => {
//     console.log('verifyToken ',req.headers);
//     const bearerHeader = req.headers['authorization']
//     if (typeof bearerHeader !== 'undefined'){
//         next();
//     }else{
//         res.status(403).send()
//     }
// }

// try{
//     jwt.verify(token, jwtCert, (err, result) => {
//         // returns token if verified
//         // returns undefined if incorrect
//     });
// }catch(err){
//     return err;
//     // return false;
// }


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
