const User = require('../models/userModel');
const nodemailer = require('nodemailer');
const otpGenerator = require('otp-generator');
const category = require('../models/categoryModel');
const product = require('../models/productModel');
const Address = require('../models/addressModel')
const coupon = require('../models/couponModel');
const Order = require('../models/orderModel');
const Razorpay = require('razorpay');
const { ObjectId } = require('mongodb'); // Import the ObjectId constructor
const { default: puppeteer } = require('puppeteer');
const path = require('path');
const { log } = require('console');

let generatedOTP = '';
let globalEmail = '';

let instance = new Razorpay({
  key_id: process.env.Key_Id,
  key_secret: process.env.Key_Secret,
});


const loadRegister = async (req, res) => {
   try {
      const categorieData = await category.find({});
      const productData = await product.find({});

      const err = req.query.err;
      const msg = req.query.msg;
      console.log(typeof err);
      if (err == "true") {
         res.render('signup', { product: productData, categories: categorieData, isAuthenticated: false, message: '', errMessage: msg })
      } else {
         res.render('signup', { product: productData, categories: categorieData, isAuthenticated: false, message: msg, errMessage: '' })
      }
   } catch (error) {
      console.log(error.message)
   }
}

const insertUser = async (req, res) => {
   try {
      const email = req.body.email;
      const referalId = req.body.referalID;
      const checkData = await User.findOne({ email: email });
      console.log("insert User");
      console.log(email);
      console.log("Uer OTP  " + req.body.otp + " Generated OTP  " + generatedOTP);

      if (checkData) {
         res.redirect(`/register?err=${true}&msg=Email%20already%20in%20use`);
      } else {
         if (req.body.otp !== generatedOTP) {
            res.redirect(`/register?err=${true}&msg=Invalid%20OTP`);
         } else {
            const user = new User({
               first_name: req.body.firstName,
               last_name: req.body.lastName,
               email: req.body.email,
               password: req.body.password,
               mobile: req.body.mobile
            });

            if(referalId){
               const referedUser = await User.findOne({referal_ID : referalId})
               if(referedUser){
                  referedUser.wallet_Balance = (referedUser.wallet_Balance || 0) + 500;
                  user.wallet_Balance = (user.wallet_Balance || 0) + 200;
                  user.used_Referal_ID = referalId;

                  const newTransaction_referedUser = {
                     type: 'Credit',
                     amount: 500,
                     date: new Date(),
                   };

                  const newTransaction = {
                     type: 'Credit',
                     amount: 200,
                     date: new Date(),
                   };

                   function generateRandomString() {
                     const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
                     let randomString = '';
                  
                     for (let i = 0; i < 25; i++) {
                       const randomIndex = Math.floor(Math.random() * characters.length);
                       randomString += characters.charAt(randomIndex);
                     }
                  
                     return randomString;
                  }
         
                   let user_display_order_id = generateRandomString();
                   newTransaction.user_display_order_id = user_display_order_id;
                   console.log("newTransaction.user_display_order_id ===>>>   ",newTransaction.user_display_order_id);

                   user_display_order_id = generateRandomString();
                   newTransaction_referedUser.user_display_order_id = user_display_order_id;
                   console.log("newTransaction_referedUser.user_display_order_id ===>>>   ",newTransaction_referedUser.user_display_order_id);

                   referedUser.transaction.push(newTransaction_referedUser);
                   user.transaction.push(newTransaction);

                   await user.save();
                   await referedUser.save();
 
                   console.log("newTransaction_referedUser ===>>>   ",newTransaction_referedUser);
                   console.log("newTransaction ===>>>   ",newTransaction);

                   console.log("referedUser.transaction ===>>>   ",referedUser.transaction);
                   console.log("user.transaction ===>>>   ",user.transaction);
               }else{
               res.redirect(`/register?err=${true}&msg=Incorrect Referal Code`);
               }
            }
            
            const userData = await user.save();
            if (userData) {
               req.session.user_id = userData._id
               console.log(" req.session.user_id  ====>>>>  ",req.session.user_id);
               console.log(" userData._id  ====>>>>  ",userData._id);
               return res.redirect('/home');
            }
         }
      }
   } catch (error) {
      console.log(error.message)
   }
}

const loadLogin = async (req, res) => {
   try {

      const err = req.query.err;

      const productData = await product.find({});

      const categorieData = await category.find({});
      const msg = req.query.msg;

      if (err) {
         res.render('login', { product: productData, categories: categorieData, isAuthenticated: false, message: '', errMessage: msg });
      } else {
         res.render('login', { product: productData, categories: categorieData, isAuthenticated: false, message: msg, errMessage: '' });
      }
   } catch (error) {
      console.log(error.message);
   }
}

const loadHome = async (req, res) => {
   console.log("Reached loadHome");
   try {
      const categorieData = await category.find({});
      const categoryId = req.body.catagoryid;
      const sort = req.body.sort;
      const page = req.query.page || 1;
      const searchQuery = req.body.searchquery;
      const user = { wishlist: [] };
      const itemsPerPage = 9;
      const productsCount = await product.countDocuments({blocked: false}); 
      const totalPages = Math.ceil(productsCount / itemsPerPage);
      // console.log("productsCount   ===>>>  ",productsCount);
      const skipCount = (page - 1) * itemsPerPage;

      const productData = await product.find({blocked: false})
          .skip(skipCount)
          .limit(itemsPerPage)
          .populate('categoryId');
          
         //  console.log("Product data with categories: ", productData);
          productData.forEach(product => {
        });
         if (req.session.user_id) {
         const user_ID = req.session.user_id;
         const userData = await User.findById({ _id: user_ID });
         console.log("req.session.user_id is " + req.session.user_id);
         res.render('home', { user: userData, product: productData, categories: categorieData, isAuthenticated: true, categoryId: categoryId, sort: sort, page: page, searchQuery: searchQuery, page: page || '', totalPages: totalPages || '' });
      } else {
         console.log("else case req.session.user_id is " + req.session.user_id);
         res.render('home', { user, product: productData, categories: categorieData, isAuthenticated: false, categoryId: categoryId, sort: sort, page: page, searchQuery: searchQuery, page: page || '', totalPages: totalPages || '' });
      }
   } catch (error) {
      console.log(error.message)
   }
}

const addNewAddress = async (req, res) => {
   console.log("Reached addNewAddress");
   try {
      const err = req.query.err;
      const msg = req.query.msg;
      const userData = await User.findById({ _id: req.session.user_id })
      const productData = await product.find({});
      const categorieData = await category.find({});
      if (req.session.user_id) {

         if (err) {
            res.render('addNewAddress', { user: userData, product: productData, categories: categorieData, isAuthenticated: true, message: '', errMessage: msg });
         } else {
            res.render('addNewAddress', { user: userData, product: productData, categories: categorieData, isAuthenticated: true, message: msg, errMessage: '' });
         }
      }
   } catch (error) {
      console.log(error.message);
   }
}

const createNewAddress = async (req, res) => {
   console.log("Reached createNewAddress");
   try {

      console.log("Address is " + await Address.find());
      const { name, city_town_district, state, address, pincode, landmark, mobile, alt_mobile, type } = req.body;
      const userId = req.session.user_id;

      const newAddress = new Address({
         name,
         city_town_district,
         state,
         address,
         pincode,
         landmark,
         mobile,
         alt_mobile,
         userId,
         type,
         blocked: false,
      });

      await newAddress.save();

      let savedAddress = await User.findByIdAndUpdate(userId, { $push: { addresses: newAddress._id } });
      if (savedAddress) {
         res.redirect(`/userAccount?err=${""}&msg=New address added successfully`);
      } else {
         res.redirect(`/addNewAddress?err=${true}&msg=An error occured`);
      }

   } catch (error) {
      console.log(error.message);
   }
}

const editAddress = async (req, res) => {
   console.log("Reached addNewAddress");
   try {
      const addressID = req.query.addressID
      const err = req.query.err;
      const msg = req.query.msg;
      const userData = await User.findById({ _id: req.session.user_id })
      const productData = await product.find({});
      const categorieData = await category.find({});
      const addressData = await Address.findById(addressID);
      if (req.session.user_id) {

         if (err) {
            res.render('editAddress', { address: addressData, user: userData, product: productData, categories: categorieData, isAuthenticated: true, message: '', errMessage: msg });
         } else {
            res.render('editAddress', { address: addressData, user: userData, product: productData, categories: categorieData, isAuthenticated: true, message: msg, errMessage: '' });
         }
      }
   } catch (error) {
      console.log(error.message);
   }
}

const updateAddress = async (req, res) => {
   console.log("Reached updateAddress");
   const addressID = req.body.addressID;
   try {
      if (req.session.user_id) {
         const { name, address, city_town_district, state, pincode, mobile, landmark, type, alt_mobile } = req.body;

         await Address.findByIdAndUpdate({ _id: addressID }, {
            name,
            address,
            city_town_district,
            state,
            pincode,
            mobile,
            landmark,
            type,
            alt_mobile
         });

         res.redirect(`/userAccount?err=${true}&msg=Address updated successfully`);
      }
   } catch (error) {
      console.log(error.message);

      res.redirect(`/editAddress?addressID=${addressID}&err=${true}&msg=Error updating address`);
   }
};

const updateAddressStatus = async (req, res) => {
   console.log("Reached updateAddressStatus");
   try {
      const addressID = req.query.addressID;

      let isblocked = await Address.findByIdAndUpdate(addressID, { blocked: true });

      if (isblocked) {
         res.redirect(`/userAccount?err=${""}&msg=Address delsted successfully`);
      } else {
         res.redirect(`/userAccount?err=${true}&msg=An error occured while deleting the address`);
      }
   } catch (error) {
      console.error(error.message);
      res.status(500).json({ success: false, error: "Error updating address status" });
   }

};

const formals = async (req, res) => {
   console.log("Reached formals");
   try {
      const categorieData = await category.find({});
      const productData = await product.find({});
      const user = 1;
      if (req.session.user_id) {
         const user_ID = req.session.user_id
         const userData = await User.findById({ _id: user_ID })
         console.log("req.session.user_id is " + req.session.user_id);
         res.render('formals', { user: userData, product: productData, categories: categorieData, isAuthenticated: true });
      } else {
         console.log("else case req.session.user_id is " + req.session.user_id);

         res.render('formals', { user, product: productData, categories: categorieData, isAuthenticated: false });
      }
   } catch (error) {
      console.log(error.message)
   }
}

const userAccount = async (req, res) => {
   console.log("Reached userAccount");
   try {
      const user_id = req.session.user_id;
      const categorieData = await category.find({});
      const productData = await product.find({});
      const err = req.query.err;
      const msg = req.query.msg;
      const userData = await User.findOne({ _id: user_id }).populate('addresses');

      const userOrders = await Order.find({ user_id: user_id }).sort({ created_on_For_Sales_Report: -1 }); // Sort by date in ascending order (oldest first)


      console.log("userData " + userData);

      if (req.session.user_id) {
         const walletBalance = userData.wallet_Balance;
         // const transactions = userData.transaction;
         const transactions = userData.transaction.sort((a, b) => b.date - a.date);


         console.log("req.session.user_id is " , req.session.user_id);
         console.log("walletBalance is " , walletBalance);
         console.log("transactions is " , transactions);
         if (err == true) {
            return res.render('userAccount', { user: userData, product: productData, categories: categorieData, isAuthenticated: true, message: "", errMessage: msg, userOrders: userOrders, walletBalance: walletBalance, transactions: transactions});
         } else {
            console.log("else case req.session.user_id is " + req.session.user_id);

            return res.render('userAccount', { user: userData, product: productData, categories: categorieData, isAuthenticated: true, message: msg, errMessage: "", userOrders: userOrders });
         }
      }
   } catch (error) {
      console.log(error.message);
   }
}

