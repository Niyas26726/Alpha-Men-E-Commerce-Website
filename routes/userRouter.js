const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const nocache = require('nocache')
const multer = require('multer');
const logger = require('morgan')
const path = require('path')
const puppeteer = require('puppeteer')
const userRouter = express();
const moment = require('moment');
const auth = require('../middleware/userAuth')
const checkCart = require('../middleware/paymentAuthentication')
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
userRouter.engine('html', require('ejs').renderFile);

userRouter.set('views','./view/users');



// registration user
userRouter.get('/register',auth.isBlocked,auth.isLogout,userController.loadRegister);
userRouter.post('/register',auth.isBlocked,auth.isLogout,userController.insertUser);



// login user
userRouter.get('/', userController.loadHome);
userRouter.get('/login',auth.isBlocked,auth.ifLogout,userController.loadLogin);
userRouter.post('/login',auth.isBlocked,auth.isLogout,userController.verfiyUser);
userRouter.get('/home',auth.isBlocked,auth.isLogin,userController.loadHomeAfterLogin);



userRouter.get('/category',auth.isBlocked,userController.filteredByCatagoryFromHome )
userRouter.get('/categoryOther',auth.isBlocked,userController.filteredByCatagoryFromOther )
userRouter.get('/userAccount',auth.isBlocked,auth.isLogin,userController.userAccount);
userRouter.post('/userAccount',auth.isBlocked,auth.isLogin,upload.single('profileImage'),userController.updateUserAccount);
// userRouter.get('/search',auth.isBlocked,userController.search)
userRouter.get('/integratedFilter',auth.isBlocked,userController.integratedFilter)




userRouter.get('/formals',auth.isBlocked,userController.formals);
userRouter.get('/special',auth.isBlocked,userController.special);
userRouter.get('/all',auth.isBlocked,userController.all);
userRouter.get('/about',auth.isBlocked,userController.about);
userRouter.get('/contact',auth.isBlocked,userController.contact);
userRouter.get('/displayProduct',userController.displayProduct);
userRouter.post('/addReview',auth.isBlocked,userController.addReview);
userRouter.get('/blocked',auth.ifBlocked, userController.blocked);



userRouter.get('/cart',auth.isBlocked,userController.cart);
userRouter.get('/getLatestData',auth.isBlocked,userController.getLatestData);
userRouter.get('/getCartTotals',auth.isBlocked,auth.isLogin,userController.getCartTotals);
userRouter.post('/addToCart',auth.isBlocked,userController.addToCart);
userRouter.post('/addToCart/:productId',auth.isBlocked,auth.isLogin,userController.addToCart_forProductQuantity);
userRouter.post('/updateCartQuantity/:cartItemId/:newQuantity',auth.isBlocked,auth.isLogin,userController.updateCartQuantity);
userRouter.post('/removeCartItem/:cartItemId',auth.isBlocked,auth.isLogin,userController.removeCartItem);
userRouter.post('/clearCart',auth.isBlocked,auth.isLogin,userController.clearCart);


userRouter.get('/wishlist',auth.isBlocked,userController.wishlist);
userRouter.post('/wishlist',auth.isBlocked,userController.addtowishlist);
userRouter.get('/getCartCount',auth.isBlocked,auth.isLogin,userController.getCartCount);
userRouter.get('/getWishlistCount',auth.isBlocked,auth.isLogin,userController.getWishlistCount);


userRouter.get('/checkOutPage',auth.isBlocked,auth.isLogin,checkCart.isEmptyCart,userController.checkOutPage);
userRouter.get('/getCouponDetails/:couponId',auth.isBlocked,auth.isLogin,checkCart.isEmptyCart,userController.getCouponDetails);
userRouter.get('/orderSuccess',auth.isBlocked,auth.isLogin,userController.orderSuccess);
userRouter.post('/processPayment',auth.isBlocked,auth.isLogin,checkCart.isEmptyCart,userController.processPayment);
userRouter.post('/processOnlinePayment',auth.isBlocked,auth.isLogin,checkCart.isEmptyCart,userController.processOnlinePayment);
userRouter.post('/verifyPayment',auth.isBlocked,auth.isLogin,checkCart.isEmptyCart,userController.verifyPayment);


userRouter.get('/getOrderDetails/:orderId',auth.isBlocked,auth.isLogin,userController.getOrderDetails);
userRouter.post('/returnOrder/:orderId',auth.isBlocked,auth.isLogin,userController.returnOrder);
userRouter.post('/cancelOrder/:orderId',auth.isBlocked,auth.isLogin,userController.cancelOrder);
userRouter.get('/showInvoice/:orderId',auth.isBlocked,auth.isLogin,userController.showInvoice);
userRouter.post('/downloadInvoice/:orderId',auth.isBlocked,auth.isLogin,userController.downloadInvoice);


userRouter.get('/addNewAddress',auth.isBlocked,auth.isLogin,userController.addNewAddress);
userRouter.post('/addNewAddress',auth.isBlocked,auth.isLogin,userController.createNewAddress);
userRouter.get('/editAddress',auth.isBlocked,auth.isLogin,userController.editAddress);
userRouter.post('/editAddress',auth.isBlocked,auth.isLogin,userController.updateAddress);
userRouter.get('/updateAddressStatus',auth.isBlocked,auth.isLogin,userController.updateAddressStatus);



userRouter.get('/logout',auth.isBlocked,auth.isLogin,userController.userLogout);
userRouter.post('/send-otp',auth.isBlocked,auth.isLogout,userController.sendOtp)
userRouter.get('/forgotpassword',auth.isBlocked,auth.isLogout,userController.forgotpassword)
userRouter.post('/verifyOTP',auth.isBlocked,auth.isLogout,userController.verifyOTP)
userRouter.get('/resetpassword',auth.isBlocked,auth.isLogout,userController.resetpassword)
userRouter.post('/resetpassword',auth.isBlocked,auth.isLogout,userController.changepassword)



// userRouter.get('*',(req,res)=>{res.render('page-404')})
// userRouter.get('*',(req,res)=>{res.redirect('/')})

module.exports = userRouter;