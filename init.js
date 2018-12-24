require('dotenv').config({path:'../.env'});

// // csv API: https://csv.js.org/parse/api/
// // watch this: https://www.youtube.com/watch?v=j55fHUJqtyw&list=PLillGF-RfqbYSx-Ab1xWVanGKtowTsnNm
// // from: https://stackoverflow.com/questions/41776978/how-to-read-csv-file-in-node-js
// // Vue: https://www.youtube.com/watch?v=5LYrN_cAJoA&list=PL4cUxeGkcC9gQcYgjhBoeQH7wiAyZNrYa
// const fs = require('fs');
// var parse = require('csv-parse');
// fs.readFile("accountactivity.csv", function (err, fileData) {
//   parse(fileData, {columns: false, trim: true}, function(err, rows) {
//       console.log(rows);
//     // Your CSV data is in an array of arrys passed to this callback as rows.
//     });
// });