const updateUserAccount = async (req, res) => {
   console.log("Reached updateUserAccount");
   try {
      const user_id = req.session.user_id;
      const categorieData = await category.find({});
      const productData = await product.find({});
      const userOrders = await Order.find({ user_id: user_id });
      const userData = await User.findOne({ _id: user_id });
      console.log("userData " + userData);

      const uploadedFile = req.file;
      let updatedUserData = {
         user_profile : userData.user_profile ?userData.user_profile : null,
         first_name: req.body.name,
         last_name: req.body.lName,
         display_name: req.body.dname ? req.body.dname : null,
         email: req.body.email,
         mobile: req.body.mobile,
         password: req.body.npassword ? req.body.npassword : userData.password
      };

      if (uploadedFile) {
         console.log("Uploaded profile picture filename: " + uploadedFile.filename);
         updatedUserData.user_profile = uploadedFile.filename;
      }

      if (!userData) {
         return res.status(404).render('userAccount', {
            user: false, product: productData, categories: categorieData, isAuthenticated: false, userOrders: userOrders, message: "", errMessage: "User not found"
         });
      }

      if (!req.session.user_id) {
         console.log("Session user_id is not set");
         return res.status(403).render('userAccount', {
            user: userData,
            product: productData,
            categories: categorieData,
            userOrders: userOrders,
            isAuthenticated: false,
            message: "",
            errMessage: "Unauthorized"
         });
      }

      const currentPassword = req.body.currentPassword
      const lName = req.body.lName
      console.log(req.body);
      console.log("currentPassword " + currentPassword + " userData.password " + userData.password + " lName " + lName);
      if (currentPassword !== userData.password) {
         return res.status(400).render('userAccount', {
            user: userData,
            product: productData,
            categories: categorieData,
            isAuthenticated: true,
            userOrders: userOrders,
            message: "",
            errMessage: "Current password does not match"
         });
      }

      const updatedUser = await User.findByIdAndUpdate(user_id, updatedUserData, { new: true });


      console.log("updatedUserData ");
      res.render('userAccount', {
         user: updatedUserData,
         product: productData,
         userOrders: userOrders,
         categories: categorieData,
         isAuthenticated: true,
         message: "User details updated successfully",
         errMessage: ""
      });
   } catch (error) {
      console.log(error.message);
   }
}


const special = async (req, res) => {
   console.log("Reached special");
   try {
      const categorieData = await category.find({});
      const productData = await product.find({});
      const user = 1;
      if (req.session.user_id) {
         const user_ID = req.session.user_id
         const userData = await User.findById({ _id: user_ID })
         console.log("req.session.user_id is " + req.session.user_id);
         res.render('special', { user: userData, product: productData, categories: categorieData, isAuthenticated: true });
      } else {
         console.log("else case req.session.user_id is " + req.session.user_id);

         res.render('special', { user, product: productData, categories: categorieData, isAuthenticated: false });
      }
   } catch (error) {
      console.log(error.message)
   }
}


const integratedFilter = async (req, res) => {
   try {
    console.log("Reached integratedFilter");

     const { catagoryId, sort, page, searchquery } = req.query;
     console.log("catagoryid   ===>>>  ",catagoryId);
     console.log("sort   ===>>>  ",sort);
     console.log("page   ===>>>  ",page);
     console.log("searchquery   ===>>>  ",searchquery);
      
     const filter = {};
 
     if (catagoryId) {
       filter.categoryId = catagoryId;
     }
 
     if (searchquery) {
       filter.product_name = { $regex: new RegExp(searchquery, 'i') };
     }
 
 
     console.log("filter   ===>>>  ",filter);
     const itemsPerPage = 9;
     const pageNumber = page ? parseInt(page, 9) : 1;
     const skipCount = (pageNumber - 1) * itemsPerPage;
     const user = {}
     const categorieData = await category.find({})

     

     const products = await product.find(filter)
       .sort(sort)
       .skip(skipCount)
       .limit(itemsPerPage);
       res.render('home', { user, product: products, categories: categorieData, isAuthenticated: true, catagoryid: catagoryId, sort: sort, page: page, searchquery: searchquery });
 
   } catch (error) {
     console.error(error);
     res.status(500).json({ error: 'Internal server error' });
   }
 };

 const search = async (req, res) => {
   console.log("Reached search");
   try {
      const categorieData = await category.find({});
      const user = 1;
      const searchQuery = req.query.searchQuery;
      const categoryId = req.query.categoryId;
      const sortParam = req.session.sort // Get the sorting parameter

      console.log("searchQuery is ===>>>  ", searchQuery);
      console.log("categoryId is ===>>>  ", categoryId);
      console.log("sortParam is ===>>>  ", sortParam);

      const filter = {};
      if (categoryId) {
          req.session.categoryId = categoryId;
         console.log("req.session.categoryId ===>>>  ",req.session.categoryId);
         filter.categoryId = categoryId;
      }

      if (searchQuery) {
          req.session.searchQuery = searchQuery;
         console.log("req.session.searchQuery ===>>>  ",req.session.searchQuery);
         filter.product_name = { $regex: new RegExp(searchQuery, 'i') };
      }
      let productData

      if(sortParam){
         productData = await product.find(filter).sort(sortParam)

      }else{
         productData = await product.find(filter);
      }


      if (req.session.user_id) {
         const user_ID = req.session.user_id;
         const userData = await User.findById({ _id: user_ID });
         console.log("req.session.user_id is " + req.session.user_id);
         res.render('home', { user: userData, product: productData, categories: categorieData, isAuthenticated: true });
      } else {
         console.log("else case req.session.user_id is " + req.session.user_id);
         res.render('home', { user, product: productData, categories: categorieData, isAuthenticated: false });
      }
   } catch (error) {
      console.log(error.message);
   }
}



const all = async (req, res) => {
   console.log("Reached all");
   try {
      const categorieData = await category.find({});
      const productData = await product.find({});
      const user = 1
      if (req.session.user_id) {
         const user_ID = req.session.user_id
         const userData = await User.findById({ _id: user_ID })
         console.log("req.session.user_id is " + req.session.user_id);
         res.render('all', { user: userData, product: productData, categories: categorieData, isAuthenticated: true });
      } else {
         console.log("else case req.session.user_id is " + req.session.user_id);

         res.render('all', { product: productData, categories: categorieData, isAuthenticated: false });
      }
   } catch (error) {
      console.log(error.message)
   }
}

const about = async (req, res) => {
   console.log("Reached about");
   try {
      const categorieData = await category.find({});
      const productData = await product.find({});
      const user = 1
      if (req.session.user_id) {
         const user_ID = req.session.user_id
         const userData = await User.findById({ _id: user_ID })
         console.log("req.session.user_id is " + req.session.user_id);
         res.render('about', { user: userData, product: productData, categories: categorieData, isAuthenticated: true });
      } else {
         console.log("else case req.session.user_id is " + req.session.user_id);

         res.render('about', { product: productData, categories: categorieData, isAuthenticated: false });
      }
   } catch (error) {
      console.log(error.message)
   }
}

const contact = async (req, res) => {
   console.log("Reached contact");
   try {
      const categorieData = await category.find({});
      const productData = await product.find({});
      const user = 1

      if (req.session.user_id) {
         const user_ID = req.session.user_id
         const userData = await User.findById({ _id: user_ID })
         console.log("req.session.user_id is " + req.session.user_id);
         res.render('contact', { user: userData, product: productData, categories: categorieData, isAuthenticated: true });
      } else {
         console.log("else case req.session.user_id is " + req.session.user_id);

         res.render('contact', { product: productData, categories: categorieData, isAuthenticated: false });
      }
   } catch (error) {
      console.log(error.message)
   }
}

const displayProduct = async (req, res) => {
   console.log("Reached displayProduct");
   try {
      const categorieData = await category.find({});
      const product_id = req.query.product_id;
      const productData = await product.findOne({ _id: product_id }).populate({
         path: 'reviews.userID',
         model: 'user',
         select: 'first_name last_name user_profile',

     });
     console.log("productData is ", productData);
     console.log("Number of reviews:", productData.reviews.length);
     const noOfReviews = productData.reviews.length

      const user = { wishlist: [] }

      if (!productData) {
         return res.status(404).send('Product not found');
      }

      let hasOrdered = false;

      const categoryDataForProduct = await category.findById(productData.categoryId);

      console.log("categoryDataForProduct    ====>>>>>   ",categoryDataForProduct);
      
      if (req.session.user_id) {
         const user_id = req.session.user_id;
         const hasOrderedProduct = await Order.find({
            user_id: user_id,
            'items.product_id': product_id,
            order_status: { $in: ['Delivered','Request Approved','Return Requested','Request Canceled'] }, // Exclude cancelled orders
         });
         console.log("hasOrderedProduct is ", hasOrderedProduct);
         console.log("hasOrderedProduct.length is ", hasOrderedProduct.length);
         const userData = await User.findById({ _id: user_id })
         const productInCart = userData.cart.find(item => item.product.equals(productData._id));
         const quantityInCart = productInCart ? productInCart.quantity : 0;
         console.log("req.session.user_id is " + req.session.user_id);
         if(hasOrderedProduct.length != 0){
            hasOrdered = true;
         }
         res.render('displayProduct', { user: userData, product: productData, categories: categorieData, categoryDataForProduct: categoryDataForProduct, isAuthenticated: true, quantityInCart, noOfReviews: noOfReviews, hasOrdered});
      } else {
         console.log("else case req.session.user_id is " + req.session.user_id);
         res.render('displayProduct', { user, product: productData, categories: categorieData, categoryDataForProduct: categoryDataForProduct, isAuthenticated: false, noOfReviews: noOfReviews, hasOrdered });
      }
   } catch (error) {
      console.log(error.message);
   }
}

const addReview = async (req, res) => {
   console.log("Reached addReview");
   try {
      const product_id = req.query.productId;
      const selectedcomment = req.body.comment;
      const rating = req.body.rating;
      console.log("product_id is " + product_id);
      console.log("rating is " + rating);
      console.log("selectedcomment is " + selectedcomment);
      const productData = await product.findOne({ _id: product_id });
      const user_id = req.session.user_id
      if(!user_id){
         const errMsg = `Login to add review about the product`
      return res.json({errMsg});
      }

      const usedData = await User.findById(user_id)
      console.log("usedData  ===>>>  ",usedData);
      console.log("usedData.user_profile[0]  ===>>>  ",usedData.user_profile[0]);
      if (!productData) {
         return res.status(404).send('Product not found');
      }

      const userObjectId = new ObjectId(user_id);

      const existingReview = productData.reviews.find(review => review.userID.equals(userObjectId));
            console.log("existingReview is " + existingReview);

      
      if (existingReview) {
         const errMsg = `You have already reviewed this product.`
          return res.json({errMsg});
      }


      const newReview = {
         text: selectedcomment,
         date: new Date(),      
         rating: rating,
         userID: user_id
      };
      
      productData.reviews.push(newReview);
      
      productData.save();

      console.log("productData  ===>>>  ",productData);
      // productData.reviews.forEach(review => {
      //    console.log('Text:', review.text);
      //    console.log('Rating:', review.rating);
      //  });
       
 

      return res.json(productData);
   } catch (error) {
      console.log(error.message);
      return res.send('Error adding review');
   }
}

