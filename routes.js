const path = require('path');
const views = path.join(__dirname, 'views');
const fs = require('fs');
const u = require('./utils');
const m = require('./models');
const multer = require('multer');
const parse = require('csv-parse');

const upload = multer()

/* How do I render plain HTML?
You don’t! There’s no need to “render” HTML with the res.render() function. If you have a specific file,
use the res.sendFile() function.
If you are serving many assets from a directory, use the express.static() middleware function.
*/


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
    app.post('/users', (req, res) =>{
        console.log('Post: Users');
        res.status(200).send('Users');
        }
    );
    app.patch('/users', (req, res) =>{
        console.log('Post: Users');
        res.status(200).send('Users');
        }
    );

    // Transactions uploading, viewing, tagging and deleting transactions
    app.get('/transactions', (req, res) =>{
        console.log('GET: Transactions');
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
            await u.handleCSV(req.file.buffer)
            res.status(201).send();
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

    app.post('/tags', async (req, res) =>{
        console.log('POST: Transactions', req.body);
        let tag = req.body.tag;
        tag.description = tag.description.replace(/ +(?= )/g, '');
        tag.amount = tag.amount.replace(/ /g, '');
        res.status(201).send(await m.insertRowTag(req.body.tag));
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
        m.getUserCategories('warren').then(data => {
            res.status(200).send(data);
        });
    }
    );
    app.post('/categories', async (req, res) =>{
        console.log('POST: Categories', req.body);
        let categoryObj = req.body;
        categoryObj.category = categoryObj.category.replace(/ +(?= )/g, '');
        res.status(201).send(await m.createUserCategory(categoryObj));
        }
    );
    app.delete('/categories/:id', (req, res) =>{
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
