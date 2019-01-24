require('dotenv').config({path:'../.env'});
const express = require('express');
var cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const m = require('./models');

const app = express();
const port = process.env.PORT;
const views = path.join(__dirname, 'views');
app.use(express.static('./static'));
app.use(bodyParser.json());
app.use(cors());
require('./routes')(app);

const todo = `
\x1b[47m\x1b[30m\x1b[4m

    FEATURES / TO DO:\x1b[0m\x1b[47m
\x1b[30m
- Unit tests
- Limit user requests to prevent spamming (express-rate-limit or something similar)
- Make status codes in routes smarter
- Put logged in / logged out feedback and registration feedback on the nav component so it persists with page redirect
- Convert complicated template variables to computed properties
- Add taxable option and tax rate to tags
- Add feature to allow user to just use transaction descriptions instead of making their own tags
- Fix weird bug in transactions page that doesn't input the category sometimes, and also gets the table all messed up
- Add date range selection functionality to Dashboard.vue, Transactions.vue & History.vue
- Dashboard charts, money flow in and out
- View categories & tags
- Remove categories & tag
- Upload data functionality
- User authentication & login
-- Don't forget to remove all instances of 'warren' from user field
- Index/about/register/login pages styling and text, better nav bar, etc..
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