const blocked = async (req, res) => {
   console.log("Reached blocked");
   try {
      const userId = req.session.user_id;
      const coupon_id = req.query.couponId;
      const categorieData = await category.find({});
      const productData = await product.find({});
      const userData = await User.findById(userId);
      res.render('blocked', { user: userData, product: productData, categories: categorieData, isAuthenticated: false });
   } catch (error) {
      console.log(error.message);
   }
}



const cart = async (req, res) => {
   console.log("Reached cart");
   try {
     const categorieData = await category.find({});
     const err = req.query.err;
     const msg = req.query.msg;
 
     if (req.session.user_id) {
       const user_id = req.session.user_id;
       const userData = await User.findById(user_id).populate('cart.product');
 
       let cartSubtotal = 0;
       let shippingTotal = 0;
 
       const uniqueProductIds = new Set();
 
       userData.cart.forEach(cartItem => {
         const product = cartItem.product;
         const quantity = cartItem.quantity;
 
         cartSubtotal += product.sales_price * quantity;
 
         if (!uniqueProductIds.has(product._id)) {
            uniqueProductIds.add(product._id);
           if (product.shipping_fee) {
             shippingTotal += product.shipping_fee;
           }
         }
         console.log("uniqueProductIds  ===>>>  ",uniqueProductIds);
       });
 
       console.log("req.session.user_id is " + req.session.user_id);
       res.render('cart', {
         user: userData,
         categories: categorieData,
         isAuthenticated: true,
         cartSubtotal,
         shippingTotal,
         message: err == "false" ? msg : "",
         errMessage: err == "true" ? msg : ""
       });
     } else {
       console.log("else case req.session.user_id is " + req.session.user_id);
       res.redirect(`/login?err=${true}&msg=Login to see your cart`);
     }
   } catch (error) {
     console.log(error.message);
   }
 };
 
const getLatestData = async (req, res) => {
   console.log("Reached getLatestData");
   try {
      const productId = req.query.productId
      const userId = req.session.user_id;
      console.log("productID  ====>> ",productId);
      console.log("userId  ====>> ",userId);

  const currentUser = await User.findOne({ _id: userId });

  if (!currentUser) {
    return res.json({ msg: "Login first to add product to cart" });
  }else{

  const userCart = currentUser.cart;

  const productInCart = userCart.find(item => item.product.toString() === productId);

  console.log("productInCart  ====>> ",productInCart);
  const ProductData = await product.findOne({ _id: productId });
  console.log("ProductData  ====>> ",ProductData);
  const product_Stock = ProductData.stock;

  if (productInCart) {
    const productQuantityInCart = productInCart.quantity;
    return res.json({ quantity: productQuantityInCart, stock: product_Stock });
  } else {
    return res.json({ quantity: 0, stock: product_Stock });
  }
}
  

    } catch (error) {
      console.error('Error fetching data:', error);
      res.status(500).json({ error: 'Failed to fetch latest data' });
    }
    
  }

const getCartTotals = async (req, res) => {
   console.log("Reached getCartTotals");
   try {
      const categorieData = await category.find({});

      if (req.session.user_id) {
         const user_id = req.session.user_id;
         const userData = await User.findById(user_id).populate('cart.product');

         let cartSubtotal = 0;
         let shippingTotal = 0;

         const uniqueProductIds = new Set();

         userData.cart.forEach(cartItem => {
           const product = cartItem.product;
           const quantity = cartItem.quantity;
   
           cartSubtotal += product.sales_price * quantity;
   
           if (!uniqueProductIds.has(product._id)) {
             if (product.shipping_fee) {
               shippingTotal += product.shipping_fee;
             }
             uniqueProductIds.add(product._id);
           }
         });
   
         console.log("req.session.user_id is " + req.session.user_id);

         res.json({
            user: userData,
            categories: categorieData,
            isAuthenticated: true,
            cartSubtotal,
            shippingTotal,
         });
      } else {
         console.log("else case req.session.user_id is " + req.session.user_id);
         res.redirect(`/login?err=${true}&msg=Login to see your cart`);
      }
   } catch (error) {
      console.log(error.message);
   }
}


const addToCart = async (req, res) => {
   console.log("Reached addToCart");
   const user_id = req.session.user_id;

   if (user_id) {
      const productId = req.body.productId;
      console.log("productId is " + productId);

      try {
         const user = await User.findById(user_id);
         console.log("productId is " + productId);
         console.log("user.cart is " + JSON.stringify(user.cart));

         const existingCartItem = user.cart.find(
            (item) => item.product && item.product.toString() === productId
         );

         if (existingCartItem) {
            existingCartItem.quantity += 1;
         } else {
            user.cart.push({ product: productId });
         }
         await user.save();
         res.json({ status: true });
      } catch (error) {
         console.error("Error adding product to cart:", error);
         res.json({ status: false, msg: "Something went wrong" });
      }
   } else {
      res.json({ status: false, msg: "Login first to add products to the cart" });
   }
};

const addToCart_forProductQuantity = async (req, res) => {
   console.log("Reached addToCart_forProductQuantity");
   const productId = req.params.productId;
   const selectedQuantity = req.body.quantity;

   console.log("selectedQuantity " + selectedQuantity);

   if (!req.session.user_id) {
      return res.status(401).json({ error: 'Not authenticated' });
   }

   const userId = req.session.user_id;

   try {
      const user = await User.findById(userId).populate('cart.product').exec();

      if (!user) {
         return res.status(404).json({ error: 'User not found' });
      }

      const productModel = await product.findById(productId).exec();

      if (!productModel) {
         return res.status(404).json({ error: 'Product not found' });
      }

      const cartItem = user.cart.find(item => item.product._id.equals(productModel._id));

      if (cartItem) {
         cartItem.quantity += selectedQuantity;
      } else {
         user.cart.push({ product: productModel, quantity: selectedQuantity });
      }

      await user.save();

      res.status(200).json({ message: 'Product added to cart successfully' });
   } catch (error) {
      console.error('Error adding product to cart:', error);
      res.status(500).json({ error: 'Internal server error' });
   }
};


const wishlist = async (req, res) => {
   console.log("Reached wishlist");
   try {
      const categorieData = await category.find({});
      const productData = await product.find({});
      if (req.session.user_id) {
         const user_id = req.session.user_id
         const userData = await User.findById(user_id).populate('wishlist'); // Populate the wishlist
         console.log("userData  ===>> ",userData);
         console.log("req.session.user_id is " + req.session.user_id);
         res.render('wishlist', { user: userData, product: productData, categories: categorieData, isAuthenticated: true });
      } else {
         console.log("else case req.session.user_id is " + req.session.user_id);

         res.redirect(`/login?err=${true}&msg=Login to see wishlist`);
      }
   } catch (error) {
      console.log(error.message);
   }
}

const addtowishlist = async (req, res) => {
   try {
      const user_id = req.session.user_id;
      const productId = req.body.productId;

      if (!user_id) {
         return res.json({ status: false, msg: "Login first to add/remove products from the wishlist" });
      }

      const user = await User.findById(user_id);

      if (!user) {
         return res.json({ status: false, msg: "User not found" });
      }

      const index = user.wishlist.indexOf(productId);

      if (index === -1) {
         user.wishlist.push(productId);
      } else {
         user.wishlist.splice(index, 1);
      }

      await user.save();

      res.json({ status: true });
   } catch (error) {
      console.error("Error adding/removing product to/from wishlist:", error);
      res.json({ status: false, msg: "Something went wrong" });
   }
}

const updateCartQuantity = async (req, res) => {
   console.log("Reached updateCartQuantity");
   const { cartItemId, newQuantity } = req.params;
   console.log("cartItemId, newQuantity " + cartItemId, newQuantity);

   try {
      const user_id = req.session.user_id;
      const user = await User.findById(user_id).exec();

      if (!user) {
         return res.status(404).json({ error: 'User not found' });
      }

      const cartItem = user.cart.find(item => item._id.equals(cartItemId));
      if (!cartItem) {
         return res.status(404).json({ error: 'Cart item not found' });
      }
      const productData = await product.findById(cartItem.product._id)
      console.log("productData  ===>>> ",productData);
      console.log("productData.stock  ===>>> ",productData.stock);
      cartItem.quantity = newQuantity;

      if(productData.stock+1 <= newQuantity){
      cartItem.quantity = productData.stock;
      await user.save();

      const newSubtotal = cartItem.product.sales_price * newQuantity;
      const msg = "Quantity exceeds available stock."
      return res.json({ updatedCartItem: cartItem, newSubtotal, msg: msg });

      }else{

      await user.save();

      const newSubtotal = cartItem.product.sales_price * newQuantity;

      res.json({ updatedCartItem: cartItem, newSubtotal });
      }
   } catch (error) {
      console.error('Error updating cart item quantity:', error);
      res.status(500).json({ error: 'Internal server error' });
   }
}

const removeCartItem = async (req, res) => {
   const { cartItemId } = req.params;
   console.log("Reached removeCartItem");
   console.log("cartItemId " + cartItemId);

   try {
      const user_id = req.session.user_id;
      const user = await User.findById(user_id).exec();

      if (!user) {
         return res.status(404).json({ error: 'User not found' });
      }

      const cartItemIndex = user.cart.findIndex(item => item._id.equals(cartItemId));
      if (cartItemIndex === -1) {
         return res.status(404).json({ error: 'Cart item not found' });
      }

      user.cart.splice(cartItemIndex, 1);

      await user.save();
      const numberOfItemsInCart = user.cart.length;


      console.log("numberOfItemsInCart  ===> ", numberOfItemsInCart);

      res.json({ count: numberOfItemsInCart, message: 'Cart item removed successfully' });
   } catch (error) {
      console.error('Error removing cart item:', error);
      res.status(500).json({ error: 'Internal server error' });
   }
}

const clearCart = async (req, res) => {
   console.log("Reached clearCart");

   try {
      const user_id = req.session.user_id;
      const user = await User.findById(user_id)

      if (!user) {
         return res.status(404).json({ error: 'User not found' });
      }

      user.cart = [];

      await user.save();

      res.json({ message: 'Cart cleared successfully' });
   } catch (error) {
      console.error('Error clearing the cart:', error);
      res.status(500).json({ error: 'Internal server error' });
   }
}

const getCartCount = async (req, res) => {
   console.log("Reached getCartCount");
   try {
      const user_id = req.session.user_id;
      if (user_id) {
         try {
            const user = await User.findById(user_id);
            const cartCount = user.cart.reduce((total, item) => total + 1, 0);
            res.json({ cartCount });
         } catch (error) {
            console.error("Error fetching cart count:", error);
            res.status(500).json({ error: "Internal server error" });
         }
      } else {
         res.status(401).json({ error: "Unauthorized" });
      }
   } catch (error) {
      console.log(error.message);
   }
}

const getWishlistCount = async (req, res) => {
   console.log("Reached getWishlistCount");
   try {
      const user_id = req.session.user_id;
      if (user_id) {
         const user = await User.findById(user_id);
         const wishlistCount = user.wishlist.reduce((total, item) => total + 1, 0);
         res.json({ wishlistCount });
      } else {
         res.status(401).json({ error: "Unauthorized" });
      }
   } catch (error) {
      console.error("Error fetching wishlist count:", error);
      res.status(500).json({ error: "Internal server error" });
   }
}

