// http://docs.sequelizejs.com/manual/installation/usage.html
// https://codeforgeek.com/2017/01/getting-started-sequelize-postgresql/
require('dotenv').config({path:'../.env'});
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const operatorsAliases = {
  $eq: Op.eq,
  $ne: Op.ne,
  $gte: Op.gte,
  $gt: Op.gt,
  $lte: Op.lte,
  $lt: Op.lt,
  $not: Op.not,
  $in: Op.in,
  $notIn: Op.notIn,
  $is: Op.is,
  $like: Op.like,
  $notLike: Op.notLike,
  $iLike: Op.iLike,
  $notILike: Op.notILike,
  $regexp: Op.regexp,
  $notRegexp: Op.notRegexp,
  $iRegexp: Op.iRegexp,
  $notIRegexp: Op.notIRegexp,
  $between: Op.between,
  $notBetween: Op.notBetween,
  $overlap: Op.overlap,
  $contains: Op.contains,
  $contained: Op.contained,
  $adjacent: Op.adjacent,
  $strictLeft: Op.strictLeft,
  $strictRight: Op.strictRight,
  $noExtendRight: Op.noExtendRight,
  $noExtendLeft: Op.noExtendLeft,
  $and: Op.and,
  $or: Op.or,
  $any: Op.any,
  $all: Op.all,
  $values: Op.values,
  $col: Op.col
};
// ^re: http://docs.sequelizejs.com/manual/tutorial/querying.html#operators-aliases

// Connecting to the database
const keepsimple_db = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PW, {
    dialect: 'postgres',
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    operatorsAliases: operatorsAliases
});

// Init DB table model.
// sequelize.define('name', {attributes}, {options});
const Bank = keepsimple_db.define('transactions',
    {
      transaction_date: {type: Sequelize.TEXT},
      description: {type: Sequelize.TEXT},
      withdrawl: {type: Sequelize.TEXT},
      deposit: {type: Sequelize.TEXT},
      balance: {type: Sequelize.TEXT},
      user: {type: Sequelize.TEXT}
    },
    {
        tableName: 'transactions',
        timestamps: true
    });

// columns: [ 'id', 'transaction_date', 'description', 'withdrawl', 'deposit', 'balance', 'user', 'createdAt', 'updatedAt' ]
module.exports.userTransactions = query => {
    return Bank.findAll({
        where: {user: query}
    })
    .then((data) => {
        let transactions = Array();
        let descriptions = Array();
        data.map((obj) => {transactions.push({
                id: obj.id,
                date: obj.transaction_date,
                description: obj.description,
                withdrawl: obj.withdrawl,
                deposit: obj.deposit,
                balance: obj.balance}
                );
            descriptions.push(obj.description);
            });
        return transactions;
    })
    .catch(err => {
        console.log("USER TRANSACTION ERROR: ", err);
    });
};

// {fields: ['transaction_date', 'description', 'withdrawl', 'deposit', 'balance']}
module.exports.insertBulkRows = object_array => {
    Bank.sync() // .sync() is called to make sure the table exists prior to inserting data
        .then(() => {
            return Bank.bulkCreate(object_array);
        })
        .catch(err => {
            console.log(err);
        });
    };

module.exports.insertRow = object =>{
    Bank.sync()
        .then(() => {
            return Bank.create(object);
        })
        .catch(err => {
            console.log(err);
        });
    };

module.exports.Sequelize = Sequelize;
module.exports.keepsimple_db = keepsimple_db;
module.exports.Bank = Bank;
