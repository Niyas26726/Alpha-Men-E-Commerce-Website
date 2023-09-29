const User = require('../models/userModel');
const nodemailer = require('nodemailer');
const otpGenerator = require('otp-generator');
const category = require('../models/categoryModel');
const product = require('../models/productModel');
const Address = require('../models/addressModel')

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
      const user=1
      if (req.session.user_id) {
         const user_ID= req.session.user_id
         const userData = await User.findById({_id:user_ID})
         console.log("req.session.user_id is " + req.session.user_id);
         res.render('home', { user: userData,product: productData, categories: categorieData, isAuthenticated: true });
      } else {
         console.log("else case req.session.user_id is " + req.session.user_id);

         res.render('home', { user ,product: productData, categories: categorieData, isAuthenticated: false });
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
      const userData = await User.findById({_id:req.session.user_id})
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
      if(savedAddress){
         res.redirect(`/userAccount?err=${""}&msg=New address added successfully`); 
      }else{
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
      const userData = await User.findById({_id:req.session.user_id})
      const productData = await product.find({});
      const categorieData = await category.find({});
      const addressData = await Address.findById(addressID);
      if (req.session.user_id) {

         if (err) {
            res.render('editAddress', { address: addressData ,user: userData, product: productData, categories: categorieData, isAuthenticated: true, message: '', errMessage: msg });
         } else {
            res.render('editAddress', { address: addressData ,user: userData, product: productData, categories: categorieData, isAuthenticated: true, message: msg, errMessage: '' });
         }
      }
   } catch (error) {
      console.log(error.message);
   }
}

const updateAddress = async (req, res) => {
   console.log("Reached updateAddress");
   const addressID = req.body.addressID; // Retrieve addressID from the request body
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
  
      // Update the address's status to true
      let isblocked = await Address.findByIdAndUpdate(addressID, { blocked: true });
  
      // Send a success response
      if(isblocked){
         res.redirect(`/userAccount?err=${""}&msg=Address delsted successfully`);
      }else{
         res.redirect(`/userAccount?err=${true}&msg=An error occured while deleting the address`);
      }
    } catch (error) {
      console.error(error.message);
      // Send an error response
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
         const user_ID= req.session.user_id
         const userData = await User.findById({_id:user_ID})
         console.log("req.session.user_id is " + req.session.user_id);
         res.render('formals', { user: userData,product: productData, categories: categorieData, isAuthenticated: true });
      } else {
         console.log("else case req.session.user_id is " + req.session.user_id);

         res.render('formals', { user, product: productData, categories: categorieData, isAuthenticated: false });
      }
   } catch (error) {
      console.log(error.message)
   }
}



// const userAccount = async (req, res) => {
//    console.log("Reached userAccount");
//    try {
//       const user_id = req.session.user_id
//       const categorieData = await category.find({});
//       const productData = await product.find({});
//       const userData = await User.findOne({ _id: user_id });
//       console.log("userData "+userData);
//       if (req.session.user_id) {
//          console.log("req.session.user_id is " + req.session.user_id);
//          res.render('userAccount', { user: userData ,product: productData, categories: categorieData, isAuthenticated: true, message:"", errMessage: "" });
//       } else {
//          console.log("else case req.session.user_id is " + req.session.user_id);

//          res.render('userAccount', { user: userData ,product: productData, categories: categorieData, isAuthenticated: false, message:"", errMessage: "" });
//       }
//    } catch (error) {
//       console.log(error.message)
//    }
// }