const loadHomeAfterLogin = async (req, res) => {
   console.log("Reached loadHomeAfterLogin");
   try {
      // const categorieData = await category.find({});
      // const productData = await product.find({})
      const user_ID = req.session.user_id
      const userData = await User.findById({ _id: user_ID })

      const categorieData = await category.find({});
      // const productData = await product.find({})
      const categoryId = req.body.catagoryid;
      const sort = req.body.sort;
      const page = req.query.page;
      const searchQuery = req.body.searchquery;
      const user = { wishlist: [] };
      const itemsPerPage = 9; // Define the number of items per page
      const productsCount = await product.countDocuments({blocked: false}); // Count all matching products
      const totalPages = Math.ceil(productsCount / itemsPerPage);
      console.log("productsCount   ===>>>  ",productsCount);
      const skipCount = (page - 1) * itemsPerPage;

      const productData = await product.find({blocked: false})
         //  .sort(sortCriteria)
          .skip(skipCount)
          .limit(itemsPerPage);



      if (req.session.user_id) {
         console.log("req.session.user_id is " + req.session.user_id);
         res.render('home', { user: userData, product: productData, categories: categorieData, isAuthenticated: true, categoryId: categoryId || '', sort: sort, page: page, searchQuery: searchQuery, page: page || '', totalPages: totalPages || ''  });
      } else {
         console.log("else case req.session.user_id is " + req.session.user_id);

         res.render('home', { user: userData, product: productData, categories: categorieData, isAuthenticated: false, categoryId: categoryId || '', sort: sort, page: page, searchQuery: searchQuery, page: page || '', totalPages: totalPages || ''  });
      }
   } catch (error) {
      console.log(error.message)
   }
}

const checkOutPage = async (req, res) => {
   console.log("Reached checkOutPage");
   try {
      const err = req.query.err
      const msg = req.query.msg

      const categorieData = await category.find({});
      const user_ID = req.session.user_id;
      const coupons = await coupon.find({valid: true})
      const userData = await User.findById(user_ID)
      .populate({
        path: 'cart.product',
        model: 'product',
        populate: {
          path: 'categoryId',
          model: 'category'
        }
      })
      .populate('addresses');
    
         let largestShippingFee = -1;
         let final_Discount = 0;
         let discount = 0;
         if (userData) {
            const userCart = userData.cart;
            
            userCart.forEach(cartItem => {
              const product = cartItem.product;
              const shippingFee = product.shipping_fee;
          
              console.log("Product Name:", product.product_name);
              console.log("Product Description:", product.description);
              console.log("Product Sales Price:", product.sales_price);
              console.log("Product Shipping Fee:", shippingFee);
          
              if (shippingFee > largestShippingFee) {
                largestShippingFee = shippingFee;
              }
            });

            userCart.forEach(cartItem => {
               const product = cartItem.product;
              const quantity = cartItem.quantity;
              console.log("Product:", product);
               console.log("Outside if.");
           
               if (product.categoryId && product.categoryId.offer_Persentage > 0) {
                  const currentDate = new Date();
                  const categoryExpiryDate = new Date(product.categoryId.expiry_Date);
                  // console.log("Inside if.");
                  // console.log("product.categoryId.offer_Persentage:", product.categoryId.offer_Persentage); // Logging category name if categoryId exists
                  // console.log("product.categoryId.maximum_Discount:", product.categoryId.maximum_Discount); // Logging category name if categoryId exists
                  // console.log("product.categoryId.expiry_Date:", product.categoryId.expiry_Date); // Logging category name if categoryId exists
                  // console.log("((product.categoryId.offer_Persentage)/100):", ((product.categoryId.offer_Persentage)/100)); // Logging category name if categoryId exists
                  // console.log("((product.sales_price )*(product.categoryId.offer_Persentage)/100):", (product.sales_price )*((product.categoryId.offer_Persentage)/100)); // Logging category name if categoryId exists
                  // console.log("currentDate:", currentDate); // Logging category name if categoryId exists
                  // console.log("categoryExpiryDate:", categoryExpiryDate); // Logging category name if categoryId exists
                  // console.log("product.sales_price:", product.sales_price); // Logging category name if categoryId exists
                  // console.log("quantity:", quantity); // Logging category name if categoryId exists
                  // console.log("product.sales_price * quantity:", product.sales_price * quantity); // Logging category name if categoryId exists
          
                  // Check if the category is valid and the current date is not after the expiry date
                  if (product.sales_price * quantity >= product.categoryId.minimum_Amount &&
                      currentDate < categoryExpiryDate) {
                        discount = Math.min(
                          ((product.sales_price * quantity) * (product.categoryId.offer_Persentage / 100)),
                          product.categoryId.maximum_Discount
                      );
                      discount = Number(discount.toFixed(2)); // Limit to two decimal places

                      console.log("Inside if if.");
          
                      console.log(`Discount applied for product ${product.product_name} : ${discount}`);
                      console.log(`((product.sales_price * quantity) * (product.categoryId.offer_Persentage / 100))` , ((product.sales_price * quantity) * (product.categoryId.offer_Persentage / 100)));
                  }
              }
          

               if (product.categoryId) {
                  // console.log("Category Name:", product.categoryId); // Logging category name if categoryId exists
                   console.log("Category Name:", product.categoryId.name); // Logging category name if categoryId exists
                   console.log("Category Maximum Discount:", product.categoryId.maximum_Discount);
               } else {
                   console.log("Category not found for the product.");
               }
               console.log("final_Discount:", final_Discount);
               final_Discount += discount
               console.log("final_Discount:", final_Discount);
            console.log("discount:", discount);

            });           

            console.log("Largest Shipping Fee:", largestShippingFee);
            console.log("final_Discount:", final_Discount);
          }
         // console.log("coupons ===> ", coupons);

      if (req.session.user_id) {
         if(err){
         return res.render('checkOutPage', { user: userData, final_Discount: final_Discount, categories: categorieData, coupons, isAuthenticated: true, msg: msg, largestShippingFee: largestShippingFee});
         }else{
         console.log("req.session.user_id is " + req.session.user_id);
         return res.render('checkOutPage', { user: userData, final_Discount: final_Discount, categories: categorieData, coupons, isAuthenticated: true,msg:"", largestShippingFee: largestShippingFee});
         }
      } else {
         console.log("else case req.session.user_id is " + req.session.user_id);
         return res.render('checkOutPage', { user: userData, final_Discount: final_Discount, categories: categorieData, coupons, isAuthenticated: false });
      }
   } catch (error) {
      console.log(error.message)
   }
}

const orderSuccess = async (req, res) => {
   console.log("Reached checkOutPage");
   try {
      const categorieData = await category.find({});
      const user_ID = req.session.user_id;
      const coupons = await coupon.find({})
      const userData = await User.findById(user_ID)

      if (req.session.user_id) {
         console.log("req.session.user_id is " + req.session.user_id);
         res.render('orderPlacedPage', { user: userData, categories: categorieData, coupons, isAuthenticated: true });
      } else {
         console.log("else case req.session.user_id is " + req.session.user_id);
         res.render('orderPlacedPage', { user: userData, categories: categorieData, coupons, isAuthenticated: false });
      }
   } catch (error) {
      console.log(error.message)
   }
}

const getCouponDetails = async (req, res) => {
   console.log("Reached getCouponDetails");
   try {
      const userId = req.session.user_id;
      const couponId = req.params.couponId;
      const coupons = await coupon.findById(couponId);
      const user = await User.findById(userId);
      let cartTotal = 0;

      for (const cartItem of user.cart) {
         const products = await product.findById(cartItem.product);

         if (products) {
            const itemPrice = products.sales_price + products.shipping_fee || products.regular_price + products.shipping_fee;

            cartTotal += itemPrice * cartItem.quantity;
         }
      }

      console.log("cartTotal  ===>>>  ",cartTotal);

      const userCoupon = user.coupons.find((coupon) => coupon.coupon_id.equals(couponId));
      const currentDate = new Date();
      const couponExpiryDateParts = coupons.expiry_Date.split('-');
      const year = parseInt(couponExpiryDateParts[2]);
      const month = parseInt(couponExpiryDateParts[1]-1); // Months are zero-based (0-11)
      const day = parseInt(couponExpiryDateParts[0])+1;
      
      const couponExpiryDate = new Date(year, month, day);
      
      console.log("Parsed couponExpiryDate is:", couponExpiryDate);
      console.log("coupons is   ====>>>   " , coupons);
      console.log("currentDate is   ====>>>   " , currentDate);
      console.log("couponExpiryDate is   ====>>>   " , couponExpiryDate);

      
      if (cartTotal < coupons.minimum_Amount) {
         console.log("Your grand total dont meet the minimum amount required to use this coupon. ");
         let message = "Your grand total dont meet the minimum amount required to use this coupon."
         return res.json({ message });
      }else if(currentDate > couponExpiryDate){
         console.log("coupons is   ====>>>   " , coupons);
         console.log("currentDate is   ====>>>   " , currentDate);
         console.log("couponExpiryDate is   ====>>>   " , couponExpiryDate);
         console.log("This coupon has expired");
         let message = "This coupon has expired"
         return res.json({ message });
      }else if (userCoupon) {
         const { no_of_times_used } = userCoupon;
         const { limit } = coupons;

         if (no_of_times_used == limit || no_of_times_used >= limit) {
            console.log("You have reached the limit of this coupon");
            let message = "You have reached the limit of this coupon."
            return res.json({ message });
         }
      }

      await user.save();

      res.json(coupons);
   } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error.' });
   }
}



// const getOrderDetails = async (req, res) => {
//    console.log("Reached getOrderDetails");

//    const orderId = req.params.orderId;

//    try {
//       const orderDetails = await Order.findById(orderId)
//          .populate([
//             {
//                path: 'user_id',
//                model: 'user',
//                select: 'first_name last_name email mobile',
//             },
//             {
//                path: 'items.product_id',
//                model: 'product',
//             },
//             {
//                path: 'address',
//                model: 'address',
//             }
//          ]);

//       if (!orderDetails) {
//          return res.status(404).send('Order not found');
//       }
//       const quantityTotal = orderDetails.items.reduce((total, item) => total + item.quantity, 0);
//       const shippingFeeTotal = orderDetails.items.reduce((total, item) => total + (item.product_id.shipping_fee || 0), 0);
//       const salesPriceTotal = orderDetails.items.reduce((total, item) => total + (item.sales_price * item.quantity), 0);
//       const grandTotal = (shippingFeeTotal || 0) + salesPriceTotal;


