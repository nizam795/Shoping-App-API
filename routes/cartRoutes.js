const express = require("express")

const authMiddleware = require("../middleware/authMiddleware")
const { addToCart, getCart, updateCart, removeFromItem } = require("../controllers/cartController")


const router = express.Router()

router.post("/add",authMiddleware,addToCart)
router.get("/get",authMiddleware,getCart)
router.put("/update",authMiddleware,updateCart)
router.delete("/remove",authMiddleware,removeFromItem)


module.exports = router