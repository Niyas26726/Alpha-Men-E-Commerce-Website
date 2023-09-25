

const mongoose = require('mongoose');

const addressModel = new mongoose.Schema({
   name: {
      type: String,
      required: true
   },
   house_name: {
     type: String,
    required: true
   },
   city_town_district: {
     type: String,
    required: true
   },
   state: {
     type: String,
    required: true
   },
   address: {
     type: String,
    required: true
   },
   pincode: {
     type: String,
    required: true
   },
   landmark: {
     type: String,
    required: true
   },
   mobile: {
     type: String,
    required: true
   },
   alt_mobile: {
     type: String,
    required: true
   },
   email: {
     type: String,
    required: true
   },
   type: {
     type: String,
      required: true
    },
   blocked: {
    type: Boolean,
    default: false,
  }
})

module.exports = mongoose.model('address', addressModel, 'address');