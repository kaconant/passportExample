const Sequelize = require('sequelize'); // 3 -- this is the class of sequelize
const sequelize = new Sequelize('postgres://postgres@localhost:5432/passportblog') // 4 -- able to use sequelize in this and connect to database in postico

const User = sequelize.define('user', {
    username: Sequelize.STRING,
    password: Sequelize.STRING,
    github_id: Sequelize.STRING,
});

// only need to run this once
User.sync();

module.exports = User;