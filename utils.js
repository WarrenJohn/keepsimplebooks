const m = require('./models.js');
const fs = require('fs');
const parse = require('csv-parse');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const jwtCert = process.env.JWT_SECRET_KEY;

// encrypting financial data
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY;
const SALT = process.env.ENCRYPTION_SALT;
const ALGORITHM = process.env.ALGORITHM;
const IV_LENGTH = 16; // AES cipher block length is always 16 bytes

module.exports.encrypt = (text) => {
    return new Promise ((resolve, reject) => {
        const iv = crypto.randomBytes(IV_LENGTH)
        crypto.scrypt(ENCRYPTION_KEY, SALT, 32, (err, derivedKey) => {
            if (err) reject(err);
            const plain = new Buffer.from(text)
            const cipher = crypto.createCipheriv(ALGORITHM, derivedKey, iv);
            let encrypted = cipher.update(plain)
            encrypted = Buffer.concat([encrypted, cipher.final()])
            resolve(iv.toString('base64') + ':' + encrypted.toString('base64'))
        });
    });
};

module.exports.decrypt = text => {
    const key = crypto.scryptSync(ENCRYPTION_KEY, SALT, 32);
    const textParts = text.split(':');
    const iv = new Buffer.from(textParts.shift(), 'base64');
    const encryptedText = new Buffer.from(textParts.join(':'), 'base64');
    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
    let decrypted = decipher.update(encryptedText, 'base64', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
}

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
