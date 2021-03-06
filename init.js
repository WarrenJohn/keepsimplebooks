require('dotenv').config({path:'../.env'});
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const history = require('connect-history-api-fallback');

const m = require('./models');

const app = express();
const port = process.env.PORT;

// express-rate-limit
app.enable("trust proxy"); // only if you're behind a reverse proxy (Heroku, Bluemix, AWS ELB, Nginx, etc)
const rateLimit = require("express-rate-limit");

const userLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 15 // limit each IP to 300 requests per windowMs
});

const transactionsLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 300
});

const tagsLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 300
});

app.use(history());

app.use('/users/', userLimiter);
app.use('/transactions/', transactionsLimiter);
app.use('/tags/', tagsLimiter);
app.use('/categories/', tagsLimiter);
// //

app.use(bodyParser.json());
app.use(cors());

if (process.env.NODE_ENV === 'production'){
    app.use(express.static(__dirname + '/client/dist'))
}

require('./routes')(app);

const todo = `
\x1b[47m\x1b[30m\x1b[4m

    FEATURES / TO DO:\x1b[0m\x1b[47m
\x1b[30m
TODO:
- Let user opt to never store their data
- User Profile route

CONSIDERATION:
- Dashboard charts, money flow in and out
- Balance Sheet yearly comparison
-- Compare 2017 to 2018 by adding a second line to the totals
- making current categories into subcategories to allow for more encapsulation of the data. i.e. grouping categories.
-- Alternatively, allow user to create multiple profiles each with their own tags and categories so they can generate balance sheets,  P/L statements, etc..
- interactive test for users to try before register
- Send to accountant function
-- Send summary with option to include full breakdown
\x1b[0m`;

m.keepsimple_db.authenticate()
    .then(() => {
        // Test connection
        return console.log("\nDatabase connected!\n");
    })
    .then(() => {
        // Sync the database to create any tables 'if not exists'
        // return m.Bank.sync();
        return m.keepsimple_db.sync();
        // DEV ONLY, using to easily drop tables
        // Use m.keepsimple_db.sync() for production
    })
    .then(() => {
        // Start the server
        app.listen(port, () => console.log(`\nListening on port ${port}!\n`));
        console.log(todo);
    })
    .catch((err) => {
        console.log(err);
    });
