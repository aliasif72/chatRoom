const express = require('express');
const bodyParser = require('body-parser')
const cors = require('cors');
const path= require('path');
const sequelize = require('./util/database');
require ("dotenv").config();

const userRoutes = require('./route/user');
const msgRoutes=require('./route/msg');
const grpRoutes=require('./route/group');

const User = require('./model/user');
const Msg = require('./model/msg');
const Grp=require('./model/group');
const Request=require('./model/request');
const Usergroup=require('./model/usergroup');


const app = express();
app.use(bodyParser.json());
app.use(express.static('public'));

app.use(cors());
app.use('/user', userRoutes);
app.use('/user',grpRoutes);
app.use('/verifiedUser', msgRoutes);

app.use((req, res, next) => {
    if (req.url === '/') {
        return res.sendFile(path.join(__dirname,'public','new.html'))
    }
    res.sendFile(path.join(__dirname, `${req.url}`))
})


User.hasMany(Msg,{constraints: true , onDelete:'Cascade'});
Msg.belongsTo(User);

User.belongsToMany(Grp, { through: Usergroup });
Grp.belongsToMany(User, { through: Usergroup });
User.hasMany(Usergroup,{constraints: true , onDelete:'Cascade'})
Usergroup.belongsTo(User);
Grp.hasMany(Usergroup,{constraints: true , onDelete:'Cascade'})
Usergroup.belongsTo(Grp);
Grp.hasMany(Msg, {constraints: true , onDelete:'Cascade'});
Msg.belongsTo(Grp);

sequelize
    .sync()
    .then(app.listen(3000, () => console.log("server connected")))
    .catch(err => console.log(err));
