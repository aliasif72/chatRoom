const Sequelize=require('sequelize');
const sequelize=require('../util/database');
const User = sequelize.define(('user'), {
    id:{
        type:Sequelize.INTEGER,
        autoIncrement:true,
        allowNull:false,
        primaryKey:true
    },
    name:{
        type:Sequelize.STRING,
        allowNull:false
    },
    number:{
        type:Sequelize.INTEGER,
        allowNull:false,
        unique:true
    },
    password:{
            type:Sequelize.STRING,
            allowNull:false,
       },
    isPrime:{
        type:Sequelize.BOOLEAN,
        allowNull:false,
    },
    coin:{
        type:Sequelize.INTEGER,
    }}, 
           {
            timestamps:false
        }
    )
module.exports=User;