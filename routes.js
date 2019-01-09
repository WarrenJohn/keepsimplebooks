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
        // res.send(await u.handleTags(req.body));
        // parse req.body priot to inserting to db
        res.send(await m.insertRowTags(req.body.tag))
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
        // reversed to get newest transactions at the top
        m.getUserCategories('warren').then(data => {
            // console.log(data)
            res.send(data);
        });
    }
    );
    app.post('/categories', async (req, res) =>{
        console.log('POST: Categories');
        // m.createUserCategory(req.body); // Need to use req.body.whatEverNameIendUpChoosing
        res.send(await m.createUserCategory(req.body));
        }
    );
    app.delete('/categories', (req, res) =>{
        console.log('DELETE: Categories');
        res.send('Categories');
        }
    );
};
