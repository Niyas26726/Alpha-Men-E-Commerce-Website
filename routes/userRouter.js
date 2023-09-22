const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const nocache = require('nocache')
const logger = require('morgan')
const userRouter = express();
const auth = require('../middleware/userAuth')
const userController = require('../controllers/userController');
const config = require('../config/config')

userRouter.use(nocache());
userRouter.use(session({
   // secret:config.sessionSecretId,mysitesecretId
   secret: config.sessionSecretId,
   resave: false,
   saveUninitialized: false
})) 
userRouter.use(bodyParser.json());
userRouter.use(bodyParser.urlencoded({extended:true}));
userRouter.use(logger('dev'))
userRouter.set('view engine','ejs');
userRouter.set('views','./view/users');

// registration user
userRouter.get('/register',userController.loadRegister);
userRouter.post('/register',userController.insertUser);

// login user
userRouter.get('/', userController.loadHome);
userRouter.get('/login',auth.ifLogout,userController.loadLogin);
userRouter.post('/login',auth.isLogout,userController.verfiyUser);

userRouter.get('/home',auth.isLogin,userController.loadHomeAfterLogin);
userRouter.get('/category',userController.filteredByCatagory )

userRouter.get('/formals',userController.formals);
userRouter.get('/special',userController.special);
userRouter.get('/all',userController.all);
userRouter.get('/about',userController.about);
userRouter.get('/contact',userController.contact);
userRouter.get('/displayProduct',userController.displayProduct);
userRouter.get('/cart',userController.cart);
userRouter.get('/wishlist',userController.wishlist);
userRouter.post('/wishlist',userController.addtowishlist);
userRouter.get('/logout',auth.isLogin,userController.userLogout);
userRouter.post('/send-otp',auth.isLogout,userController.sendOtp)
userRouter.get('/forgotpassword',auth.isLogout,userController.forgotpassword)
userRouter.post('/verifyOTP',auth.isLogout,userController.verifyOTP)
userRouter.get('/resetpassword',auth.isLogout,userController.resetpassword)
userRouter.post('/resetpassword',auth.isLogout,userController.changepassword)


// userRouter.get('*',(req,res)=>{res.redirect('/')})

module.exports = userRouter;


