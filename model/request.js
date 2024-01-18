const Sequelize=require('sequelize');
const sequelize=require('../util/database');
const Request = sequelize.define(('request'), {
    from:{
    type:Sequelize.INTEGER,
    allowNull:false,
    },
    towards:{
    type:Sequelize.INTEGER,
    allowNull:false
           },
    name:Sequelize.STRING,    
    accepted:{
    type:Sequelize.BOOLEAN,
    default:false }}, 
           {
            timestamps: false
        });
module.exports=Request;