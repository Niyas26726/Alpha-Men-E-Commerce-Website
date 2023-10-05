  const mongoose = require('mongoose');

  const orderModel = new mongoose.Schema({
    items: [
      {
        product_id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'product', // Reference to the Product model
          required: true,
        },
        quantity: {
          type: Number,
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
      default:"Cash On Delivery"
    },
    coupon_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'coupon', // Reference to the Product model,
      default:null
    },
    shipping_charge: {
      type: Number,
      required: true,
    },
    discount: {
      type: Number,
      required: true,
      default:0
    },
    total_amount: {
      type: Number,
      required: true,
    },
    payment_status: {
      type: String,
      required: true,
      default:'Pending'
    },
    order_status: {
      type: String,
      required: true,
      default:'Placed'
    },
    created_on: {
      type: String,
      default: function () {
        const now = new Date();
        const day = now.getDate().toString().padStart(2, '0');
        const month = (now.getMonth() + 1).toString().padStart(2, '0');
        const year = now.getFullYear().toString();
        return `${day}-${month}-${year}`;
      },
    },
    expected_delivery_on: {
      type: String,
      default: function () {
        const now = new Date();
        const day = now.getDate() + 5;
        const month = (now.getMonth() + 1).toString().padStart(2, '0');
        const year = now.getFullYear().toString();
        return `${day}-${month}-${year}`;
      },
    },
    delivered_on: {
      type: Date,
      default: null
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user', // Reference to the User model
      required: true,
    },
    address: [
      {
        type: {
          type: String,
          required: true
        },
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

  module.exports = mongoose.model('order', orderModel,'order');


