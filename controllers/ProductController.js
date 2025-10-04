const { default: mongoose } = require("mongoose");
const ProductModal = require("../models/ProductModal");

const createProduct = async (req, res) => {
  try {
    const product = new ProductModal(req.body);
    console.log("create product 1",product)
    const saveProduct = await product.save();
       console.log("save product",saveProduct)
    res.status(200).json(saveProduct);
  } catch (error) {
    res.status(400).json({ message: "creation failed"});
  }
};

const getProduct = async (req, res) => {
  console.log("all data.....")
  try {
    const product = await ProductModal.find();
    res.json(product);
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "error is getProduct" });
  }
};


const getProductById = async (req, res) => {
  
  try {
    const {id} = req.params
    console.log("id",id)
    //check valid objectID
    if(!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({message:"Invalid product id"})
    const product = await ProductModal.findById(id);
    console.log("product....",product)
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "fetched single product" });
  }
};
const updateProduct = async (req, res) => {
  console.log("update.......")
  try {
    const { id } = req.params;
    const updateProduct = await ProductModal.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updateProduct) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json({
      message: "Product updated successfully",
      product: updateProduct,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const removeProduct = async (req,res)=>{
  try {
    const {id} = req.params;
    if(!id){
       return res.status(400).json({ message: "Product ID is required" });
    }
    const deleteProduct = await ProductModal.findByIdAndDelete(id)
    if(!deleteProduct){
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({ message: "Product deleted successfully", deleteProduct })
    
  } catch (error) {
     res.status(500).json({ message: "product deleted" });
  }
}

module.exports = { createProduct, getProduct, getProductById, updateProduct,removeProduct };
