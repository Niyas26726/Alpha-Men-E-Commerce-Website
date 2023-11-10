const mongoose = require('mongoose');

const categoryModel = new mongoose.Schema({
   name: {
      type: String,
   },
   offer_Persentage: {
      type: Number,
      default: 0,
   },
   minimum_Amount: {
      type: Number,
      default: 0,
   },
   maximum_Discount: {
      type: Number,
      default: 0,
   },
   expiry_Date: {
      type: String,
      default: 0,
    },
    blocked: {
      type: Boolean,
      default: false,
    },
   offer_Blocked: {
      type: Boolean,
      default: false,
    }
})

module.exports = mongoose.model('category', categoryModel, 'category');