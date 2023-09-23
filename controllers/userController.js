const User = require('../models/userModel');
const nodemailer = require('nodemailer');
const otpGenerator = require('otp-generator');
const category = require('../models/categoryModel');
const product = require('../models/productModel');

let generatedOTP = '';
let globalEmail = '';

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
      const email = req.body.email
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
            const userData = await user.save();
            if (userData) {
               res.redirect(`/register?err=${false}&msg=Sign Up Successfull click the link bellow to Login`);
            }
         }

      }

   } catch (error) {
      console.log(error.message)
   }
}


// login user

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
      const productData = await product.find({});
      if (req.session.user_id) {
         console.log("req.session.user_id is " + req.session.user_id);
         res.render('home', { product: productData, categories: categorieData, isAuthenticated: true });
      } else {
         console.log("else case req.session.user_id is " + req.session.user_id);

         res.render('home', { product: productData, categories: categorieData, isAuthenticated: false });
      }
   } catch (error) {
      console.log(error.message)
   }
}

const formals = async (req, res) => {
   console.log("Reached formals");
   try {
      const categorieData = await category.find({});
      const productData = await product.find({});
      if (req.session.user_id) {
         console.log("req.session.user_id is " + req.session.user_id);
         res.render('formals', { product: productData, categories: categorieData, isAuthenticated: true });
      } else {
         console.log("else case req.session.user_id is " + req.session.user_id);

         res.render('formals', { product: productData, categories: categorieData, isAuthenticated: false });
      }
   } catch (error) {
      console.log(error.message)
   }
}

const userAccount = async (req, res) => {
   console.log("Reached userAccount");
   try {
      const categorieData = await category.find({});
      const productData = await product.find({});
      if (req.session.user_id) {
         console.log("req.session.user_id is " + req.session.user_id);
         res.render('userAccount', { product: productData, categories: categorieData, isAuthenticated: true });
      } else {
         console.log("else case req.session.user_id is " + req.session.user_id);

         res.render('userAccount', { product: productData, categories: categorieData, isAuthenticated: false });
      }
   } catch (error) {
      console.log(error.message)
   }
}

const special = async (req, res) => {
   console.log("Reached special");
   try {
      const categorieData = await category.find({});
      const productData = await product.find({});
      if (req.session.user_id) {
         console.log("req.session.user_id is " + req.session.user_id);
         res.render('special', { product: productData, categories: categorieData, isAuthenticated: true });
      } else {
         console.log("else case req.session.user_id is " + req.session.user_id);

         res.render('special', { product: productData, categories: categorieData, isAuthenticated: false });
      }
   } catch (error) {
      console.log(error.message)
   }
}

