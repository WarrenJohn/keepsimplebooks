const path = require('path');
// const views = path.join(__dirname, 'views');
const fs = require('fs');
const u = require('./utils');
const m = require('./models');
const bluebird = require('bluebird');
const multer = require('multer');
const parse = require('csv-parse/lib/sync');
const bcrypt = require('bcryptjs');

const jwt = require('jsonwebtoken');
const upload = multer();

const jwtCert = process.env.JWT_SECRET_KEY;


module.exports = app => {

// GET
    // Users: registering, logging in and modifying users
    app.get('/API/users', u.hasToken, (req, res) =>{
        const tokenReceived = req.headers.authorization.split(' ')[1];
        const token = jwt.verify(tokenReceived, jwtCert);
        if (token){
            res.status(200).send('Users');
        }else{
            res.status(403).send()
        }
    }
    );

    // Transactions uploading, viewing, tagging and deleting transactions
    //  u.hasToken, verifyToken,
    app.get('/API/transactions', u.hasToken, async (req, res) =>{
        const tokenReceived = req.headers.authorization.split(' ')[1];
        const token = jwt.verify(tokenReceived, jwtCert);
        if (token){

            m.userTransactions(token.email)
            .then(transactions => {
                res.status(200).send(transactions.reverse())
            })
            .catch(() => {
                res.status(500).send();
            })
            // This is the decryption of encrypted transactions
            // reversed to get newest transactions at the top
            // let data = await m.userTransactions(token.email)
            // bluebird.map(data, row => {
            //     return Promise.all([
            //         row.id,
            //         u.decrypt(row.date),
            //         u.decrypt(row.description),
            //         u.decrypt(row.withdrawl),
            //         u.decrypt(row.deposit),
            //         u.decrypt(row.balance)
            //     ])
            // })
            // .then(decrypted => {
            //     res.status(200).send(
            //         decrypted.map(row => (
            //             {
            //                 id: row[0],
            //                 date: row[1],
            //                 description: row[2],
            //                 withdrawl: row[3],
            //                 deposit: row[4],
            //                 balance: row[5]
            //             })
            //         ).reverse()
            //     );
            //
            // })
            // .catch(() => {
            //     res.status(500).send();
            // });
        }else{
            res.status(403).send();
        }
    }
    );

    app.get('/API/tags', u.hasToken, (req, res) => {
        const tokenReceived = req.headers.authorization.split(' ')[1];
        const token = jwt.verify(tokenReceived, jwtCert);
        if (token){
            m.getUserTags(token.email)
            .then(response => {
                res.status(200).send(response);
            })
            .catch(() => {
                res.status(500).send();
            });
        }else{
            res.status(403).send();
        }
    })

    // Expense categories: Adding, retrieving, removing
    app.get('/API/categories', u.hasToken, (req, res) =>{
        const tokenReceived = req.headers.authorization.split(' ')[1];
        const token = jwt.verify(tokenReceived, jwtCert);
        if (token){
            m.getUserCategories(token.email)
            .then(data => {
                res.status(200).send(data);
            })
            .catch(() => {
                res.status(500).send();
            });
        }else{
            res.status(403).send();
        }
    }
    );

// POST
    app.post('/API/users/login', (req, res) => {
        m.fetchUser(req.body.email)
        .then(response => {
            const user = response.dataValues;
            if(response){
                bcrypt.compare(req.body.password, user.password, (err, bcryptResponse) => {
                    if (bcryptResponse){
                        // password is correct
                        try{
                            // 86400 seconds is 1 day
                            // {expiresIn: 30}
                            jwt.sign(user, jwtCert, {expiresIn: 86400}, (err, token) => {
                                res.status(200).send({result: true, token, user});
                            });
                        }catch(err){
                            res.status(500).send();
                        }
                    }else{
                        // password is incorrect
                        res.status(200).send(false);
                    }
                })
            }
        })
        .catch(err => {
            res.status(500).send()
        })
    });

    app.post('/API/users/register', (req, res) =>{
        const user = req.body;
        let errors = u.registerUser(user);

        if(errors.length === 0){
            if(errors.length > 0){
                res.status(200).send({errors});
            }else{
                bcrypt.genSalt(12, (err, salt) => {
                    bcrypt.hash(user.password, salt, (err, hash) => {
                        m.registerUser({
                            email: user.email,
                            password: hash
                        })
                        .then(response => {
                            if (response.created){
                                // xxx.created (sequelize response) sends a 1 or 0 which can be evaluated
                                // done 'synchronously' to give the user feedback
                                res.status(201).send(response);
                            }else{
                                errors.push('Email is already registered!');
                                res.status(200).send({response, errors})
                            }
                        })
                        .catch(() => {
                            res.status(500).send();
                        });
                    });
                });
            }
        }else{
            res.status(200).send({errors});
        }
    }
    );

    app.post('/API/transactions/upload', u.hasToken, upload.single('bank'), (req, res) => {
        const tokenReceived = req.headers.authorization.split(' ')[1];
        const token = jwt.verify(tokenReceived, jwtCert);
        if (token){
            if (req.file.size > 1000000){
                res.status(413).send();
            }
            let records = parse(req.file.buffer, {columns: false, trim: true})
            // Temporarily disabling the encryption of records
            // bluebird.map(records, (row) => {return Promise.all(
            //     [
            //         u.encrypt(row[0]),
            //         // remove double spaces to normalize
            //         u.encrypt(row[1].replace(/ +(?= )/g, '')),
            //         u.encrypt(row[2]),
            //         u.encrypt(row[3]),
            //         u.encrypt(row[4])
            //     ])
            // }
            // )
            // .then(records => {
                m.insertBulkRowsBank(
                    records.map(row => (
                        {
                            transaction_date: row[0],
                            description: row[1],
                            withdrawl: row[2],
                            deposit: row[3],
                            balance: row[4],
                            user: token.email
                        }
                    )
                ))
            // })
        }else{
            res.status(403).send();
        }
    })

    app.post('/API/tags', u.hasToken, (req, res) =>{
        const tokenReceived = req.headers.authorization.split(' ')[1];
        const token = jwt.verify(tokenReceived, jwtCert);
        if (token){
            let tag = req.body.tag;
            // removing extra spaces to normalize data
            tag.description = tag.description.replace(/ +(?= )/g, '');
            tag.amount = tag.amount.replace(/ /g, '');
            tag.user = token.email;
            m.insertRowTag(tag)
            .then(response => {
                res.status(201).send(response);
            })

        }else{
            res.status(403).send();
        }
    }
    );

    app.post('/API/categories', u.hasToken, (req, res) =>{
        const tokenReceived = req.headers.authorization.split(' ')[1];
        const token = jwt.verify(tokenReceived, jwtCert);
        if (token){
            let categoryObj = req.body;
            categoryObj.category = categoryObj.category.replace(/ +(?= )/g, '');
            m.createUserCategory(categoryObj, token.email)
            .then(response => {
                res.status(201).send(response);
            })
            .catch(() => {
                res.status(500).send();
            });

        }else{
            res.status(403).send();
        }
    }
    );

// DELETE
    app.delete('/API/transactions:id', u.hasToken, (req, res) => {
        const tokenReceived = req.headers.authorization.split(' ')[1];
        const token = jwt.verify(tokenReceived, jwtCert);
        if (token){
            m.deleteOne(req.params.id, token.email)
            .then(() => {
                res.status(200).send();
            })
            .catch((err) => {
                console.log('route',err);
                res.status(500).send()
            })
        }else{
            res.status(403).send();
        }
    })

    app.delete('/API/transactions/all', u.hasToken, (req, res) => {
        const tokenReceived = req.headers.authorization.split(' ')[1];
        const token = jwt.verify(tokenReceived, jwtCert);
        if (token){
            m.deleteAll(token.email)
            .then(response => {
                res.status(200).send();
            })
            .catch(() => {
                res.status(500).send()
            })
        }else{
            res.status(403).send();
        }
    })

    app.delete('/API/tags/:id', u.hasToken, (req, res) =>{
        const tokenReceived = req.headers.authorization.split(' ')[1];
        const token = jwt.verify(tokenReceived, jwtCert);
        if (token){
            m.deleteUserTag(req.params.id, token.email)
            .then(response => {
                if (response === 1){
                    res.status(200).send();
                }else if (response === 0){
                    res.status(404).send();
                }else{
                    res.status(500).send();
                }
            })
        }else{
            res.status(403).send();
        }
    }
    );

    app.delete('/API/categories/:id', u.hasToken, (req, res) =>{
        const tokenReceived = req.headers.authorization.split(' ')[1];
        const token = jwt.verify(tokenReceived, jwtCert);
        if (token){
            m.deleteUserCategory(req.params.id, token.email)
            .then(response => {
                if (response === 1){
                    res.status(200).send();
                }else if (response === 0){
                    res.status(404).send();
                }else{
                    res.status(500).send();
                }
            })
            .catch(() => {
                res.status(500).send();
            });

        }else{
            res.status(403).send();
        }
    }
    );

// PATCH
    app.patch('/API/users',  u.hasToken, (req, res) =>{
        const tokenReceived = req.headers.authorization.split(' ')[1];
        const token = jwt.verify(tokenReceived, jwtCert);
        if (token){
            res.status(200).send('Users');
        }else{
            res.status(403).send()
        }
    }
    );
};