//       console.log("orderDetails ===> ", orderDetails);


   //    const orderHtml = `
   //       <div style="display: flex; flex-direction: row;">
   //       <div style="flex: 1; margin-right: 20px;">
   //          <h3 class="p-30 m-0">
   //             Order Status: 
   //          </h3>
   //          <span id="order_status" style="margin-left:30px;" class="m-50 ${orderDetails.order_status === 'Placed'
   //          ? 'alert alert-success'
   //          : orderDetails.order_status === 'Canceled'
   //             ? 'alert alert-danger'
   //             : orderDetails.order_status === 'Return Requested'
   //                ? 'alert alert-info'
   //                : orderDetails.order_status === 'Request Canceled'
   //                   ? 'alert alert-danger'
   //                   : 'alert alert-success'
   //       }">
   //             ${orderDetails.order_status || 'N/A'}
   //          </span>
   //          <div>
   //             ${orderDetails.order_status === 'Placed'
   //          ? `<button id="cancel_button" style="margin: 30px; background-color: #F30000; display: block;" class="btn btn-success m-50" onclick="cancelOrder('${orderDetails._id}')">Cancel Order</button>`
   //          : orderDetails.order_status === 'Delivered'
   //             ? `
   //                      <button id="return_button"
   //                      style="margin: 30px; background-color: #0dcaf0; display: block;"
   //                      class="btn btn-info m-50"
   //                      onclick="returnOrder('${orderDetails._id}')"
   //                      >
   //                      Return Order
   //                      </button>

   //                      <button id="invoice_button" style="margin:30px; background-color: #00B517; display: block;" class="btn btn-info m-50" onclick="showInvoice('${orderDetails._id}')">View Invoice</button>`
   //             : ''
   //       }
   //          </div>
   //       </div>
   //       <div style="flex: 1;">
   //          <h2 class="p-30">Order details:</h2>
   //          <p>Order ID: ${orderDetails._id}</p>
   //          <p>Created On: ${orderDetails.created_on || 'N/A'}</p>
   //          <p>Expected Delivery On: ${orderDetails.expected_delivery_on || 'N/A'}</p>
   //          <p>Shipping Charge: ${orderDetails.shipping_charge || 'N/A'}</p>
   //          <p>Total Amount: ${orderDetails.total_amount || 'N/A'}</p>
   //       </div>
   //    </div>
      
      
   //       <h2 class="text-center p-30">User Addresses:</h2>
   //       <div style="display: flex; flex-wrap: wrap;"> <!-- Use flex-wrap to wrap address items -->
   //          ${orderDetails.address.map((address, index) => `
   //                <div style="flex: 1; margin-right: 20px;"> <!-- Use flex and margin for equal spacing -->
   //                   <p>${address.type}</p>
   //                   <p>Name: ${address.name}</p>
   //                   <p>City/Town/District: ${address.city_town_district}</p>
   //                   <p>State: ${address.state}</p>
   //                   <p>Address: ${address.address}</p>
   //                   <p>Pincode: ${address.pincode}</p>
   //                   <p>Landmark: ${address.landmark}</p>
   //                   <p>Mobile: ${address.mobile}</p>
   //                   <p>Alt Mobile: ${address.alt_mobile}</p>
   //                </div>
   //          `).join('')}
   //       </div>
      
   //       <h2 class="text-center p-30">Order Items:</h2>
   //       <style>                            
   //       .product-image img {
   //          max-width: 100px;
   //          max-height: 100px;
   //          width: auto;
   //          height: auto;
   //          display: block;
   //          margin: 0 auto;
   //       }
   //    </style>                            
   //    <table>
   //       <thead>
   //          <tr>
   //                <th>Product</th>
   //                <th>Quantity</th>
   //                <th>Shipping Fee</th>
   //                <th>Sales Price</th>
   //          </tr>
   //       </thead>
   //       <tbody>
   //          ${orderDetails.items.map((item, index) => `
   //                <tr>
   //                   <td>
   //                      <div style="display: flex; align-items: center;">
   //                            <div style="flex: 0 0 100px;"> <!-- Fixed width for the image -->
   //                               <p class="product-image"><img src="/admin/productImages/${item.product_id.images[0]}" alt="Product Image" width="100" height="100"></p>
   //                            </div>
   //                            <div style="flex: 1;"> <!-- Flexible width for the product details -->
   //                               <pclass="product-image"><strong>Item ${index + 1}:</strong></p>
   //                               <p>Product Name: ${item.product_id.product_name}</p>
   //                            </div>
   //                      </div>
   //                   </td>
   //                   <td class="text-center">${item.quantity}</td>
   //                   <td class="text-center">${item.product_id.shipping_fee || 'N/A'}</td>
   //                   <td class="text-center">${item.sales_price}</td>
   //                </tr>
   //          `).join('')}
   //       </tbody>
   //       <tfoot>
   //          <tr>
   //                <td><strong>Total</strong></td>
   //                <td class="text-center" id="quantity-total">${quantityTotal}</td>
   //                <td class="text-center" id="shipping-fee-total">${shippingFeeTotal}</td>
   //                <td class="text-center" id="sales-price-total">${salesPriceTotal}</td>
   //          </tr>
   //       </tfoot>
   //    </table>
   //    <div>
   //    <strong>Grand Total:</strong>
   //    <span id="grand-total" class="float-right"><strong>${grandTotal}</strong></span>
   // </div>
   // `;

//       if (req.session.user_id) {
//          res.send(orderHtml);
//       }
//       else {
//          res.redirect('/')
//       }
//    } catch (error) {
//       console.error('Error fetching order details:', error);
//       res.status(500).send('Error fetching order details');
//    }
// }

const getOrderDetails = async (req, res) => {
   console.log("Reached getOrderDetails");

   const orderId = req.params.orderId;

   try {
      const orderDetails = await Order.findById(orderId)
         .populate([
            {
               path: 'user_id',
               model: 'user',
               select: 'first_name last_name email mobile',
            },
            {
               path: 'items.product_id',
               model: 'product',
            },
            {
               path: 'address',
               model: 'address',
            }
         ]);

      if (!orderDetails) {
         return res.status(404).send('Order not found');
      }
      const quantityTotal = orderDetails.items.reduce((total, item) => total + item.quantity, 0);
      const shippingFeeTotal = orderDetails.items.reduce((total, item) => total + (item.product_id.shipping_fee || 0), 0);
      const salesPriceTotal = orderDetails.items.reduce((total, item) => total + (item.sales_price * item.quantity), 0);
      const grandTotal = (shippingFeeTotal || 0) + salesPriceTotal;

      function isReturnAllowed(expectedDeliveryDate) {

         const fiveDaysInMillis = function () {
            const now = new Date();
            const day = now.getDate() + 1;
            const month = (now.getMonth() + 1).toString().padStart(2, '0');
            const year = now.getFullYear().toString();
            return `${day}-${month}-${year}`;
          }; 
          
         const currentMillis = function () {
            const now = new Date();
            const day = now.getDate();
            const month = (now.getMonth() + 1).toString().padStart(2, '0');
            const year = now.getFullYear().toString();
            return `${day}-${month}-${year}`;
          };

         console.log("fiveDaysInMillis    ====>>>>  ",fiveDaysInMillis());
         console.log("currentMillis    ====>>>>  ",currentMillis());
         return currentMillis() <= expectedDeliveryDate + fiveDaysInMillis();
      }
      const expectedDeliveryMillis = orderDetails.delivered_on
      console.log("expectedDeliveryMillis  ===>>>  ",expectedDeliveryMillis);
      const isReturnButtonEnabled = orderDetails.order_status === 'Delivered' && isReturnAllowed(expectedDeliveryMillis);
      console.log("isReturnButtonEnabled    ====>>>>  ",isReturnButtonEnabled);

      console.log("orderDetails ===> ", orderDetails);

      const orderHtml = `
         <div style="display: flex; flex-direction: row;">
         <div style="flex: 1; margin-right: 20px;">
            <h3 class="p-30 m-0">
               Order Status: 
            </h3>
            <span id="order_status" style="margin-left:30px;" class="m-50 ${orderDetails.order_status === 'Placed'
            ? 'alert alert-success'
            : orderDetails.order_status === 'Canceled'
               ? 'alert alert-danger'
               : orderDetails.order_status === 'Return Requested'
                  ? 'alert alert-info'
                  : orderDetails.order_status === 'Request Canceled'
                     ? 'alert alert-danger'
                     : 'alert alert-success'
         }">
               ${orderDetails.order_status || 'N/A'}
               </span>
               <div>
               ${orderDetails.order_status === 'Placed'
                  ? `<button id="cancel_button" style="margin: 30px; background-color: #F30000; display: block;" class="btn btn-success m-50" onclick="cancelOrder('${orderDetails._id}')">Cancel Order</button>`
                  : orderDetails.order_status === 'Delivered'
                     ? `
                        ${isReturnButtonEnabled
                           ? `<button id="return_button" style="margin: 30px; background-color: #0dcaf0; display: block;" class="btn btn-info m-50" onclick="returnOrder('${orderDetails._id}')">Return Order</button>`
                           : `<p style="color: red; margin: 30px;">Return time has expired</p>`
                        }
                        <button id="invoice_button" style="margin:30px; background-color: #00B517; display: block;" class="btn btn-info m-50" onclick="showInvoice('${orderDetails._id}')">View Invoice</button>`
                     : ''
               }
            </div>
                        </div>
            <div style="flex: 1;">
            <h2 class="p-30">Order details:</h2>
            <p>Order ID: ${orderDetails.user_display_order_id ? orderDetails.user_display_order_id : orderDetails._id}</p>
            <p>Created On: ${orderDetails.created_on || 'N/A'}</p>
            <p>Expected Delivery On: ${orderDetails.expected_delivery_on || 'N/A'}</p>
            <p>Shipping Charge: $${orderDetails.shipping_charge || 'N/A'}</p>
            <p>Total Amount: $${orderDetails.total_amount || 'N/A'}</p>
            <p>Coupon Discount: $${orderDetails.discount || 0}</p>
            <p>Catagory Discount: $${orderDetails.catagory_Discount || 0}</p>
            <p>Final Amount: $${(((orderDetails.total_amount + orderDetails.shipping_charge) - orderDetails.discount) - orderDetails.catagory_Discount ) || (orderDetails.total_amount + orderDetails.shipping_charge)}</p>
         </div>
      </div>
      
      
         <h2 class="text-center p-30">User Addresses:</h2>
         <div style="display: flex; flex-wrap: wrap;"> <!-- Use flex-wrap to wrap address items -->
            ${orderDetails.address.map((address, index) => `
                  <div style="flex: 1; margin-right: 20px;"> <!-- Use flex and margin for equal spacing -->
                     <p>${address.type}</p>
                     <p>Name: ${address.name}</p>
                     <p>City/Town/District: ${address.city_town_district}</p>
                     <p>State: ${address.state}</p>
                     <p>Address: ${address.address}</p>
                     <p>Pincode: ${address.pincode}</p>
                     <p>Landmark: ${address.landmark}</p>
                     <p>Mobile: ${address.mobile}</p>
                     <p>Alt Mobile: ${address.alt_mobile}</p>
                  </div>
            `).join('')}
         </div>
      
         <h2 class="text-center p-30">Order Items:</h2>
         <style>                            
         .product-image img {
            max-width: 100px;
            max-height: 100px;
            width: auto;
            height: auto;
            display: block;
            margin: 0 auto;
         }
      </style>                            
      <table>
         <thead>
            <tr>
                  <th>Product</th>
                  <th>Quantity</th>
                  <th>Shipping Fee</th>
                  <th>Sales Price</th>
            </tr>
         </thead>
         <tbody>
            ${orderDetails.items.map((item, index) => `
                  <tr>
                     <td>
                        <div style="display: flex; align-items: center;">
                              <div style="flex: 0 0 100px;"> <!-- Fixed width for the image -->
                                 <p class="product-image"><img src="/admin/productImages/${item.product_id.images[0]}" alt="Product Image" width="100" height="100"></p>
                              </div>
                              <div style="flex: 1;"> <!-- Flexible width for the product details -->
                                 <pclass="product-image"><strong>Item ${index + 1}:</strong></p>
                                 <p>Product Name: ${item.product_id.product_name}</p>
                              </div>
                        </div>
                     </td>
                     <td class="text-center">${item.quantity}</td>
                     <td class="text-center">$${item.product_id.shipping_fee || 'N/A'}</td>
                     <td class="text-center">$${item.sales_price}</td>
                  </tr>
            `).join('')}
         </tbody>
         <tfoot>
            <tr>
                  <td><strong>Total</strong></td>
                  <td class="text-center" id="quantity-total">${quantityTotal}</td>
                  <td class="text-center" id="shipping-fee-total">$${shippingFeeTotal}</td>
                  <td class="text-center" id="sales-price-total">$${salesPriceTotal}</td>
            </tr>
         </tfoot>
      </table>
      <div>
      <strong>Grand Total:</strong>
      <span id="grand-total" class="float-right"><strong>$${grandTotal}</strong></span>
      <p class="text-end"><strong>Final Amount: $${(((orderDetails.total_amount + orderDetails.shipping_charge) - orderDetails.discount) - orderDetails.catagory_Discount ) || (orderDetails.total_amount + orderDetails.shipping_charge)}</strong></p>

   </div>
   `;

      if (req.session.user_id) {
         res.send(orderHtml);
      }
      else {
         res.redirect('/')
      }
   } catch (error) {
      console.error('Error fetching order details:', error);
      res.status(500).send('Error fetching order details');
   }
}


