const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config({path:'../.env'});
const app = express();
const port = process.env.PORT;

app.use(express.static('static'));
app.use(bodyParser.json());
/* How do I render plain HTML?
You don’t! There’s no need to “render” HTML with the res.render() function. If you have a specific file,
use the res.sendFile() function.
If you are serving many assets from a directory, use the express.static() middleware function.
*/
// TESTING
app.get('/', (req, res) =>{
    console.log('GET: index');
    res.send('Index Page Test');
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
