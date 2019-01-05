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
    // Need to build api for Vue
    app.get('/', (req, res) =>{
        console.log('GET: index');
        res.send('Index');
        // res.sendFile(path.join(views, '/index.html'));
        }
    );

    // Users: registering, logging in and modifying users
    app.get('/users', (req, res) =>{
        console.log('GET: Users');
        res.send('Users');
        // res.sendFile(path.join(views, '/index.html'));
        }
    );
    app.post('/users', (req, res) =>{
        console.log('Post: Users');
        res.send('Users');
        // res.sendFile(path.join(views, '/index.html'));
        }
    );
    app.patch('/users', (req, res) =>{
        console.log('Post: Users');
        res.send('Users');
        // res.sendFile(path.join(views, '/index.html'));
        }
    );

    // Transactions uploading, viewing, tagging, modifying and deleting transactions
    app.get('/transactions', (req, res) =>{
        console.log('GET: Transactions');
        // reversed to get newest transactions at the top
        m.userTransactions('warren').then(data => {res.send(data.reverse());});
    }
    );
    app.post('/transactions', (req, res) =>{
        console.log('POST: Transactions', req.body);
        // need to verify that no repeat info is added i.e. if 2 csvs are uploaded and they have transactions that overlap
        u.handleTags(req.body);
        res.send('Transactions');
        // res.sendFile(path.join(views, '/index.html'));
        }
    );
    app.patch('/transactions', (req, res) =>{
        console.log('PATCH: Transactions');
        res.send('Transactions');
        // res.sendFile(path.join(views, '/index.html'));
        }
    );
    app.delete('/transactions', (req, res) =>{
        console.log('DELETE: Transactions');
        res.send('Transactions');
        // res.sendFile(path.join(views, '/index.html'));
        }
    );
};
