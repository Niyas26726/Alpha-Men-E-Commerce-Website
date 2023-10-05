const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const nocache = require('nocache')
const multer = require('multer');
const logger = require('morgan')
const path = require('path')
const userRouter = express();
const auth = require('../middleware/userAuth')
const userController = require('../controllers/userController');
const config = require('../config/config')

const storage = multer.diskStorage({
   destination: function (req, file, cb) {
     cb(null, 'public/admin-assets/imgs/people')
   },
   filename: function (req, file, cb) {
      const originalname = file.originalname;
      const extension = path.extname(originalname);
      const timestamp = Date.now();
      const uniqueFilename = `${timestamp}${extension}`;
      cb(null, uniqueFilename);
    }
 })

const upload = multer({ storage: storage })


userRouter.use(nocache());
userRouter.use(session({
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
userRouter.get('/register',auth.isLogout,userController.loadRegister);
userRouter.post('/register',auth.isLogout,userController.insertUser);



// login user
userRouter.get('/', userController.loadHome);
userRouter.get('/login',auth.ifLogout,userController.loadLogin);
userRouter.post('/login',auth.isLogout,userController.verfiyUser);
userRouter.get('/home',auth.isLogin,userController.loadHomeAfterLogin);



userRouter.get('/category',userController.filteredByCatagoryFromHome )
userRouter.get('/categoryOther',userController.filteredByCatagoryFromOther )
userRouter.get('/userAccount',auth.isLogin,userController.userAccount);
userRouter.post('/userAccount',auth.isLogin,upload.single('profileImage'),userController.updateUserAccount);



userRouter.get('/formals',userController.formals);
userRouter.get('/special',userController.special);
userRouter.get('/all',userController.all);
userRouter.get('/about',userController.about);
userRouter.get('/contact',userController.contact);
userRouter.get('/displayProduct',userController.displayProduct);



userRouter.get('/cart',userController.cart);
userRouter.get('/getCartTotals',auth.isLogin,userController.getCartTotals);
userRouter.post('/addToCart',userController.addToCart);
userRouter.post('/addToCart/:productId',auth.isLogin,userController.addToCart_forProductQuantity);
userRouter.get('/wishlist',userController.wishlist);
userRouter.post('/wishlist',userController.addtowishlist);
userRouter.post('/updateCartQuantity/:cartItemId/:newQuantity',auth.isLogin,userController.updateCartQuantity);
userRouter.post('/removeCartItem/:cartItemId',auth.isLogin,userController.removeCartItem);
userRouter.post('/clearCart',auth.isLogin,userController.clearCart);
userRouter.get('/getCartCount',auth.isLogin,userController.getCartCount);
userRouter.get('/getWishlistCount',auth.isLogin,userController.getWishlistCount);
userRouter.get('/checkOutPage',auth.isLogin,userController.checkOutPage);
userRouter.post('/processPayment',auth.isLogin,userController.processPayment);

userRouter.get('/getOrderDetails/:orderId',auth.isLogin,userController.getOrderDetails);


userRouter.get('/addNewAddress',auth.isLogin,userController.addNewAddress);
userRouter.post('/addNewAddress',auth.isLogin,userController.createNewAddress);
userRouter.get('/editAddress',auth.isLogin,userController.editAddress);
userRouter.post('/editAddress',auth.isLogin,userController.updateAddress);
userRouter.get('/updateAddressStatus',auth.isLogin,userController.updateAddressStatus);



userRouter.get('/logout',auth.isLogin,userController.userLogout);
userRouter.post('/send-otp',auth.isLogout,userController.sendOtp)
userRouter.get('/forgotpassword',auth.isLogout,userController.forgotpassword)
userRouter.post('/verifyOTP',auth.isLogout,userController.verifyOTP)
userRouter.get('/resetpassword',auth.isLogout,userController.resetpassword)
userRouter.post('/resetpassword',auth.isLogout,userController.changepassword)



// userRouter.get('*',(req,res)=>{res.render('page-404')})
// userRouter.get('*',(req,res)=>{res.redirect('/')})

module.exports = userRouter;


