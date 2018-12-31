const path = require('path');
const views = path.join(__dirname, 'views');

const u = require('./utils.js');
const m = require('./models.js');


/* How do I render plain HTML?
You don’t! There’s no need to “render” HTML with the res.render() function. If you have a specific file,
use the res.sendFile() function.
If you are serving many assets from a directory, use the express.static() middleware function.
*/

// Upload page function
u.handleCSV('accountactivity.csv');
// Transactions & History page function
m.userTransactions('warren');

module.exports = app => {
    // Need to build api for Vue
    app.get('/', (req, res) =>{
        console.log('GET: index');
        res.sendFile(path.join(views, '/index.html'));
        }
    );
};
