const express = require('express');
const nocache = require('nocache')
const logger = require('morgan')
const multer = require('multer');

const path = require('path')
const session = require('express-session');
const adminRouter = express();
const config = require('../config/config');
const bodyParser = require('body-parser');
const auth = require('../middleware/adminAuth');
const adminController = require('../controllers/adminController')

const storage = multer.diskStorage({
   destination: function (req, file, cb) {
     cb(null, 'public/admin/productImages') // Set the destination folder where uploaded files will be stored
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

adminRouter.set('view engine','ejs')
adminRouter.set('views','./view/admin')

adminRouter.use(bodyParser.json());
adminRouter.use(bodyParser.urlencoded({extended:true}));
adminRouter.use(nocache())
adminRouter.use(logger('dev'))//using Morgan
adminRouter.use(session({
   secret:config.sessionSecretId,    
   resave: false,
   saveUninitialized: false
}))

adminRouter.get('/',auth.isLogout,adminController.loadLogin);
adminRouter.post('/',auth.isLogout,adminController.verifyUser);

adminRouter.get('/home',auth.isLogin,adminController.loadhome);
adminRouter.get('/logout',auth.isLogin,adminController.logout);
adminRouter.get('/coupons',auth.isLogin,adminController.coupons);
adminRouter.post('/coupons',auth.isLogin,adminController.createCoupon);
adminRouter.post('/editCoupon/:id',auth.isLogin,adminController.editCoupon);
adminRouter.post('/toggleBlockStatusCoupons/:couponId',auth.isLogin,adminController.toggleBlockStatusCoupons);
adminRouter.get('/categories',auth.isLogin,adminController.categories);
adminRouter.post('/categories',auth.isLogin,adminController.addCategories);
adminRouter.post('/editCategory',auth.isLogin, adminController.editCategory);
adminRouter.post('/toggleBlockStatus/:categoryId',auth.isLogin, adminController.toggleBlockStatus);
adminRouter.post('/toggleBlockStatusUsers/:userID',auth.isLogin, adminController.toggleBlockStatusUsers);
adminRouter.post('/toggleBlockStatusProducts/:categoryId',auth.isLogin, adminController.toggleBlockStatusProducts);
adminRouter.get('/productsList',auth.isLogin,adminController.productsList);
adminRouter.get('/addProduct',auth.isLogin,adminController.addProduct);
adminRouter.post('/addProduct',auth.isLogin, upload.array('images'), adminController.publishProduct);
adminRouter.get('/editProducts',auth.isLogin, upload.array('images'),adminController.editProducts);
adminRouter.post('/editProducts/:productId',auth.isLogin, upload.array('images'), adminController.updateProduct);
adminRouter.get('/userList',auth.isLogin,adminController.userList);
adminRouter.get('/orderList',auth.isLogin,adminController.orderList);
adminRouter.get('/orders',auth.isLogin,adminController.orders);
adminRouter.get('/ordersDetail/:orderId',auth.isLogin,adminController.ordersDetail);
adminRouter.post('/updateOrderStatus',auth.isLogin,adminController.updateOrderStatus);
// 

adminRouter.post('/searchUser',auth.isLogin,adminController.searchUser);

// adminRouter.get('*',(req,res)=>{res.render('page-404')})

module.exports = adminRouter;

