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
      ref: 'address', // Reference to the Address model
   }],
   cart: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'product', // Reference to the Product model
        },
        quantity: {
          type: Number,
          default: 1, // Default quantity is 1
        },
      },
    ],
   wishlist: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'product', // Reference to the Product model
      },
    ],
   blocked: {
      type: Boolean,
      default: false
   }
})

module.exports = mongoose.model('user', userModel, 'user');

