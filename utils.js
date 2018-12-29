const m = require('./models.js');
const fs = require('fs');
const parse = require('csv-parse');

const createObjArray = data => {
    // data must be array of arrays
    let array = Array();
    data.map(row => array.push({
        transaction_date: row[0],
        description: row[1],
        withdrawl: row[2],
        deposit: row[3],
        balance: row[4],
        user: 'warren'}));
    return array;
};

module.exports.parseTransactions = transactions => {
    let parsed_obj = {};
    transactions.map(obj => {
        console.log(obj.description);
    });
};

module.exports.handleCSV = file => {
    fs.readFile(file, function (err, fileData) {
        parse(fileData, {columns: false, trim: true}, function(err, data) {
            // data is converted in an array of objects prior to db insertion
            m.insertBulkRows(createObjArray(data));
        });
    });
};

module.exports.handleCSV_rows = file => {
    // inserts csv data row by row
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
