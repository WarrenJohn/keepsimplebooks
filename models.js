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

// Sync DB
// keepsimple_db.sync(); // Enable for production
Bank.sync({force: true}); // DEV ONLY, using to easily drop tables

// Verify connection
keepsimple_db.authenticate()
    .then(() => {
        console.log("\nDatabase connected!\n");
    })
    .catch((err) => {
        console.log(err);
    });

// {fields: ['transaction_date', 'description', 'withdrawl', 'deposit', 'balance']}
module.exports.insertRow = (object) =>{
        Bank.create(object);
    };

module.exports.insertBulkRows = (object_array) => {
    Bank.bulkCreate(object_array);
};

// Grab all test
// http://docs.sequelizejs.com/manual/tutorial/querying.html
// https://sequelize.readthedocs.io/en/1.7.0/articles/getting-started/#managing-the-schema-of-your-database
// User.findAll()
// .then(users => {
//     console.log(users);
// })
// .catch(err => console.log(err));


    /*
    // DON'T DO THIS
    user = User.findOne()

    console.log(user.get('firstName'));

    will never work! This is because user is a promise object, not a data row from the DB. The right way to do it is:

    User.findOne().then(user => {
      console.log(user.get('firstName'));
    });

    When your environment or transpiler supports async/await this will work but only in the body of an async function:

    user = await User.findOne()

    console.log(user.get('firstName'));
    */
