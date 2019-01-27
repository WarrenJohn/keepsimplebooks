const path = require('path');
// const views = path.join(__dirname, 'views');
const fs = require('fs');
const u = require('./utils');
const m = require('./models');
const multer = require('multer');
const parse = require('csv-parse');
const bcrypt = require('bcryptjs');

const jwt = require('jsonwebtoken');
const upload = multer();

const jwtCert = process.env.JWT_SECRET_KEY;

module.exports = app => {
    app.get('/', (req, res) =>{
        console.log('GET: index');
        res.status(200).send('Index');
        }
    );

    // Users: registering, logging in and modifying users
    app.get('/users', (req, res) =>{
        console.log('GET: Users');
        res.status(200).send('Users');
        }
    );

    app.post('/users/login', (req, res) => {
        m.fetchUser(req.body.email)
            .then(response => {
                const user = response.dataValues;
                if(response){
                    bcrypt.compare(req.body.password, user.password, (err, bcryptResponse) => {
                        if (bcryptResponse){
                            // password is correct
                            try{
                                // 86400 seconds is 1 day
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

    app.post('/users/register', (req, res) =>{
        console.log('Post: Users/register', req.body);
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
    app.patch('/users', (req, res) =>{
        console.log('Post: Users');
        res.status(200).send('Users');
        }
    );

    // Transactions uploading, viewing, tagging and deleting transactions
    // ,u.hasToken
    app.get('/transactions', (req, res) =>{
        console.log('GET: Transactions');
        // verify token exists, and verify the actual token
        const bearerHeader = req.headers['authorization']
        if (typeof bearerHeader !== 'undefined'){
            // next();
        }else{
            return res.status(403).send({as:'as'})
        }
        // reversed to get newest transactions at the top
        m.userTransactions('warren')
            .then(data => {
                res.status(200).send(data.reverse())
            })
            .catch(err => {
                res.status(500).send()
            });
    }
    );

    app.post('/transactions/upload', upload.single('bank'), async (req, res) => {
        console.log('POST: transactions/upload');
        if (req.file.originalname.split('.').pop() === 'csv' && req.file.mimetype === 'application/vnd.ms-excel'){
            parse(req.file.buffer, {columns: false, trim: true}, (err, data) => {
                data.map(description => (
                    // remove spaces in descriptions and re add them to make sure there are no double spaces
                    description[1] = description[1].replace(/ +(?= )/g, '')
                ));
                // data is converted in an array of objects prior to db insertion
                m.insertBulkRowsBank(data.map(row => ({
                                        transaction_date: row[0],
                                        description: row[1],
                                        withdrawl: row[2],
                                        deposit: row[3],
                                        balance: row[4],
                                        user: 'warren'}))
                                    )
                    .then(() => {
                        res.status(201).send();
                    })
                    .catch(() => {
                        res.status(500).send();
                    })
            });
            // m.insertBulkRowsBank(u.createObjArray(u.handleCSV(req.file.buffer)));
        }else if (req.file.originalname.split('.').pop() !== 'csv' && req.file.mimetype !== 'application/vnd.ms-excel'){
            res.status(415).send();
        }else if (req.file.size > 1000000){
            res.status(413).send();
        }
    })

    app.delete('/transactions:id', (req, res) => {
        console.log('DELETE: transactions:id');
    })

    app.delete('/transactions/all', (req, res) => {
        console.log('DELETE: transactions/all');
    })

    app.get('/tags', (req, res) => {
        m.getUserTags('warren')
            .then(response => {
                res.status(200).send(response);
            })
            .catch(() => {
                res.status(500).send();
            });
    })

    app.post('/tags', (req, res) =>{
        console.log('POST: Transactions', req.body);
        let tag = req.body.tag;
        tag.description = tag.description.replace(/ +(?= )/g, '');
        tag.amount = tag.amount.replace(/ /g, '');
        m.insertRowTag(tag)
            .then(response => {
                res.status(201).send(response);
                console.log('done');
            })
        }
    );

    app.delete('/tags/:id', (req, res) =>{
        console.log('DELETE: Transactions');
        m.deleteUserTag(req.params.id)
            .then(response => {
                if (response === 1){
                    res.status(200).send();
                }else if (response === 0){
                    res.status(404).send();
                }else{
                    res.status(500).send();
                }
            })
        }
    );

    // Expense categories: Adding, retrieving, removing
    app.get('/categories', (req, res) =>{
        console.log('GET: Categories');
        m.getUserCategories('warren')
            .then(data => {
                res.status(200).send(data);
            });
    }
    );
    app.post('/categories', (req, res) =>{
        console.log('POST: Categories', req.body);
        let categoryObj = req.body;
        categoryObj.category = categoryObj.category.replace(/ +(?= )/g, '');
        m.createUserCategory(categoryObj)
            .then(response => {
                res.status(201).send(response);
            })
        }
    );
    app.delete('/categories:id', (req, res) =>{
        console.log('DELETE: Categories', req.params);
        m.deleteUserCategory(req.params.id)
            .then(response => {
                if (response === 1){
                    res.status(200).send();
                }else if (response === 0){
                    res.status(404).send();
                }else{
                    res.status(500).send();
                }
            });
        }
    );
};
