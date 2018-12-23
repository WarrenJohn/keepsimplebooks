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
const db = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PW, {
    dialect: 'postgres',
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    operatorsAliases: operatorsAliases
});

// Models are defined with sequelize.define('name', {attributes}, {options});
// Sequelize will automatically add the columns: id, createdAt and updatedAt.
const Test = db.define('Test',
    {
      username: {
        type: Sequelize.STRING
        },
      password: {
        type: Sequelize.STRING
        }
    },
    {
        tableName: 'my_test_table', // this will define the table's name
        timestamps: true            // this will activate/deactivate the timestamp columns
    });

// {force: true} will drop the table if it already exists
// Test.sync({force: true})
//     .then(() => {
//         // Table created
//         return Test.create({
//             username: 'Warren',
//             password: '1234'
//         });
//     })
//     .catch((err) => {
//         console.log(err);
//     });

// Test connection
db.authenticate()
    .then(() => {
        console.log("\nDatabase connected!\n");
    })
    .catch((err) => {
        console.log(err);
    });
// Grab all test
// http://docs.sequelizejs.com/manual/tutorial/querying.html
// https://sequelize.readthedocs.io/en/1.7.0/articles/getting-started/#managing-the-schema-of-your-database
Test.findAll()
    .then(users => {
      console.log(users);
    })
    .catch(err => console.log(err));

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