const processPayment = async (req, res) => {
   console.log("data is",req.body); 
   try {
      let errMsg = false;
      const userId = req.session.user_id;
      const coupon_id = req.query.couponId;
      const categorieData = await category.find({});
      const productData = await product.find({});
      const userData = await User.findById({ _id: userId });
      let couponData
      if (coupon_id) {

         couponData = await coupon.findById({ _id: coupon_id });
      }

      const selectedBillingAddress = req.body.selectedBillingAddress;
      const selectedShippingAddress = req.body.selectedShippingAddress;
      const paymentOption = req.body.paymentOption;
      const largestShippingFee = req.body.largestShippingFee ? req.body.largestShippingFee : 0;
      const final_Discount = req.body.final_Discount ? req.body.final_Discount : 0;

      console.log("final_Discount " , final_Discount);
      console.log("largestShippingFee " , largestShippingFee);
      console.log("selectedBillingAddress " + selectedBillingAddress);
      console.log("selectedShippingAddress " + selectedShippingAddress);
      console.log("paymentOption " + paymentOption);
      console.log("coupon_id " + coupon_id);
      console.log("couponData " + couponData);

      const items = [];

      User.findById(userId)
         .populate(['cart.product', "addresses"])
         .exec()
         .then(user => {
            if (!user) {
               throw new Error('User not found');
            }

            const billingAddress = user.addresses.find(address => address._id.equals(selectedBillingAddress));
            const shippingAddress = user.addresses.find(address => address._id.equals(selectedShippingAddress));

            console.log("billingAddress " + billingAddress);
            console.log("shippingAddress " + shippingAddress);

            items.push(
               ...user.cart.map(cartItem => ({
                  product_id: cartItem.product._id,
                  quantity: cartItem.quantity,
                  sales_price: cartItem.product.sales_price,
                  product_quantity: cartItem.product.stock || 0,
               }))
            );


            const shippingFee = 1*largestShippingFee;
            console.log("shippingFee " + shippingFee);
            let totalAmount = items.reduce((total, item) => {
               return total + item.quantity * item.sales_price;
            }, 0);
            let finalAmount = totalAmount + shippingFee;
            console.log("finalAmount before redusing discount  ===>>>  ",finalAmount);
            finalAmount = (totalAmount + shippingFee) - final_Discount;
            console.log("finalAmount after redusing discount  ===>>>  ",finalAmount);
            console.log("shippingFee  ===>>>  ",shippingFee);
            console.log("final_Discount  ===>>>  ",final_Discount);

            if (couponData) {
               const currentDate = new Date();
               const couponExpiryDate = new Date(couponData.expiry_Date);

               console.log("currentDate   ===>>>  ",currentDate);
               console.log("couponExpiryDate   ===>>>  ",couponExpiryDate);
               console.log("couponData   ===>>>  ",couponData);
             
               if (couponData.minimum_Amount <= totalAmount) {
                 const discountPercentage = couponData.discount_Percentage / 100;
                 const maxDiscount = couponData.maximum_Discount;
                 
                 let discountAmount = finalAmount * discountPercentage;
                 console.log("discountAmount in if couponData ===>>>  ",discountAmount);
                 console.log("req.session.discountAmount in if couponData ===>>>  ",req.session.discountAmount);

                 if (discountAmount > maxDiscount) {
                   discountAmount = maxDiscount;
                 }
                 req.session.discountAmount = discountAmount;
                 
                 finalAmount -= discountAmount;
                 console.log("finalAmount in if couponData ===>>>  ",finalAmount);
                 console.log("totalAmount in if couponData ===>>>  ",totalAmount);
                 console.log("discountAmount in if couponData ===>>>  ",discountAmount);
     
               }
               console.log("finalAmount in if couponData ===>>>  ",finalAmount);
               console.log("totalAmount in if couponData ===>>>  ",totalAmount);
               console.log("discountAmount in if couponData ===>>>  ",req.session.discountAmount);

             }
             console.log("finalAmount outside if couponData ===>>>  ",finalAmount);
             console.log("totalAmount outside if couponData ===>>>  ",totalAmount);
             console.log("req.session.discountAmount outside if couponData ===>>>  ",req.session.discountAmount);
 
 
             console.log("couponData   ===>>>  ",couponData);


            const orderData = {
               items,
               discount : req.session.discountAmount ? req.session.discountAmount : 0,
               catagory_Discount : final_Discount ? final_Discount : 0,
               shipping_charge: shippingFee,
               total_amount: finalAmount,
               user_id: userId,
               payment_method: paymentOption == "Online Payment" || paymentOption == "Cash On Delivery" || paymentOption == "Wallet Payment" ? paymentOption : "",
               payment_status: paymentOption == "Cash On Delivery" || paymentOption == "Wallet Payment" ? "Paid" : "Pending",
               address: [billingAddress, shippingAddress],
            };
            console.log("orderData   ====>>>  ", orderData);

            req.session.discountAmount = null;
            function generateRandomString() {
               const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
               let randomString = '';
            
               for (let i = 0; i < 25; i++) {
                 const randomIndex = Math.floor(Math.random() * characters.length);
                 randomString += characters.charAt(randomIndex);
               }
            
               return randomString;
            }
            
            const user_display_order_id = generateRandomString();
            orderData.user_display_order_id = user_display_order_id;
            
            console.log("user_display_order_id   ====>>>  ", user_display_order_id);
                        
            if (coupon_id !== null) {
               console.log("Coupon present");
               req.session.coupon_id = coupon_id
               console.log("coupon_id ===> ", coupon_id);
               console.log("req.session.coupon_id  ===> ", req.session.coupon_id );
               orderData.coupon_id = coupon_id;
            }

            const newOrder = new Order(orderData);
            // console.log('Order saved successfully:', saved);
            console.log('Order newOrder successfully:', newOrder);

            if (paymentOption == "Wallet Payment") {
               if (userData.wallet_Balance >= newOrder.total_amount) {
                  userData.wallet_Balance -= newOrder.total_amount;
            
                  const newTransaction = {
                     type: 'Debit',
                     amount: newOrder.total_amount,
                     date: new Date(),
                  };

                  function generateRandomString() {
                     const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
                     let randomString = '';
                  
                     for (let i = 0; i < 25; i++) {
                       const randomIndex = Math.floor(Math.random() * characters.length);
                       randomString += characters.charAt(randomIndex);
                     }
                  
                     return randomString;
                  }
         
                   const user_display_order_id = generateRandomString();
                   newTransaction.user_display_order_id = user_display_order_id;
         
            
                  userData.transaction.push(newTransaction);
            
               } else {
                  newOrder.payment_status = "Pending"
                  newOrder.order_status = "Failed"
                  errMsg = true;
                  console.error('Insufficient wallet balance');
               return res.redirect(`/checkOutPage?err=${true}&msg=Insufficient wallet balance`);

               }
            }
            const saved = newOrder.save();

            
         })
         .then(async savedOrder => {
            if(errMsg == false){

            console.log('Order saved successfully:', savedOrder);

            for (const item of items) {
               console.log("items ==>  ", items);
               const Product = await product.findById(item.product_id);
               if (!Product) {
                  console.error(`Product with ID ${item.product_id} not found.`);
                  continue;
               }
               console.log("Product ==> ", Product);
               console.log("Product.stock ==> ", Product.stock);
               console.log("item.quantity ==> ", item.quantity);
               Product.stock -= item.quantity;
               console.log("Product.quantity ==> ", Product.stock);

               await Product.save();
               console.log("await Product.save(); ==> ", await Product.save());
            }

            let userCoupon

            if (couponData) {
               userCoupon = userData.coupons.find((userCoupon) => userCoupon.coupon_id.equals(couponData._id));
               if (userCoupon) {
                  userCoupon.no_of_times_used++;
               } else {
                  userData.coupons.push({
                     coupon_id: couponData._id,
                     no_of_times_used: 1,
                  });
               }
            }
            await userData.save();
               const updatedUser = await User.findByIdAndUpdate(userId, { cart: [] }, { new: true });
               return res.redirect('/orderSuccess');
            }
         })
         .catch(error => {
            console.error('Error saving order:', error);
         });
   } catch (error) {
      console.log(error.message);
   }
}