const all = async (req, res) => {
   console.log("Reached all");
   try {
      const categorieData = await category.find({});
      const productData = await product.find({});
      if (req.session.user_id) {
         console.log("req.session.user_id is " + req.session.user_id);
         res.render('all', { product: productData, categories: categorieData, isAuthenticated: true });
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
      if (req.session.user_id) {
         console.log("req.session.user_id is " + req.session.user_id);
         res.render('about', { product: productData, categories: categorieData, isAuthenticated: true });
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
      if (req.session.user_id) {
         console.log("req.session.user_id is " + req.session.user_id);
         res.render('contact', { product: productData, categories: categorieData, isAuthenticated: true });
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
      const productData = await product.find({});
      if (req.session.user_id) {
         console.log("req.session.user_id is " + req.session.user_id);
         res.render('displayProduct', { product: productData, categories: categorieData, isAuthenticated: true });
      } else {
         console.log("else case req.session.user_id is " + req.session.user_id);

         res.render('displayProduct', { product: productData, categories: categorieData, isAuthenticated: false });
      }
   } catch (error) {
      console.log(error.message)
   }
}

const cart = async (req, res) => {
   console.log("Reached cart");
   try {
      const categorieData = await category.find({});
      const productData = await product.find({});
      if (req.session.user_id) {
         console.log("req.session.user_id is " + req.session.user_id);
         res.render('cart', { product: productData, categories: categorieData, isAuthenticated: true });
      } else {
         console.log("else case req.session.user_id is " + req.session.user_id);

         res.render('cart', { product: productData, categories: categorieData, isAuthenticated: false });
      }
   } catch (error) {
      console.log(error.message)
   }
}

const wishlist = async (req, res) => {
   console.log("Reached wishlist");
   try {
      const categorieData = await category.find({});
      const productData = await product.find({});
      if (req.session.user_id) {
         console.log("req.session.user_id is " + req.session.user_id);
         res.render('wishlist', { product: productData, categories: categorieData, isAuthenticated: true });
      } else {
         console.log("else case req.session.user_id is " + req.session.user_id);

         res.redirect(`/login?err=${true}&msg=Login to see wishlist`);
      }
   } catch (error) {
      console.log(error.message);
   }
}

const addtowishlist = async (req, res) => {
   console.log("Reached addtowishlist");
   let user_id = req.session.user_id
   console.log("req.session.user_id is " + req.session.user_id);

   if (user_id) {
      const productId = req.body.productId;
      console.log("productId is " + productId);

      const categorieData = await category.find({});
      const productData = await product.find({});
      const user = await User.findById(req.session.user_id);

      // Add the product ID to the user's wishlist array
      console.log("user in else case " + user);
      user.wishlist.push(productId);
      user.save().then((data) => {
         // console.log("if case worked saved");
         // console.log("req.session.user_id is " + req.session.user_id);
         // res.redirect('/wishlist');
         res.json({ status: true })
      }).catch((err) => {
         res.json({ status: false, msg: "Something went wrong" })
      })

      // if (saved) {x
      //     console.log("if case worked saved");
      //     console.log("req.session.user_id is " + req.session.user_id);
      //     res.redirect('/wishlist');
      // } 
   } else {
      res.json({ status: false, msg: "Login first to add product to wishlist" })
      // console.log("if case worked no user");
      // res.redirect(`/login?err=${true}&msg=Login first to add product to wishlist`);
      // console.log("after if case worked no user");
   }
}



const loadHomeAfterLogin = async (req, res) => {
   console.log("Reached loadHomeAfterLogin");
   try {
      const categorieData = await category.find({});
      const productData = await product.find({});

      if (req.session.user_id) {
         console.log("req.session.user_id is " + req.session.user_id);
         res.render('home', { product: productData, categories: categorieData, isAuthenticated: true });
      } else {
         console.log("else case req.session.user_id is " + req.session.user_id);

         res.render('home', { product: productData, categories: categorieData, isAuthenticated: false });
      }
   } catch (error) {
      console.log(error.message)
   }
}

const filteredByCatagoryFromHome = async (req, res) => {
   console.log("Reached filteredByCatagoryFromHome");
   try {
      const categoryId = req.query.categoryId;
      const categorieData = await category.find({});
      const productData = await product.find({});
      const filteredProducts = await product.find({ categoryId });

      if (req.session.user_id) {
         console.log("req.session.user_id is " + req.session.user_id);
         res.render('home', { product: filteredProducts, categories: categorieData, isAuthenticated: true });
      } else {
         console.log("else case req.session.user_id is " + req.session.user_id);

         res.render('home', { product: filteredProducts, categories: categorieData, isAuthenticated: false });
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

      if (req.session.user_id) {
         console.log("req.session.user_id is " + req.session.user_id);
         res.render('formals', { product: filteredProducts, categories: categorieData, isAuthenticated: true });
      } else {
         console.log("else case req.session.user_id is " + req.session.user_id);

         res.render('formals', { product: filteredProducts, categories: categorieData, isAuthenticated: false });
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
         // Invalid email or password
      } else {
         res.redirect(`/login?err=${true}&msg=Invalid email or password`);
      }

   } catch (error) {
      console.log(error.message)
   }
}



const userLogout = async (req, res) => {
   try {
      req.session.user_id = null;
      res.redirect('/');
   } catch (error) {
      console.log(error.message);
   }
}
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

      // Function to generate and send OTP
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

         // Invalidate the OTP after 1 minute
         setTimeout(() => {
            generatedOTP = null;
            console.log("OTP invalidated after 1 minute");
         }, 1 * 60 * 1000);
         // }
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
   wishlist,
   addtowishlist,
   filteredByCatagoryFromHome,
   filteredByCatagoryFromOther,
   userAccount
}