const userAccount = async (req, res) => {
   console.log("Reached userAccount");
   try {
      const user_id = req.session.user_id;
      const categorieData = await category.find({});
      const productData = await product.find({});
      const err = req.query.err;
      const msg = req.query.msg;
      // Fetch user data including their addresses using populate
      const userData = await User.findOne({ _id: user_id }).populate('addresses');

      console.log("userData " + userData);

      if (req.session.user_id) {
         console.log("req.session.user_id is " + req.session.user_id);
         if(err==true){
            res.render('userAccount', { user: userData, product: productData, categories: categorieData, isAuthenticated: true, message:"", errMessage:  msg  });
         } else {
            console.log("else case req.session.user_id is " + req.session.user_id);

            res.render('userAccount', { user: userData, product: productData, categories: categorieData, isAuthenticated: false, message: msg , errMessage: "" });
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
      const userData = await User.findOne({ _id: user_id });
      console.log("userData " + userData);

      const uploadedFile = req.file;
      let updatedUserData = {
         first_name: req.body.name,
         last_name: req.body.lName,
         display_name: req.body.dname,
         email: req.body.email,
         mobile: req.body.mobile,
         password: req.body.npassword // Assuming you're updating the password as well
      };

      if (uploadedFile) {
        console.log("Uploaded profile picture filename: " + uploadedFile.filename);
        updatedUserData.user_profile = uploadedFile.filename;
      }

      if (!userData) {
         return res.status(404).render('userAccount', {
            user: false, product: productData, categories: categorieData, isAuthenticated: false, message: "", errMessage: "User not found"
         });
      }

      if (!req.session.user_id) {
         console.log("Session user_id is not set");
         return res.status(403).render('userAccount', {
            user: userData,
            product: productData,
            categories: categorieData,
            isAuthenticated: false,
            message: "",
            errMessage: "Unauthorized"
         });
      }

      const currentPassword = req.body.currentPassword
      const lName = req.body.lName
      console.log(req.body);
      console.log("currentPassword "+currentPassword+" userData.password "+userData.password+" lName "+lName);
      if (currentPassword !== userData.password) {
         return res.status(400).render('userAccount', {
            user: userData,
            product: productData,
            categories: categorieData,
            isAuthenticated: true,
            message: "",
            errMessage: "Current password does not match"
         });
      }

      // Use Mongoose to update the user data
      const updatedUser = await User.findByIdAndUpdate(user_id, updatedUserData, { new: true });

      // Update user details in the database with the values from the form
      // Your update logic here...

      // Redirect or render the success view if the update is successful
      console.log("updatedUserData ");
      res.render('userAccount', {
         user: updatedUserData, // Replace with the updated user data
         product: productData,
         categories: categorieData,
         isAuthenticated: true,
         message: "User details updated successfully",
         errMessage: ""
      });
   } catch (error) {
      console.log(error.message);
      // Handle other errors as needed...
   }
}


const special = async (req, res) => {
   console.log("Reached special");
   try {
      const categorieData = await category.find({});
      const productData = await product.find({});
      const user = 1;
      if (req.session.user_id) {
         const user_ID= req.session.user_id
         const userData = await User.findById({_id:user_ID})
         console.log("req.session.user_id is " + req.session.user_id);
         res.render('special', { user: userData,product: productData, categories: categorieData, isAuthenticated: true });
      } else {
         console.log("else case req.session.user_id is " + req.session.user_id);

         res.render('special', { user, product: productData, categories: categorieData, isAuthenticated: false });
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
      const user = 1
      if (req.session.user_id) {
         const user_ID= req.session.user_id
         const userData = await User.findById({_id:user_ID})
         console.log("req.session.user_id is " + req.session.user_id);
         res.render('all', { user: userData,product: productData, categories: categorieData, isAuthenticated: true });
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
         const user_ID= req.session.user_id
         const userData = await User.findById({_id:user_ID})
         console.log("req.session.user_id is " + req.session.user_id);
         res.render('about', { user: userData,product: productData, categories: categorieData, isAuthenticated: true });
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
         const user_ID= req.session.user_id
         const userData = await User.findById({_id:user_ID})
         console.log("req.session.user_id is " + req.session.user_id);
         res.render('contact', { user: userData,product: productData, categories: categorieData, isAuthenticated: true });
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
      // const userData = await User.findById({_id:req.session.user_id})
      // Use product.findOne to retrieve a single product by its _id
      const productData = await product.findOne({ _id: product_id });
      const user = 1

      if (!productData) {
         // Handle the case where the product is not found
         return res.status(404).send('Product not found');
      }

      if (req.session.user_id) {
         const user_id = req.session.user_id
         const userData = await User.findById({_id:user_id})
         console.log("req.session.user_id is " + req.session.user_id);
         res.render('displayProduct', { user: userData,product: productData, categories: categorieData, isAuthenticated: true });
      } else {
         console.log("else case req.session.user_id is " + req.session.user_id);

         res.render('displayProduct', { user,product: productData, categories: categorieData, isAuthenticated: false });
      }
   } catch (error) {
      console.log(error.message);
   }
}

const cart = async (req, res) => {
   console.log("Reached cart");
   try {
      const categorieData = await category.find({});
      const productData = await product.find({});
      const user = 1

      if (req.session.user_id) {
         const user_id = req.session.user_id
         const userData = await User.findById({_id:user_id})
         console.log("req.session.user_id is " + req.session.user_id);
         res.render('cart', { user: userData,product: productData, categories: categorieData, isAuthenticated: true });
      } else {
         console.log("else case req.session.user_id is " + req.session.user_id);

         res.redirect(`/login?err=${true}&msg=Login to see your cart`);

         // res.render('cart', { user,product: productData, categories: categorieData, isAuthenticated: false });
      }
   } catch (error) {
      console.log(error.message)
   }
}

const addToCart = async (req, res) => {
   console.log("Reached addToCart");
   let user_id = req.session.user_id
   console.log("req.session.user_id is " + req.session.user_id);

   if (user_id) {
      const productId = req.body.productId;
      console.log("productId is " + productId);

      const categorieData = await category.find({});
      const productData = await product.find({});
      const user = await User.findById(req.session.user_id);

      console.log("user in else case " + user);
      user.wishlist.push(productId);
      user.save().then((data) => {
         res.json({ status: true })
      }).catch((err) => {
         res.json({ status: false, msg: "Something went wrong" })
      })
   } else {
      res.json({ status: false, msg: "Login first to add to cart" })
   }
}

const wishlist = async (req, res) => {
   console.log("Reached wishlist");
   try {
      const categorieData = await category.find({});
      const productData = await product.find({});
      if (req.session.user_id) {
         const user_id = req.session.user_id
         const userData = await User.findById({_id:user_id})
         console.log("req.session.user_id is " + req.session.user_id);
         res.render('wishlist', { user: userData,product: productData, categories: categorieData, isAuthenticated: true });
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
    console.log("Reached addtowishlist");
    let user_id = req.session.user_id
    console.log("req.session.user_id is " + req.session.user_id);

    if (user_id) {
        const productId = req.body.productId;
        console.log("productId is " + productId);

      const categorieData = await category.find({});
      const productData = await product.find({});
      const user = await User.findById(req.session.user_id);
      console.log("user in else case " + user);
      user.wishlist.push(productId);
      user.save().then((data) => {
         res.json({ status: true })
      }).catch((err) => {
         res.json({ status: false, msg: "Something went wrong" })
      })
   } else {
      res.json({ status: false, msg: "Login first to add product to wishlist" })
   }
        const categorieData = await category.find({});
        const productData = await product.find({});
        const user = await User.findById(req.session.user_id);

        // Add the product ID to the user's wishlist array
        console.log("user in else case " + user);
        user.wishlist.push(productId);
        user.save().then((data) => {
            console.log("if case worked saved");
            console.log("req.session.user_id is " + req.session.user_id);
            res.redirect('/wishlist');
        }).catch((err) => {
            console.log("Something went wrong")
            console.log(err.message);
        })
    } else {
        console.log("if case worked no user");
        res.redirect(`/login?err=${true}&msg=Login first to add product to wishlist`);
        console.log("after if case worked no user");
    }
}

const loadHomeAfterLogin = async (req, res) => {
   console.log("Reached loadHomeAfterLogin");
   try {
      const categorieData = await category.find({});
      const productData = await product.find({});
      const user_ID= req.session.user_id
      const userData = await User.findById({_id:user_ID})

      if (req.session.user_id) {
         console.log("req.session.user_id is " + req.session.user_id);
         res.render('home', { user: userData,product: productData, categories: categorieData, isAuthenticated: true });
      } else {
         console.log("else case req.session.user_id is " + req.session.user_id);

         res.render('home', { user: userData,product: productData, categories: categorieData, isAuthenticated: false });
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
      const user= 1;


      if (req.session.user_id) {
         const user_id = req.session.user_id
         const userData = await User.findById({_id:user_id})
         console.log("req.session.user_id is " + req.session.user_id);
         res.render('home', { user: userData,product: filteredProducts, categories: categorieData, isAuthenticated: true });
      } else {
         console.log("else case req.session.user_id is " + req.session.user_id);

         res.render('home', { user,product: filteredProducts, categories: categorieData, isAuthenticated: false });
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
      const user= 1;

      if (req.session.user_id) {
         const user_id = req.session.user_id
         const userData = await User.findById({_id:user_id})
         console.log("req.session.user_id is " + req.session.user_id);
         res.render('formals', { user: userData, product: filteredProducts, categories: categorieData, isAuthenticated: true });
      } else {
         console.log("else case req.session.user_id is " + req.session.user_id);

         res.render('formals', { user, product: filteredProducts, categories: categorieData, isAuthenticated: false });
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
   updateAddressStatus
}