const processOnlinePayment = async (req, res) => {
   console.log("Reached processOnlinePayment");
   try {
      const userId = req.session.user_id;
      const coupon_id = req.query.couponId;
      const categorieData = await category.find({});
      const productData = await product.find({});
      const userData = await User.findById({ _id: userId });
      let couponData
      if (coupon_id) {

         couponData = await coupon.findById({ _id: coupon_id });
      }

      const selectedBillingAddress = req.body.selectedBillingAddress;
      const selectedShippingAddress = req.body.selectedShippingAddress;
      const paymentOption = req.body.paymentOption;
      const largestShippingFee = req.body.largestShippingFee;
      const final_Discount = req.body.final_Discount ? req.body.final_Discount : 0;

      console.log("final_Discount " , final_Discount);
      console.log("largestShippingFee " , largestShippingFee);
      console.log("selectedBillingAddress " , selectedBillingAddress);
      console.log("selectedShippingAddress " , selectedShippingAddress);
      console.log("paymentOption " , paymentOption);
      console.log("coupon_id " , coupon_id);
      console.log("couponData " , couponData);

      const items = [];

      User.findById(userId)
         .populate(['cart.product', "addresses"])
         .exec()
         .then(user => {
            if (!user) {
               throw new Error('User not found');
            }

            const billingAddress = user.addresses.find(address => address._id.equals(selectedBillingAddress));
            const shippingAddress = user.addresses.find(address => address._id.equals(selectedShippingAddress));

            console.log("billingAddress " + billingAddress);
            console.log("shippingAddress " + shippingAddress);

            items.push(
               ...user.cart.map(cartItem => ({
                  product_id: cartItem.product._id,
                  quantity: cartItem.quantity,
                  sales_price: cartItem.product.sales_price,
                  product_quantity: cartItem.product.stock || 0,
               }))
            );


            const shippingFee = 1*largestShippingFee;
            console.log("shippingFee " + shippingFee);
            let totalAmount = items.reduce((total, item) => {
               return total + item.quantity * item.sales_price;
            }, 0);
            let finalAmount = totalAmount + shippingFee;
            console.log("finalAmount  ===>>>  ",finalAmount);


            if (couponData) {
               const currentDate = new Date();
               const couponExpiryDate = new Date(couponData.expiry_Date);

               console.log("currentDate   ===>>>  ",currentDate);
               console.log("couponExpiryDate   ===>>>  ",couponExpiryDate);
               console.log("couponData   ===>>>  ",couponData);
             
               if (couponData.minimum_Amount <= totalAmount) {
                 const discountPercentage = couponData.discount_Percentage / 100;
                 const maxDiscount = couponData.maximum_Discount;
                 
                 let discountAmount = finalAmount * discountPercentage;
                 if (discountAmount > maxDiscount) {
                   discountAmount = maxDiscount;
                 }
                 req.session.discountAmount = discountAmount;
                 
                 finalAmount -= discountAmount;
            console.log("finalAmount in if couponData ===>>>  ",finalAmount);
            console.log("totalAmount in if couponData ===>>>  ",totalAmount);
            console.log("discountAmount in if couponData ===>>>  ",discountAmount);

               }
               console.log("finalAmount in if couponData ===>>>  ",finalAmount);
               console.log("totalAmount in if couponData ===>>>  ",totalAmount);
               console.log("discountAmount in if couponData ===>>>  ",req.session.discountAmount);

             }
             console.log("finalAmount outside if couponData ===>>>  ",finalAmount);
             console.log("finalAmount outside if couponData after redusing the ctagory discount ===>>>  ",finalAmount - final_Discount);
             console.log("totalAmount outside if couponData ===>>>  ",totalAmount);
             console.log("req.session.discountAmount outside if couponData ===>>>  ",req.session.discountAmount);
 
             finalAmount -= final_Discount;
             console.log("finalAmount after redusing final_Discount ===>>>  ",finalAmount);
             console.log("finalAmount after redusing final_Discount ===>>>  ",final_Discount);
 
             console.log("couponData   ===>>>  ",couponData);
             
            const orderData = {
               items,
               discount : req.session.discountAmount ? req.session.discountAmount : 0,
               catagory_Discount : final_Discount ? final_Discount : 0,
               shipping_charge: shippingFee,
               total_amount: finalAmount,
               user_id: userId,
               payment_method: paymentOption == "Online Payment" || paymentOption == "Cash On Delivery" || paymentOption == "Wallet Payment" ? paymentOption : "",
               payment_status: "Pending",
               address: [billingAddress, shippingAddress],
            };

            req.session.discountAmount = null;
            function generateRandomString() {
               const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
               let randomString = '';
            
               for (let i = 0; i < 25; i++) {
                 const randomIndex = Math.floor(Math.random() * characters.length);
                 randomString += characters.charAt(randomIndex);
               }
            
               return randomString;
            }
            
            const user_display_order_id = generateRandomString();
            orderData.user_display_order_id = user_display_order_id;

            console.log("user_display_order_id   ====>>>  ", user_display_order_id);
            
            if (coupon_id !== null) {
               console.log("coupon_id ===> ", coupon_id);
               req.session.coupon_id = coupon_id;
               console.log("req.session.coupon_id  ===> ", req.session.coupon_id );
               orderData.coupon_id = coupon_id;
            }

            const newOrder = new Order(orderData);
            const saved = newOrder.save();
            console.log('Order saved successfully:', saved);
            console.log('Order newOrder successfully:', newOrder);
            console.log('Order newOrder._id successfully:', newOrder._id);

            if (paymentOption == "Online Payment") {
               generateRazorPay(newOrder._id, newOrder.total_amount, req, res)
                  .then(razorpayResponse => {
                     console.log('RazorPay response:', razorpayResponse);
                     res.json({ message: 'Payment processed successfully',razorpayResponse: razorpayResponse });
                  })
                  .catch(error => {
                     console.error('RazorPay error:', error);
                     res.json({ err: 'Payment processing failed' });
                  });
            }
         })
         .catch(error => {
            console.error('Error saving order:', error);
         });
   } catch (error) {
      console.log(error.message);
   }
}

const verifyPayment = async (req, res) => {
   console.log("Reached verifyPayment");
   try {
      const orderID = req.body.orderID;
      const status = req.body.status;
      console.log("orderID ===> ", orderID);
      console.log("status ===> ", status);
      const user_id = req.session.user_id
      const coupon_id = req.session.coupon_id
      console.log("Coupon present");
      req.session.coupon_id = coupon_id
      console.log("coupon_id ===> ", coupon_id);
      console.log("req.session.coupon_id  ===> ", req.session.coupon_id );
      let couponData;
      if(status == "Payment Successfull"){
         if(coupon_id){
            couponData = await coupon.findById(coupon_id)
         }
         const items = [];

         const user = await User.findById(user_id)
         
         items.push(
            ...user.cart.map(cartItem => ({
               product_id: cartItem.product._id,
               quantity: cartItem.quantity,
               sales_price: cartItem.product.sales_price,
               product_quantity: cartItem.product.stock || 0,
            }))
         );

         for (const item of items) {
            console.log("items ==>  ", items);
            const Product = await product.findById(item.product_id);
            if (!Product) {
               console.error(`Product with ID ${item.product_id} not found.`);
               continue;
            }
            console.log("Product ==> ", Product);
            console.log("Product.stock ==> ", Product.stock);
            console.log("item.quantity ==> ", item.quantity);
            Product.stock -= item.quantity;
            console.log("Product.quantity ==> ", Product.stock);

            await Product.save();
            console.log("await Product.save(); ==> ", await Product.save());
         }
         const order = await Order.findById(orderID)
         order.payment_status = "Paid"
         await order.save()

         let userCoupon

         if (couponData) {
            userCoupon = user.coupons.find((userCoupon) => userCoupon.coupon_id.equals(couponData._id));
            if (userCoupon) {
               userCoupon.no_of_times_used++;
            } else {
               user.coupons.push({
                  coupon_id: couponData._id,
                  no_of_times_used: 1,
               });
            }
         }
         await user.save();
         
         const updatedUser = await User.findByIdAndUpdate(user_id, { cart: [] }, { new: true });
         const successMsg = "updated product quantity and user data"
         return res.json({successMsg: successMsg})
      }else if(status == "Payment Cancelled"){
         console.log("Reached inside else if Payment Cancelled");
         const order = await Order.findById(orderID)
         order.payment_status = "Payment Cancelled"
         order.order_status = "Canceled"
         await order.save()
         const errMsg = "Your Order Has Been Cancelled";
         console.log("Saved order in verify in else case is  ===>>>  ",order);
         return res.json({errMsg: errMsg})
      }
      else{
         const order = await Order.findById(orderID)
         order.payment_status = "Payment Failed"
         await order.save()
         const errMsg = "Payment Failed Try Again.";
         console.log("Saved order in verify in else case is  ===>>>  ",order);
         return res.json({errMsg: errMsg})
      }
   } catch (error) {
      console.log(error.message);
      
   }

}

const generateRazorPay = async (orderID, totalAmount, req, res) => {
   const options = {
      amount: totalAmount *100, 
      currency: 'INR', 
      receipt: orderID, 
   };

   return new Promise((resolve, reject) => {
      instance.orders.create(options, (err, order) => {
         if (err) {
            console.error("RazorPay order creation error:", err);
            reject(err);
         } else {
            console.log("RazorPay order ===>>> ", order);
            resolve(order);
         }
      });
   });
}



const filteredByCatagoryFromHome = async (req, res) => {
   console.log("Reached filteredByCatagoryFromHome");
   try {

         // const categoryId = req.query.categoryId;
         // const categorieData = await category.find({});
         // const productData = await product.find({});
         // const filteredProducts = await product.find({ categoryId });
         const user = 1;
         const itemsPerPage = 9; // Define the number of items per page
         const page = req.query.page || 1; // Get the page number from the query parameters
     
         const categoryId = req.query.categoryId;
         const sort = req.query.sort;
         const searchQuery = req.query.searchQuery;
 
         const filter = {};
 
         if (categoryId) {
             filter.categoryId = categoryId;
         }
 
         // Construct the sort criteria based on the "sort" parameter
         let sortCriteria = {};
 
         if (sort === '1') {
             sortCriteria = { sales_price: 1 }; // Sort by price low to high
         } else if (sort === '-1') {
             sortCriteria = { sales_price: -1 }; // Sort by price high to low
         }
 
         if (searchQuery) {
             filter.product_name = { $regex: new RegExp(searchQuery, 'i') };
         }
         
         filter.blocked = false
         const categorieData = await category.find({});
 
         // const products = await product.find(filter).sort(sortCriteria);
         const productsCount = await product.countDocuments(filter); // Count all matching products
         const totalPages = Math.ceil(productsCount / itemsPerPage);

         const skipCount = (page - 1) * itemsPerPage;

         const products = await product.find(filter)
             .sort(sortCriteria)
             .skip(skipCount)
             .limit(itemsPerPage);
 
 
 

      if (req.session.user_id) {
         const user_id = req.session.user_id
         const userData = await User.findById({ _id: user_id })
         console.log("req.session.user_id is " + req.session.user_id);
         res.render('home', { user: userData, product: products, categories: categorieData, isAuthenticated: true, categoryId: categoryId || '', sort: sort || '', searchQuery: searchQuery || '', page: page || '', totalPages: totalPages || ''});
      } else {
         console.log("else case req.session.user_id is " + req.session.user_id);

         // res.render('home', { user, product: products, categories: categorieData, isAuthenticated: false });
         res.render('home', { user, product: products, categories: categorieData, isAuthenticated: false, categoryId: categoryId || '', sort: sort || '', searchQuery: searchQuery || '', page: page || '', totalPages: totalPages || ''});

      }
   } catch (error) {
      console.log(error.message)
   }
}

const filteredByCatagoryFromOther = async (req, res) => {
   console.log("Reached filteredByCatagoryFromOther");
   try {
      const categoryId = req.query.categoryId;
      const categorieData = await category.find({});
      const productData = await product.find({});
      const filteredProducts = await product.find({ categoryId });
      const user = 1;

      if (req.session.user_id) {
         const user_id = req.session.user_id
         const userData = await User.findById({ _id: user_id })
         console.log("req.session.user_id is " + req.session.user_id);
         res.render('all', { user: userData, product: filteredProducts, categories: categorieData, isAuthenticated: true });
      } else {
         console.log("else case req.session.user_id is " + req.session.user_id);

         res.render('all', { user, product: filteredProducts, categories: categorieData, isAuthenticated: false });
      }
   } catch (error) {
      console.log(error.message)
   }
}

const verfiyUser = async (req, res) => {
   try {
      const email = req.body.email;
      const password = req.body.password;

      const userData = await User.findOne({ email: email });
      if (userData) {
         if (userData.password === password) {
            req.session.user_id = userData._id
            console.log(userData._id);
            res.redirect('/home');
         } else {
            res.redirect(`/login?err=${true}&msg=Invalid email or password`);
         }
      } else {
         res.redirect(`/login?err=${true}&msg=Invalid email or password`);
      }

   } catch (error) {
      console.log(error.message)
   }
}



const userLogout = async (req, res) => {
   try {
      req.session.destroy()
           res.redirect('/');
   } catch (error) {
      console.log(error.message);
   }
}

const returnOrder = async (req, res) => {
   console.log("Reached returnOrder");
   try {
      const orderId = req.params.orderId;
      console.log("orderId ", orderId);
      console.log("req.body.returnReason ", req.body.returnReason);
      const return_Reason = req.body.returnReason
      const updatedOrder = await Order.findByIdAndUpdate(
         orderId,
         {
            return_Reason: return_Reason,
            order_status: "Return Requested"
         },
         { new: true }
      );
      console.log("order_status ", updatedOrder.order_status);
      console.log("updatedOrder ", updatedOrder);

      if (!updatedOrder) {
         return res.status(404).json({ message: 'Order not found' });
      }

      res.json(updatedOrder);
   } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
   }
}

