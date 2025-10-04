const CartModal = require("../models/CartModal");
const mongoose = require("mongoose");
const ProductModal = require("../models/ProductModal");

const formatCart = (cart) =>
  cart.items
    .filter((item) => item.productId)
    .map((item) => ({
      _id: item.productId._id,
      title: item.productId.title,
      price: item.productId.price,
      category: item.productId.category,
      quantity: item.quantity,
      images: item.productId.images,
      subtotal: item.productId.price * item.quantity,
    }));

// add to cart
const addToCart = async (req, res) => {
  try {
    const userId = req.user.id;
    // console.log("userId",userId)
    const { productId, quantity } = req.body;
    const qty = quantity || 1;
    // console.log("qty", qty);
    // console.log("sbdhfbdshf",productId)
    // console.log("re .body",req.body)
    if (!productId) {
      return res.status(400).json({ message: "productId is required" });
    }
    //check product sock
    const product = await ProductModal.findById(productId);
    // console.log("productID", product);
    if (!product) {
      return res.status(400).json({ message: "Product not found" });
    }
    if (product.stock < qty) {
      return res.status(400).json({ message: "Not enought stock available" });
    }
    // find user's cart or create one
    let cart = await CartModal.findOne({ userId });
    // console.log("cart", cart);

    if (!cart) {
      // create new cart for user
      cart = new CartModal({
        userId,
        items: [
          { productId: new mongoose.Types.ObjectId(productId), quantity: qty },
        ],
      });
    } else {
      // check if product already in cart
      const itemIndex = cart.items.findIndex(
        (item) => item.productId.toString() === productId
      );
      console.log("item-index",itemIndex)

      if (itemIndex > -1) {
        // product exists → update quantity
        if (product.stock < cart.items[itemIndex].quantity + qty) {
          return res
            .status(400)
            .json({ message: "Not enough stock to increase quantity" });
        }
        cart.items[itemIndex].quantity += qty;
      } else {
        // new product → push to items array
        cart.items.push({
          productId: new mongoose.Types.ObjectId(productId),
          quantity: qty,
        });
      }
    }
    //reduce product stock
    product.stock -= qty;

    //save both updates
    await Promise.all([cart.save(), product.save]);

    // populate product details
    const userCart = await CartModal.findOne({ userId }).populate(
      "items.productId"
    );
    console.log("userCart", userCart);

    res
      .status(200)
      .json({ cart: formatCart(userCart), message: "Cart  product added" });
  } catch (error) {
    console.error("Add to Cart Error:", error);
    res
      .status(500)
      .json({ message: "Error adding to cart", error: error.message });
  }
};
// getCart
const getCart = async (req, res) => {
  try {
    const userId = req.user.id;

    // find single cart for user and populate inside items.productId
    const cart = await CartModal.findOne({ userId }).populate(
      "items.productId"
    );

    if (!cart) {
      return res.status(200).json({ items: [] });
    }
    res
      .status(200)
      .json({ cart: formatCart(cart), message: "Cart fetched successfully" });
  } catch (error) {
    console.error("Get Cart Error:", error);
    res
      .status(500)
      .json({ message: "Failed to fetch cart", error: error.message });
  }
};

//update product

const updateCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.body;
    const quantity = Number(req.body.quantity);

    if (!productId) {
      return res.status(400).json({ message: "productId is required" });
    }
    if (isNaN(quantity) || quantity < 0) {
      return res.status(400).json({ message: "quantity must be >= 0" });
    }

    const cart = await CartModal.findOne({ userId });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId
    );

    if (itemIndex === -1) {
      return res.status(404).json({ message: "Product not found in cart" });
    }

    if (quantity === 0) {
      // Remove product from items
      cart.items.splice(itemIndex, 1);
    } else {
      // Update quantity
      cart.items[itemIndex].quantity = quantity;
    }

    await cart.save();

    const updatedCart = await CartModal.findOne({ userId }).populate(
      "items.productId"
    );

    res
      .status(200)
      .json({ cart: formatCart(updatedCart), message: "Cart updated" });
  } catch (error) {
    console.error("Update Cart Error:", error);
    res
      .status(500)
      .json({ message: "Error updating cart", error: error.message });
  }
};

//remove item
const removeFromItem = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { productId } = req.body;

    if (!userId || !productId) {
      return res.status(400).json({ message: "userId or productId missing" });
    }
    // Find user's cart
    const cart = await CartModal.findOne({ userId });
    console.log("hbhbhbhbj", cart);
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }
    // Find the product in items array
    const itemIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId
    );
    console.log("itemIndex", itemIndex);
    console.log(
      "Cart items:",
      cart.items.map((i) => i.productId.toString())
    );
    console.log("Incoming productId:", productId);
    if (itemIndex === -1) {
      return res.status(404).json({ message: "Product not found in cart" });
    }

    // Remove the product
    cart.items.splice(itemIndex, 1);

    await cart.save();

    // Return updated cart
    const updatedCart = await CartModal.findOne({ userId }).populate(
      "items.productId"
    );

    res
      .status(200)
      .json({
        cart: formatCart(updatedCart),
        message: "Product removed from cart",
      });
  } catch (error) {
    console.error("Remove from Cart Error:", error);
    res
      .status(500)
      .json({ message: "Error removing from cart", error: error.message });
  }
};

module.exports = { addToCart, getCart, updateCart, removeFromItem };
