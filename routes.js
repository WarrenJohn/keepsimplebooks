const path = require('path');
const views = path.join(__dirname, 'views');

const u = require('./utils');
const m = require('./models');


/* How do I render plain HTML?
You don’t! There’s no need to “render” HTML with the res.render() function. If you have a specific file,
use the res.sendFile() function.
If you are serving many assets from a directory, use the express.static() middleware function.
*/

// Upload page function
// u.handleCSV('accountactivity.csv');


module.exports = app => {
    app.get('/', (req, res) =>{
        console.log('GET: index');
        res.send('Index');
        }
    );

    // Users: registering, logging in and modifying users
    app.get('/users', (req, res) =>{
        console.log('GET: Users');
        res.send('Users');
        }
    );
    app.post('/users', (req, res) =>{
        console.log('Post: Users');
        res.send('Users');
        }
    );
    app.patch('/users', (req, res) =>{
        console.log('Post: Users');
        res.send('Users');
        }
    );

    // Transactions uploading, viewing, tagging, modifying and deleting transactions
    app.get('/transactions', (req, res) =>{
        console.log('GET: Transactions');
        // reversed to get newest transactions at the top
        m.userTransactions('warren').then(data => {res.send(data.reverse());});
    }
    );
    app.post('/transactions', async (req, res) =>{
        console.log('POST: Transactions', req.body);
        let tag = req.body.tag;
        tag.description = tag.description.replace(/ +(?= )/g, '');
        tag.amount = tag.amount.replace(/ /g, '');
        res.send(await m.insertRowTag(req.body.tag));
        }
    );
    app.patch('/transactions', (req, res) =>{
        console.log('PATCH: Transactions');
        res.send('Transactions');
        }
    );
    app.delete('/transactions', (req, res) =>{
        console.log('DELETE: Transactions');
        res.send('Transactions');
        }
    );

    // Expense categories: Adding, retrieving, removing
    app.get('/categories', (req, res) =>{
        console.log('GET: Categories');
        m.getUserCategories('warren').then(data => {
            res.send(data);
        });
    }
    );
    app.post('/categories', async (req, res) =>{
        console.log('POST: Categories', req.body);
        let categoryObj = req.body;
        categoryObj.category = categoryObj.category.replace(/ +(?= )/g, '');
        res.send(await m.createUserCategory(categoryObj));
        }
    );
    app.delete('/categories', (req, res) =>{
        console.log('DELETE: Categories');
        res.send('Categories');
        }
    );
};
