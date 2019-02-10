require('dotenv').config({path:'../.env'});
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const m = require('./models');

const app = express();
const port = process.env.PORT;

// express-rate-limit
app.enable("trust proxy"); // only if you're behind a reverse proxy (Heroku, Bluemix, AWS ELB, Nginx, etc)
const rateLimit = require("express-rate-limit");
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 200 // limit each IP to 200 requests per windowMs
});

app.use(bodyParser.json());
app.use(limiter);
app.use(cors());

require('./routes')(app);

const todo = `
\x1b[47m\x1b[30m\x1b[4m

    FEATURES / TO DO:\x1b[0m\x1b[47m
\x1b[30m
- Delete all transactions option for user
- Encrypt financial data / annonymize user's financial data
- Unit tests
- Don't allow user to submit tag without first confirming its category has been added
- Dashboard charts, money flow in and out
\n
CONSIDERATION:
- making current categories into subcategories to allow for more encapsulation of the data. i.e. grouping categories.
- interactive test for users to try before register
- make 'add tag' box 'sticky' on transactions page
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
