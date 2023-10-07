const mongoose = require('mongoose');

const couponModel = new mongoose.Schema({
   coupon_id: {
      type: String,
      required: true
   }, 
   limit:{
    type: Number,
    default:1
   },
   expiry_Date: {
    type: String,
    default: function () {
      const now = new Date();
      const futureDate = new Date(now);
      futureDate.setDate(now.getDate() + 15);
      const day = futureDate.getDate().toString().padStart(2, '0');
      const month = (futureDate.getMonth() + 1).toString().padStart(2, '0');
      const year = futureDate.getFullYear().toString();
      return `${day}-${month}-${year}`;
    },
  },
   minimum_Amount: {
      type: Number,
      required: true
   },
   maximum_Discount: {
      type: Number,
      required: true
   },
   discount_Percentage: {
      type: Number,
      required: true
   },
   valid: {
      type: Boolean,
      default: true
   }
})

module.exports = mongoose.model('Coupon', couponModel, 'coupon');
