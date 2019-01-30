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
    app.get('/users', u.hasToken, (req, res) =>{
        console.log('GET: Users');
        const tokenReceived = req.headers.authorization.split(' ')[1];
    const token = jwt.verify(tokenReceived, jwtCert);
        if (token){
            res.status(200).send('Users');
        }else{
            res.status(403).send()
        }
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
    app.patch('/users',  u.hasToken, (req, res) =>{
        console.log('Post: Users');
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
    app.get('/transactions', u.hasToken, (req, res) =>{
        console.log('GET: Transactions');
        const tokenReceived = req.headers.authorization.split(' ')[1];
        const token = jwt.verify(tokenReceived, jwtCert);
        if (token){
            // reversed to get newest transactions at the top
            m.userTransactions(token.email)
            .then(data => {
                res.status(200).send(data.reverse());
            })
            .catch(err => {
                res.status(500).send();
            });
        }else{
            res.status(403).send();
        }
    }
    );

    app.post('/transactions/upload', u.hasToken, upload.single('bank'), (req, res) => {
        console.log('POST: transactions/upload');
        const tokenReceived = req.headers.authorization.split(' ')[1];
        const token = jwt.verify(tokenReceived, jwtCert);
        if (token){
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
                        user: token.email}))
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
        }else{
            res.status(403).send();
        }
    })

    app.delete('/transactions:id', u.hasToken, (req, res) => {
        console.log('DELETE: transactions:id');
        const tokenReceived = req.headers.authorization.split(' ')[1];
        const token = jwt.verify(tokenReceived, jwtCert);
        if (token){
            res.status(200).send();
        }else{
            res.status(403).send();
        }
    })

    app.delete('/transactions/all', u.hasToken, (req, res) => {
        console.log('DELETE: transactions/all');
        const tokenReceived = req.headers.authorization.split(' ')[1];
        const token = jwt.verify(tokenReceived, jwtCert);
        if (token){
            res.status(200).send();
        }else{
            res.status(403).send();
        }
    })

    app.get('/tags', u.hasToken, (req, res) => {
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

    app.post('/tags', u.hasToken, (req, res) =>{
        console.log('POST: Transactions');
        const tokenReceived = req.headers.authorization.split(' ')[1];
        const token = jwt.verify(tokenReceived, jwtCert);
        if (token){
            let tag = req.body.tag;
            // removing extra spaces to normalize data
            tag.description = tag.description.replace(/ +(?= )/g, '');
            tag.amount = tag.amount.replace(/ /g, '');
            m.insertRowTag(tag)
            .then(response => {
                res.status(201).send(response);
            })

        }else{
            res.status(403).send();
        }
        }
    );

    app.delete('/tags/:id', u.hasToken, (req, res) =>{
        console.log('DELETE: Transactions');
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

    // Expense categories: Adding, retrieving, removing
    app.get('/categories', u.hasToken, (req, res) =>{
        console.log('GET: Categories');
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
    app.post('/categories', u.hasToken, (req, res) =>{
        console.log('POST: Categories', req.data);
        const tokenReceived = req.headers.authorization.split(' ')[1];
        const token = jwt.verify(tokenReceived, jwtCert);
        if (token){
            let categoryObj = req.body;
            console.log('CATEGORY OBJ  ',categoryObj);
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
    app.delete('/categories/:id', u.hasToken, (req, res) =>{
        console.log('DELETE: Categories');
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
};
