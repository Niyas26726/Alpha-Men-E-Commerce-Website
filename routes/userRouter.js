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
userRouter.get('/category',userController.filteredByCatagoryFromHome )
userRouter.get('/categoryOther',userController.filteredByCatagoryFromOther )
// Define a route handler for /search
userRouter.get('/search', async (req, res) => {
   try {
      const { query, searchBy } = req.query;

      // Define a regex pattern for a case-insensitive search
      const regexPattern = new RegExp(query, 'i');
      let productData;

      // Perform a database query based on the selected search criteria
      if (searchBy === 'brand') {
         productData = await product.find({ brand_name: regexPattern });
      } else if (searchBy === 'category') {
         productData = await product.find({ 'categoryId.name': regexPattern });
      } else if (searchBy === 'product') {
         productData = await product.find({ product_name: regexPattern });
      }

      // Render a page with the search results
      res.render('search-results', { product: productData, query, searchBy });
   } catch (error) {
      console.error(error.message);
      // Handle errors appropriately, e.g., send an error response
      res.status(500).send('Internal Server Error');
   }
});

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


