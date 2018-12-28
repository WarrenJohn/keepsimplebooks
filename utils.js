const m = require('./models.js');
const fs = require('fs');
const parse = require('csv-parse');

module.exports.handleCSV = file => {
    fs.readFile(file, function (err, fileData) {
        parse(fileData, {columns: false, trim: true}, function(err, data) {
            // CSV data is in an array of arrys passed to this callback as rows.
            data.forEach(row => {
                m.insertRow({
                    transaction_date: row[0],
                    description: row[1],
                    withdrawl: row[2],
                    deposit: row[3],
                    balance: row[4],
                    user: 'warren'
                });
            });
        });
    });
};
