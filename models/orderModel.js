const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  items: [
    {
      product_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product', // Reference to the Product model
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
      size: {
        type: String,
        required: true,
      },
      sales_price: {
        type: Number,
        required: true,
      },
    },
  ],
  payment_method: {
    type: String,
    required: true,
  },
  coupon_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product', // Reference to the Product model
  },
  shipping_charge: {
    type: Number,
    required: true,
  },
  discount: {
    type: Number,
    required: true,
  },
  total_amount: {
    type: Number,
    required: true,
  },
  created_on: {
    type: String, 
    default: function () {
      const now = new Date();
      const day = now.getDate().toString().padStart(2, '0');
      const month = (now.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-indexed
      const year = now.getFullYear().toString();
      return `${day}-${month}-${year}`;
    },
  },
  status: {
    type: String,
    required: true,
  },
  delivered_on: {
    type: Date,
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user', // Reference to the User model
    required: true,
  },
  address: [
    {
      name: {
        type: String,
        required: true,
      },
      city_town_district: {
        type: String,
        required: true,
      },
      state: {
        type: String,
        required: true,
      },
      address: {
        type: String,
        required: true,
      },
      pincode: {
        type: Number,
        required: true,
      },
      landmark: {
        type: String,
        required: true,
      },
      mobile: {
        type: Number,
        required: true,
      },
      alt_mobile: {
        type: Number,
        required: true,
      },
      type: {
        type: String,
        required: true,
      },
    },
  ],
});

module.exports = mongoose.model('Order', orderSchema);