const cancelOrder = async (req, res) => {
   console.log("Reached cancelOrder");
   try {
      const orderId = req.params.orderId;
      console.log("orderId ", orderId);

      const order = await Order.findById(orderId).populate('items.product_id');
      if (!order) {
         return res.status(404).json({ message: 'Order not found' });
      }

      console.log("order ==> ", order);
      console.log("order.items ==> ", order.items);
      console.log("order.payment_method ==> ", order.payment_method);

      for (const item of order.items) {
         const curr_product_id = item.product_id;
         const quantityToCancel = item.quantity;
         const Product = await product.findById(curr_product_id);
         console.log("curr_product_id ==> ", curr_product_id);
         console.log("quantityToCancel ==> ", quantityToCancel);
         console.log("Product ==> ", Product);


         if (Product) {
            Product.stock += quantityToCancel;

            await Product.save();
            console.log("await Product.save() ==> ", await Product.save());
         }
      }

      if (order.payment_method === "Wallet Payment" || order.payment_method === "Online Payment") {
         const userId = order.user_id;
         const user = await User.findById(userId);
       
         if (user) {

            function generateRandomString() {
               const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
               let randomString = '';
            
               for (let i = 0; i < 25; i++) {
                 const randomIndex = Math.floor(Math.random() * characters.length);
                 randomString += characters.charAt(randomIndex);
               }
            
               return randomString;
            }
   
             const user_display_order_id = generateRandomString();

           user.wallet_Balance += order.total_amount;
       
           user.transaction.push({
             type: "Credit",
             amount: order.total_amount,
             date: new Date(),
             user_display_order_id : user_display_order_id

           });

       
           await user.save();
         }
       
      }
      const updatedOrder = await Order.findByIdAndUpdate(
         orderId,
         { order_status: "Canceled" },
         { payment_status: "Refunded" },
         { new: true }
      );
      console.log("updatedOrder.cancel_Request ", updatedOrder.order_status);
      console.log("updatedOrder ", updatedOrder);

      if (!updatedOrder) {
         return res.status(404).json({ message: 'Order not found' });
      }

      res.json(updatedOrder);
   } catch (error) {
      console.error(error);
      res.json({ message: 'Internal Server Error' });
   }
}

const downloadInvoice = async (req, res) => {
   console.log("Reached downloadInvoice");

   try {
      const categorieData = await category.find({});
      const productData = await product.find({});
      const err = req.query.err;
      const msg = req.query.msg;
      const orderId = req.params.orderId;
      console.log("orderId  ====>>>  ",orderId);

      const browser = await puppeteer.launch({headless:false});
      const page = await browser.newPage();
      await page.goto(`${req.protocol}://${req.get('host')}`+`/getOrderDetails/${orderId}`,{
         waitUntil:"networkidle2"
      });
      await page.setViewport({width:1680, height:1050});
      const today_Date = new Date();
      const new_PDF = await page.pdf({
         path:`${path.join(__dirname,'../public/pfs',today_Date.getTime()+".pdf")}`,
         productId:true,
         format:"A4"
      });

      await browser.close();

      const pdf_URL = `${path.join(__dirname,'../public/pfs',today_Date.getTime()+".pdf")}`;

      res.set({
         "content-Type":"application/pdf",
         "content-Lenght":new_PDF.length
      });
      res.sendFile(pdf_URL)

   } catch (error) {
      console.error(error.message);
   }
};

const showInvoice = async (req, res) => {
   const orderId = req.params.orderId;
   const user_id = req.session.user_id;
   console.log("user_id`  ===>>>  ",`${user_id}`);

   const orderDetails = await Order.findById(orderId)
         .populate([
            {
               path: 'user_id',
               model: 'user',
               select: 'first_name last_name email mobile',
            },
            {
               path: 'items.product_id',
               model: 'product',
            }
         ]);

         console.log("orderDetails:", orderDetails);


   const shippingFeeTotal = orderDetails.items.reduce((total, item) => total + (item.product_id.shipping_fee || 0), 0);
   const salesPriceTotal = orderDetails.items.reduce((total, item) => total + (item.sales_price * item.quantity), 0);
   const grandTotal = (shippingFeeTotal || 0) + salesPriceTotal;
         console.log("${orderDetails.user_id.first_name}  ===>>>  ",`${orderDetails.user_id.first_name}`);
   const invoiceData = {
      companyName: 'Alpha Men', 
      invoiceNumber: orderId, 
      invoiceDate: new Date().toLocaleDateString(),
      clientName: `${orderDetails.user_id.first_name} ${orderDetails.user_id.last_name}`,
      clientAddress: orderDetails.address[0].street,
      clientCity: `${orderDetails.address[0].city_town_district}, ${orderDetails.address[0].state}, ${orderDetails.address[0].pincode}`,
      city_town_district: `${orderDetails.address[0].city_town_district}`,
      clientEmail: orderDetails.user_id.email,
      clientPhone: orderDetails.user_id.mobile,
      amount: `$${grandTotal.toFixed(2)}`, 
      items: orderDetails.items.map(item => ({
         itemImage:`${item.product_id.images[0]}`,
         itemName: `${item.product_id.product_name}`, 
         itemDescription: `${item.product_id.description}`, 
         rate: `$${item.sales_price.toFixed(2)}`, 
         quantity: item.quantity,
         total: `$${(item.sales_price * item.quantity).toFixed(2)}`, 
      })),
      totalAmount: `$${grandTotal.toFixed(2)}`, 
      companyWebsite: 'http://localhost:26726',
      companyEmail: 'alphamen26726@gmail.com',
      companyPhone: '9995112073',
      companyAddress: '123 Alphabet Road, Suite 01, Indianapolis, IN 46260',
     
   };

   console.log("Reached showInvoice");
   
   // Renderthe 'invoice' EJS template with the provided data
   res.render('invoice', { invoiceData });
}
   // try {
   //    const categorieData = await category.find({});
   //    const productData = await product.find({});
   //    const err = req.query.err;
   //    const msg = req.query.msg;
   //    const orderId = req.params.orderId;
   //    console.log("orderId  ====>>>  ",orderId);

   //    const browser = await puppeteer.launch({headless:false});
   //    const page = await browser.newPage();
   //    await page.goto(`${req.protocol}://${req.get('host')}`+`/getOrderDetails/${orderId}`,{
   //       waitUntil:"networkidle2"
   //    });
   //    await page.setViewport({width:1680, height:1050});
   //    const today_Date = new Date();
   //    const new_PDF = await page.pdf({
   //       path:`${path.join(__dirname,'../public/pfs',today_Date.getTime()+".pdf")}`,
   //       productId:true,
   //       format:"A4"
   //    });

   //    await browser.close();

   //    const pdf_URL = `${path.join(__dirname,'../public/pfs',today_Date.getTime()+".pdf")}`;

   //    res.set({
   //       "content-Type":"application/pdf",
   //       "content-Lenght":new_PDF.length
   //    });
   //    res.sendFile(pdf_URL)

   // } catch (error) {
   //    console.error(error.message);
   // }
// };

const sendOtp = async (req, res) => {
   console.log("OTP Send");
   try {
      const email = req.body.mail;
      const my_Mail = "alphamen26726@gmail.com";
      const my_password = "hpuq ywur tdop bcoh";

      const transporter = nodemailer.createTransport({
         host: 'smtp.gmail.com',
         port: 587,
         auth: {
            user: my_Mail,
            pass: my_password
         }
      });

      if (!email) {
         console.log("Email is missing");
         res.redirect(`/register?err=${true}&msg=Email is missing`);
      }

      function sendOTP() {
         generatedOTP = otpGenerator.generate(6, { upperCase: false, specialChars: false, alphabets: false });

         console.log("generatedOTP " + generatedOTP);
         req.session.generatedOTP = generatedOTP;
         console.log("Session Stored OTP " + req.session.generatedOTP);

         const mailOptions = {
            from: my_Mail,
            to: email,
            subject: 'Your OTP Code',
            text: `Your OTP code is: ${generatedOTP}`,
         };

         transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
               console.error('Error sending OTP:', error);
            } else {
               console.log('OTP sent:', info.response);
            }
         });

         setTimeout(() => {
            generatedOTP = null;
            console.log("OTP invalidated after 5 minute");
         }, 5 * 60 * 1000);
      }
      sendOTP();

   } catch (error) {
      console.log(error.message);
   }
}

const forgotpassword = async (req, res) => {
   console.log(req.session.email)

   try {
      const categorieData = await category.find({});
      const productData = await product.find({});
      console.log("Reached forgotpassword");
      const err = req.query.err;
      const msg = req.query.msg;
      if (err) {
         res.render('forgotpassword', { product: productData, categories: categorieData, isAuthenticated: false, message: '', errMessage: msg });
      } else {
         res.render('forgotpassword', { product: productData, categories: categorieData, isAuthenticated: false, message: msg, errMessage: '' });
      }
   } catch (error) {
      console.error(error.message);
   }
};

const verifyOTP = async (req, res) => {
   console.log("Reached verifyOTP  " + generatedOTP);
   try {
      const { email, otp } = req.body;
      const user = await User.findOne({ email });
      if (!user) {
         res.json({ isAuthenticated: false, errMessage: 'User not found', message: '' });
         console.log("Error User not found");
      }
      if (otp !== generatedOTP) {
         res.json({ isAuthenticated: false, errMessage: 'Invalid OTP', message: '' });
         console.log("Error Invalid OTP");
      }
      console.log("User OTP  " + otp);
      console.log("User  " + user);
      if (user && otp == generatedOTP) {
         res.json({ isAuthenticated: false, errMessage: '', message: '' })
         globalEmail = email;
         console.log("Success go to reset password");
      }
   } catch (error) {
      console.error(error.message);
   }
};

const resetpassword = async (req, res) => {
   try {
      const productData = await product.find({});
      const categorieData = await category.find({});
      const err = req.query.err;
      const msg = req.query.msg;
      if (err) {
         res.render('resetpassword', { product: productData, categories: categorieData, isAuthenticated: false, message: '', errMessage: msg });
      } else {
         res.render('resetpassword', { product: productData, categories: categorieData, isAuthenticated: false, message: msg, errMessage: '' });
      }
   } catch (error) {
      console.log(error.message)
   }
}

const changepassword = async (req, res) => {
   console.log("Reached changepassword");
   try {
      const confirmPassword = req.body.confirmPassword;
      const email = globalEmail;
      globalEmail = null;

      const checkData = await User.findOne({ email: email });

      if (checkData.password == confirmPassword) {
         res.redirect(`/resetpassword?err=${true}&msg=New password cannot be same as old password`);

      } else {
         checkData.password = confirmPassword

         const userData = await checkData.save();

         if (userData) {
            res.redirect(`/login?err=${""}&msg=Password reset successfull`);

         } else {
            res.redirect(`/resetpassword?err=""&msg=An error occured try again`);

         }
      }

   } catch (error) {
      console.log(error.message)
   }



}

module.exports = {
   loadRegister,
   insertUser,
   loadLogin,
   verfiyUser,
   loadHome,
   loadHomeAfterLogin,
   userLogout,
   sendOtp,
   forgotpassword,
   changepassword,
   verifyOTP,
   resetpassword,
   formals,
   special,
   all,
   about,
   contact,
   displayProduct,
   cart,
   addToCart,
   wishlist,
   addtowishlist,
   filteredByCatagoryFromHome,
   filteredByCatagoryFromOther,
   userAccount,
   updateUserAccount,
   addNewAddress,
   createNewAddress,
   editAddress,
   updateAddress,
   updateAddressStatus,
   getCartCount,
   getWishlistCount,
   updateCartQuantity,
   removeCartItem,
   clearCart,
   addToCart_forProductQuantity,
   getCartTotals,
   checkOutPage,
   processPayment,
   getOrderDetails,
   cancelOrder,
   returnOrder,
   getCouponDetails,
   blocked,
   getLatestData,
   generateRazorPay,
   processOnlinePayment,
   downloadInvoice,
   showInvoice,
   addReview,
   orderSuccess,
   verifyPayment,
   integratedFilter
}