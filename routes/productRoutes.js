const express = require("express")
const router = express.Router()

const  {createProduct,updateProduct, getProduct, getProductById, removeProduct} = require("../controllers/ProductController")

router.post("/create",createProduct);
router.put("/update/:id",updateProduct);
router.get("/get/:id",getProductById);
router.get("/all",getProduct); 
router.delete("/delete/:id",removeProduct)

module.exports = router