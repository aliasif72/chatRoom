const Sequelize=require('sequelize');
const sequelize= new Sequelize('chatapp',
    'root','Asif@6070',{dialect: 'mysql', 
    host: 'localhost'});
module.exports = sequelize;