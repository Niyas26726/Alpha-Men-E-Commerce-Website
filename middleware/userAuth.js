const isLogin = async (req, res, next) => {
   try {
      if (req.session.user_id) {
         next()
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

module.exports = {
   isLogin,
   isLogout,
   ifLogout
}

