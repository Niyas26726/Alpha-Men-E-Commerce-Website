const mongoose = require('mongoose');

const userModel = new mongoose.Schema({
   user_profile: {
      type: Array,
   },
   first_name: {
      type: String,
      required: true
   }, 
   last_name: {
      type: String,
      required: true
   },
   display_name: {
      type: String,
   },
   mobile: {
      type: Number,
      required: true
   },
   email: {
      type: String,
      required: true
   },
   password: {
      type: String,
      requird: true
   },
   addresses: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'address', 
   }],
   cart: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'product', 
        },
        quantity: {
          type: Number,
          default: 1, 
        },
      },
    ],
    coupons:[
      {
         coupon_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Coupon', 
          },
          no_of_times_used: {
            type: Number,
            default: 0, 
          },
      },
    ],
   wishlist: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'product', 
      },
   ],
   blocked: {
      type: Boolean,
      default: false
   }
})


module.exports = mongoose.model('user', userModel, 'user');

