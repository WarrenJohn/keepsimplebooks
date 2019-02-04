require('dotenv').config({path:'../.env'});
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const m = require('./models');

const app = express();
const port = process.env.PORT;

app.use(express.static('./static'));
app.use(bodyParser.json());
app.use(cors());

require('./routes')(app);

const todo = `
\x1b[47m\x1b[30m\x1b[4m

    FEATURES / TO DO:\x1b[0m\x1b[47m
\x1b[30m
- Unit tests
- Add an API service for vue to manage the api requests
- Limit user requests to prevent spamming (express-rate-limit or something similar)
- Convert complicated template variables to computed properties
- Add date range selection functionality to Dashboard.vue, Transactions.vue & History.vue
- Dashboard charts, money flow in and out
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
