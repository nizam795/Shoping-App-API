const express = require("express")
const { createUser, getUsers,loginUser, getUserById } = require("../controllers/userControllers")
const authMiddleware = require("../middleware/authMiddleware")
const router = express.Router()

router.post("/signup",createUser) 
router.post("/login",loginUser)
router.get('/',authMiddleware ,getUsers)
router.get('/:id',getUserById)

module.exports = router
