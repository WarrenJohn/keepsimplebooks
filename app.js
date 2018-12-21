// from: https://stackoverflow.com/questions/41776978/how-to-read-csv-file-in-node-js
const fs = require('fs');
var parse = require('csv-parse');
fs.readFile("accountactivity.csv", function (err, fileData) {
  parse(fileData, {columns: false, trim: true}, function(err, rows) {
      console.log(rows);
    // Your CSV data is in an array of arrys passed to this callback as rows.
    });
});
