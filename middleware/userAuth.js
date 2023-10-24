
const User = require('../models/userModel');

const isLogin = async (req, res, next) => {
   try {
      if (req.session.user_id) {
         next()
      console.log("yes")

      }
      else {
         res.redirect('/');
      }
   } catch (error) {
      console.log(error.message)
   }
}

const isLogout = async (req, res, next) => {
   console.log("req.session.user_id "+req.session.user_id);
   try {
      if (req.session.user_id) {
         req.session.user_id=null;
      } else {
      next();

      } 
   }catch (error) {
      console.log(error.message)
   }
}

const ifLogout = async (req, res, next) => {
   
   try {
      if (!req.session.user_id) {
         next() 
      }
      else { 
       
         res.redirect('/');
      }
   } catch (error) {
      console.log(error.message)
   }
}

const isBlocked = async (req, res, next) => {
   console.log("Reached isBlocked ===> ",req.session.user_id);
   
   try {
      const user = await User.findOne({ _id: req.session.user_id });
      if (user && user.blocked == true) {
         console.log("User is Blocked ");
        res.redirect('/blocked');
      }else if(user && user.blocked == false) {
         next();
      } else {
      next();
      }
   } catch (error) {
      console.log(error.message)
   }
}

const ifBlocked = async (req, res, next) => {
   console.log("Reached ifBlocked ===> ",req.session.user_id);
   
   try {
      const user = await User.findOne({ _id: req.session.user_id });
      if (user && user.blocked == true) {
         console.log("User is Blocked ");
         next();
      }else if(user && user.blocked == false) {
         res.redirect('/');
      }
   } catch (error) {
      console.log(error.message)
   }
}



module.exports = {
   isLogin,
   isLogout,
   ifLogout,
   isBlocked,
   ifBlocked
}

