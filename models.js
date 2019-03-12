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
//  It's here if needed

// Connecting to the database
const keepsimple_db = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PW, {
    dialect: 'postgres',
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    operatorsAliases: operatorsAliases
});

// Init DB table models.
// sequelize.define('name', {attributes}, {options});
const Users = keepsimple_db.define('users', {
    email: {type: Sequelize.TEXT, unique: true},
    password: {type: Sequelize.TEXT},
    other: {type: Sequelize.TEXT}
    },
    {
        tableName: 'users',
        timestamps: true
    }
);

// Holds the user defined tags on their transactions
const Categories = keepsimple_db.define('categories', {
    name: {type: Sequelize.TEXT, allowNull: false},
    user: {type: Sequelize.TEXT, allowNull: false}
    },
    {
        tableName: 'categories',
        timestamps: true
    }
);

// Holds the user defined tags on their transactions
const Tags = keepsimple_db.define('tags', {
    category: {type: Sequelize.TEXT, allowNull: false},
    description: {type: Sequelize.TEXT},
    amount: {type: Sequelize.TEXT},
    user: {type: Sequelize.TEXT, allowNull: false}
    },
    {
        tableName: 'tags',
        timestamps: true
    }
);

// Holds all the financial info uploaded
const Bank = keepsimple_db.define('transactions',{
      transaction_date: {type: Sequelize.TEXT},
      description: {type: Sequelize.TEXT},
      withdrawl: {type: Sequelize.TEXT},
      deposit: {type: Sequelize.TEXT},
      balance: {type: Sequelize.TEXT},
      user: {type: Sequelize.TEXT, allowNull: false}
    },
    {
        tableName: 'transactions',
        timestamps: true
    });

// // // // // // // // // // // // // // // // // // // // // // // //

// USER REGISTER AND LOG IN
module.exports.registerUser = userObj => {
return Users.sync()
    .then(() => {
        return Users.findOrCreate({
            where: {
                email: userObj.email.toLowerCase(),
                password: userObj.password
            }
        })
    .spread((user, created) => {
        return {user, created};
    })
    .catch(err => {
        throw new Error("Create User Category Error: ", err);
        });
    });
}

module.exports.fetchUser = query => {
        return Users.findOne({where: {email: query}})
            .then(data => {
                return data;
            })
            .catch(err => {
                throw new Error('Get User Error: ', err);
            });
}
// // // // // // // // // // // // // // // // // // // // // // // //

// EXPENSE CATEGORIES TABLE METHODS
module.exports.getUserCategories = query => {
    return Categories.findAll({
        where: {user: query}
        })
        .then(data => {
            return data;
        })
        .catch(err => {
            throw new Error("Get User Category Error: ", err);
            });
    };

module.exports.createUserCategory = (object, user) => {
    return Categories.sync()
        .then(() => {
            return Categories.findOrCreate({
                where: {
                    name: object.category.toUpperCase(),
                    user: user
                }
            })
        .spread((user, created) => {
            return {user, created};
        })
        .catch(err => {
            throw new Error("Create User Category Error: ", err);
            });
        });
    };

module.exports.deleteUserCategory = (id, user) => {
    return Categories.destroy({
        where: {
            id: id,
            user: user
        }
    })
        .then(response => {
            return response;
        })
}

// // // // // // // // // // // // // // // // // // // // // // // //

// BANK TABLE METHODS
// columns: [ 'id', 'transaction_date', 'description', 'withdrawl', 'deposit', 'balance', 'user', 'createdAt', 'updatedAt' ]
const userTransactions = user => {
    return Bank.findAll({
        where: {user}
        })
        .then((data) => {
            let transactions = Array();
            data.map((obj) => {transactions.push({
                    id: obj.id,
                    date: obj.transaction_date,
                    description: obj.description,
                    withdrawl: obj.withdrawl,
                    deposit: obj.deposit,
                    balance: obj.balance
                });
                });
            return transactions;
        })
        .catch(err => {
            throw new Error("Get Transactions Error: ", err);
        });
    };

module.exports.deleteOne = (id, user) => {
    return Bank.destroy({
        where: {
            id, user
        }
    })
}

module.exports.deleteAll = async user => {
    let response = await userTransactions(user)
    response = response.map(data => (data.id))
    return Bank.destroy({
        where: {
            id: response
        }
    })
};
// {fields: ['transaction_date', 'description', 'withdrawl', 'deposit', 'balance']}
module.exports.insertBulkRowsBank = object_array => {
    Bank.sync() // .sync() is called to make sure the table exists prior to inserting data
        .then(() => {
            Bank.bulkCreate(object_array);
        })
        .catch(err => {
            throw new Error("Insert Bulk Rows(Transactions) Error: ", err);
        });
    };

module.exports.insertRowBank = object =>{
    Bank.sync()
        .then(() => {
            return Bank.create(object);
        })
        .catch(err => {
            throw new Error(err);
        });
    };

// TAGS TABLE METHODS
module.exports.insertRowTag = object =>{
    return Tags.sync()
        .then(() => {
            return Tags.findOrCreate({
                where: {
                    category: object.category.toUpperCase(),
                    description: object.description.toUpperCase(),
                    amount: object.amount,
                    user: object.user}
                }
            );
        })
        .spread((tag, created) => {
            return {tag, created};
        })
        .catch(err => {
            throw new Error("Insert Row Tags Error: ", err);
        });
    };

module.exports.getUserTags = query => {
    return Tags.findAll({
        where: {user: query}
        })
        .then(data => {
            return data;
        })
        .catch(err => {
            throw new Error("Insert Single Row(Transactions) Error: ", err);
        });
    };

module.exports.deleteUserTag = (id, user) => {
    return Tags.destroy({
        where: {
            id: id,
            user: user
        }
    })
        .then(response => {
            return response;
        })
}

module.exports.Sequelize = Sequelize;
module.exports.keepsimple_db = keepsimple_db;
module.exports.userTransactions = userTransactions;
