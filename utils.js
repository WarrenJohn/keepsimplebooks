const m = require('./models.js');
const fs = require('fs');
const parse = require('csv-parse');

// TODO: Need to parse all spaces in uploaded and income data to remove the spaces, track the indexes where they were and manually add only one space
// check for empty description or amount and implement logic to disregard that column when sorting transactions


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
    // Normalize data:
    // remove spaces in descriptions and re add them to make sure there are no double spaces
    let parsed_obj = {};
    transactions.map(obj => {
        console.log(obj.description);
    });
};

module.exports.handleTags = data => {
    let parsedTag = data.tag; // Temporary until parsing actually implemented
    console.log("Parsed Data", parsedTag);
    return m.insertRowTags(parsedTag);
};

module.exports.handleCSV = file => {
    fs.readFile(file, function (err, fileData) {
        parse(fileData, {columns: false, trim: true}, function(err, data) {
            // data is converted in an array of objects prior to db insertion
            m.insertBulkRowsBank(createObjArray(data));
        });
    });
};

module.exports.handleCSV_row = file => {
    // inserts csv data row by row
    fs.readFile(file, function (err, fileData) {
        parse(fileData, {columns: false, trim: true}, function(err, data) {
            // CSV data is in an array of arrys passed to this callback as rows.
            data.forEach(row => {
                m.insertRowBank({
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
