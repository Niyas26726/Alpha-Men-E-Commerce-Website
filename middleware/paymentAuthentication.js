const User = require('../models/userModel');

const isEmptyCart = async (req, res, next) => {
  const user = await User.findById(req.session.user_id).populate('cart.product');

  if (req.session.user_id) {
    try {
      if (user.cart.length === 0) {
        return res.redirect(`/cart?err=${true}&msg=Your Cart is Empty`); // Render a page indicating an empty cart
      }

      let isCartValid = true;

      for (const cartItem of user.cart) {
        if (cartItem.quantity <= 0 || cartItem.quantity > cartItem.product.stock) {
          isCartValid = false;
          break;
        }
        console.log("cartItem  ===>>>  ",cartItem);
        console.log("cartItem.quantity  ===>>>  ",cartItem.quantity);
        console.log("cartItem.product.stock  ===>>>  ",cartItem.product.stock);

      }

      if (isCartValid) {
        next();
      } else {
        return res.redirect(`/cart?err=${true}&msg=Invalid Cart Contents`); // Redirect to an error page for invalid cart
      }
    } catch (error) {
      console.error(error);
      return res.status(500).send('Internal Server Error');
    }
  }
};




module.exports = {
  isEmptyCart,
};
