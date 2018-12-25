const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config({path:'../.env'});
const app = express();
const port = process.env.PORT;
const views = path.join(__dirname, 'views');
app.use(express.static('./static'));
app.use(bodyParser.json());


/* How do I render plain HTML?
You don’t! There’s no need to “render” HTML with the res.render() function. If you have a specific file,
use the res.sendFile() function.
If you are serving many assets from a directory, use the express.static() middleware function.
*/

app.get('/', (req, res) =>{
    console.log('GET: index');
    res.sendFile(path.join(views, '/index.html'));
    // Vue will work if I write the code directly in a script tag
    // in the index.html file, but not if I link the index.js in the script tag.
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
    console.log('GET: dashboard');
    res.send('Dashboard');
    }
);
app.get('/upload', (req, res) =>{
    console.log('GET: upload');
    res.send('Upload');
    }
);
app.get('/transactions', (req, res) =>{
    console.log('GET: transactions');
    res.send('Tag Transactions');
    }
);
app.get('/history', (req, res) =>{
    console.log('GET: history');
    res.send('View History');
    }
);

app.use((req, res, next) => {
    res.status(404).send("404: Not found");
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('500: Something broke!');
});

app.listen(port, () => console.log(`Listening on port ${port}!`));
