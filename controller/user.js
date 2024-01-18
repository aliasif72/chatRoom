const User = require('../model/user');
const Msg = require('../model/msg');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Usergroup = require('../model/usergroup');
const Request=require('../model/request');

//SIGNUP
exports.signup = async (req, res, next) => {
   const { name,number, password} = req.body;
   let {isPrime} =req.body;
   let coin=150;
   const exist = await User.findOne({ where: { number:number } })
   if (exist) {
      return res.status(403).json({ message: "User already exist!!" });
   }
   const saltRounds = 10;
   if(isPrime.toLowerCase()==="true")
   {
    isPrime=true;
    coin=1500;
   }
   else{isPrime=false};

   bcrypt.hash(password, saltRounds, (err, hash) => {
      User.create({
         name: name,
         number: number,
         password: hash,
         isPrime:isPrime,
         coin:coin
      })
         .then(result => res.status(201).json({ message: "Successfuly signed up!!"}))
         .catch(err => console.log(err));
   })
}

//function for creating token
function generateToken(id, name, number, isPrime) {
   return jwt.sign({ userId: id, name, number, isPrime }, 'asifali');
}

//LOGIN
exports.login = async (req, res, next) => {
   const { number, password } = req.body;
   await User.findAll({ where: { number: number } })
      .then(exist => {
         if (exist[0] == undefined)
         {
            return res.status(404).json({ message: "User doesn't exist" });
         }
         bcrypt.compare(password, exist[0].password, (err, result) => {
          if (result) {
         return res.status(201).json({ message: "Login success",name:exist[0].name, coin:exist[0].coin , number:exist[0].number, token: generateToken(exist[0].id, exist[0].name, exist[0].number, exist[0].isPrime) });
            }
         return res.status(401).json({ message: "User not authorized" });
         });
      })
      .catch(err => console.log(err));
}

//GET USERS OF GROUP
exports.getMembers = async (req, res, next) => {
   try
   {  const{gid} = req.query;
      const users = await Usergroup.findAll({
         where:{
         grpId : +gid,
         },
         attributes:['userId'],
         include:{
            model:User,
            attributes:['name']
         },
         raw:true,
         nest:true
         })
         let naam='';
            users.forEach(ele=>
               {
                  naam=ele.user.name;
                 delete ele.user;
                 ele.name=naam;
               })
         const isAdmin=await Usergroup.findOne({where:
         {
            userId:+req.user.id,
            grpId:+gid,
            isAdmin:true
         }})
          
         const chats=await Msg.findAll({
         where: { grpId : +gid},
         attributes:['name','message']})
                 
         return res.status(201).json({users:users,admin:isAdmin,chats:chats});
   }
    catch(err)
    {
      console.log(err);
    }
}


//SEARCH ALL USERS
exports.getUsers = async (req, res, next) => {
   try
{
         const { search } = req.query; 
         const users = await User.findAll({
         attributes:['name','number','id'],
         raw:true})
         const arr=[];
         users.forEach(ele=>
            {
              if(ele.name.toLowerCase().indexOf(search)===0)
             {
               arr.push(ele);
            }})
          res.status(201).json(arr);
            }
    catch(err)
    {
      console.log(err);
    }
}

//GET ALL USERS

exports.showUserOnly = async (req, res, next) => {
   try
   {
      const users = await User.findAll({
         attributes:['id','name'],
         
          })
         const chats=await Msg.findAll({
         where: { grpId : null },
         attributes:['name','message']})
                 
         return res.status(201).json({users:users, chats:chats});
   }
    catch(err)
    {
      console.log(err);
    }
}


// SEND REQUEST

exports.sendRequest = async (req, res, next) => {
   try
   {     const from = req.user.id;
         const { nm,id } = req.query;
         if(from!=id)
         {
         await Request.create({
          from,     
          towards : id,
          name:nm
          })
         return res.status(201).json({message:"Request Sent"});
         }
         res.status(201).json({message:"Request not Sent"});
   }
    catch(err)
    {
      console.log(err);
    }
}

// GET REQUEST
exports.getRequest = async (req, res, next) => {
   try
   {     const request = await Request.findAll({
          where:{towards:req.user.id},
          attributes:['from','name']}) 
         return res.status(201).json({request:request});
   }
    catch(err)
    {
      console.log(err);
    }
}

//ACCEPT REQUEST

exports.acceptRequest = async (req, res, next) => {
   try
   {      const id=req.user.id;
          const idd=req.query.idd;
          await Request.destroy({
          where:{towards:id,from:idd}})
         return res.status(201).json({message:"success deletion"});
   }
    catch(err)
    {
      console.log(err);
    }
}