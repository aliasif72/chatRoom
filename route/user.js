const express=require('express');
const router= express.Router();
const userController=require('../controller/user');
const middleware=require('../middleware/auth');


router.post('/signup',userController.signup);
router.post('/login',userController.login);
router.get('/login/getMembers',middleware.authenticate,userController.getMembers);
router.get('/login/getUsers',userController.getUsers);
router.get('/login/showUserOnly',userController.showUserOnly);
router.get('/login/sendRequest',middleware.authenticate,userController.sendRequest);
router.get('/login/getRequest',middleware.authenticate,userController.getRequest);
router.get('/login/acceptRequest',middleware.authenticate,userController.acceptRequest);

module.exports=router;