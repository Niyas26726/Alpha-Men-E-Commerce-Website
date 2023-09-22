const mongoose = require('mongoose');

const productModel = new mongoose.Schema({
  product_name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'category', // Reference to the Category model
    required: true,
  },
  regular_price: {
    type: Number,
    required: true,
  },
  sales_price: {
    type: Number,
    required: true,
  },
  created_on: {
    type: String, // Store date as a string
    default: function () {
      const now = new Date();
      const day = now.getDate().toString().padStart(2, '0');
      const month = (now.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-indexed
      const year = now.getFullYear().toString();
      return `${day}-${month}-${year}`;
    },
  },

  updated_on: {
    type: String, // Store date as a string
    default: function () {
      const now = new Date();
      const day = now.getDate().toString().padStart(2, '0');
      const month = (now.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-indexed
      const year = now.getFullYear().toString();
      return `${day}-${month}-${year}`;
    },
  },
  brand_name: {
    type: String,
    required: true,
  },
  stock: {
    type: Number,
    required: true,
  },
  size: {
    type: String,
    required: true,
  },
  color: {
    type: String,
    required: true,
  },
  material: {
    type: String,
    required: true,
  },
  shipping_fee : {
    type: Number,
    required: true,
  },
  tax_rate: {
    type: Number,
    required: true,
  },
  blocked: {
    type: Boolean,
    default: false,
  },
  type: {
    type: String,
    required: true,
  },
  images: {
    type: Array,
    required: true
  }
});

module.exports = mongoose.model('product', productModel, 'product');