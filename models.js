// http://docs.sequelizejs.com/manual/installation/usage.html
// https://codeforgeek.com/2017/01/getting-started-sequelize-postgresql/

require('dotenv').config({path:'../.env'});
const Sequelize = require('sequelize');
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PW, {
  dialect: 'postgres',
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
});

sequelize.authenticate().then(() => {
  console.log("Success!");
}).catch((err) => {
  console.log(err);
});
