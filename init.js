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
// app.set('views', path.join(__dirname + 'views'));
require('./routes')(app);
// Vue docs: https://cli.vuejs.org/guide/

// May not need body-parser:
// https://expressjs.com/en/4x/api.html - express.json([options])
// https://www.reddit.com/r/javascript/comments/78jjna/express_now_includes_bodyparser_middleware_by/
m.keepsimple_db.authenticate()
    .then(() => {
        // Test connection
        return console.log("\nDatabase connected!\n");
    })
    .then(() => {
        // Sync the database to create any tables 'if not exists'
        return m.Bank.sync();
        // DEV ONLY, using to easily drop tables
        // Use m.keepsimple_m.sync() for production
    })
    .then(() => {
        // Start the server
        app.listen(port, () => console.log(`\nListening on port ${port}!\n`));
    })
    .catch((err) => {
        console.log(err);
    });
