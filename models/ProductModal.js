const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  reference:{
    type:String
  },
  productSummery:{
    type:String

  },
  images: {
    type: [String]
  },
  category: {
    type: String,
      required: true,
   
  },
  price: {
    type: Number,
    // required: true,
  },
  description: {
    type: String,
    // required: true,
  },
  status:{
    type:String,
    // required:true
  },
  stock:{
    type:Number,required:true
  },
  metaTitle:{
    type:String
  },
  metaKeywords:{
    type:String

  },metaDesc:{
    type:String
  }
 
});
module.exports = mongoose.model("Product", productSchema);
