const path = require('path');
const views = path.join(__dirname, 'views');

const u = require('./utils.js');
const m = require('./models.js');


/* How do I render plain HTML?
You don’t! There’s no need to “render” HTML with the res.render() function. If you have a specific file,
use the res.sendFile() function.
If you are serving many assets from a directory, use the express.static() middleware function.
*/

module.exports = app => {
    app.get('/', (req, res) =>{
        console.log('GET: index');
        res.sendFile(path.join(views, '/index.html'));
        }
    );
    app.get('/robots.txt', (req, res) =>{
        console.log('GET: robots');
        res.send('robots.txt');
        }
    );
    app.get('/login', (req, res) =>{
        console.log('GET: login');
        res.send('Login');
        }
    );
    app.get('/signup', (req, res) =>{
        console.log('GET: signup');
        res.send('Sign Up');
        }
    );
    app.get('/dashboard', (req, res) =>{
        // Show money flow in/out
        // most common expenses
        console.log('GET: dashboard');
        res.send('Dashboard');
        }
    );
    app.get('/upload', (req, res) =>{
        // TODO:
        // User uploads CSV
        // '' specify columns
        // '' init upload
        u.handleCSV('accountactivity.csv');
        console.log('GET: upload');
        res.send('Upload');
        }
    );
    app.get('/transactions', (req, res) =>{
        // Manage transactions
        // Tag transactions
        // -incl. option whether transaction is HST taxable or not
        m.userTransactions('warren');
        console.log('GET: transactions');
        res.send('Tag Transactions');
        }
    );
    app.get('/history', (req, res) =>{
        m.userTransactions('warren');
        console.log('GET: history');
        res.send('View History');
        }
    );

    app.use((req, res, next) => {
        res.status(404).send('<h1>404: Not found</h1>');
    });

    app.use((err, req, res, next) => {
        console.error(err.stack);
        res.status(500).send('<h1>500: Something broke!</h1>');
    });
};
