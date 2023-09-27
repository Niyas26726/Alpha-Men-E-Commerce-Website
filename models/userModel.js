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
   addresses: {
      type:Array
   },
   cart: {
      type:Array
   },
   wishlist: {
      type:Array
   },
   blocked: {
      type: Boolean,
      default: false
   }
})

module.exports = mongoose.model('user', userModel, 'user');

