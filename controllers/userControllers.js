const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const userModel = require("../models/userModel");

const JWT_SECRET = "m4vb3ZgZ2sP9afMCw1VquYqk2eHIA2o9Wd8j34mSo";

// generate token
const generateToken =(user)=>{
  return jwt.sign({id:user.id,email:user.email},JWT_SECRET,{
    expiresIn:"24h"
  })
}
// create a new user
const createUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const salt = await bcrypt.genSalt(10)
    const existingUser = await userModel.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "Email already exists" });
    // Create new user in MongoDB

    const hashedPassword = await bcrypt.hash(password,salt)
    const user = await userModel.create({ name, email, password:hashedPassword });
    console.log("user res", user);

    const token = generateToken(user)
    res.status(201).json({token,user:{name:user.name,email:user.email} ,message: "User created successfully",  });
  } catch (error) {
    res
      .status(400)
      .json({ message: "this is error creating user", error: error.message });
  }
};

// Get all users
const getUsers = async (req, res) => {
  try {
    // check if user exists
    const users = await userModel.find().select("-password");
    res.json(users);
    console.log("all users", users);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error retrieving user", error: err.message });
  }
};

//get user by id

const getUserById = async (req, res) => {
  try {
    const user = await userModel.findById(req.params.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving user", error: error.message });
  }
};

//user login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    // check if user exists
    const user = await userModel.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    // compare password;
    const isMatch = await bcrypt.compare(password, user.password);
    console.log("passw",password)
    console.log("user passw",(user.password))
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    // create json web token
    const token = generateToken(user)
    res.json({token,user: { name: user.name, email: user.email }, message: "Login successful" });
    console.log("token", token);
  } catch (error) {
    res.status(500).json({ message: "Login failed", error: error.message });
  }
};

const updateUser = async (req,res)=>{
  try {
    const {id} = req.params;
    const {name,email,password} = req.body;

    // find user by id
    const user = await userModel.findById(id);
    if(!user){
      return res.status(404).json({message:"User not found"})
    }
    // update fields
    if(name) user.name = name;
    if(email) user.email = email;

    // if password is provided;
    if(password){
      user.password = await bcrypt.hash(password,10)
    }

    //save update user;
    const updateUser = await user.save();
    res.status(200).json({
        message: "User updated successfully",
        user:{id:updateUser._id,
          name:updateUser.name,
          email:updateUser.email,
          // password:updateUser.password
        }
    })

  } catch (error) {
    res.status(500).json({ message: "Error updating user", error: error.message });
    
  }
}

module.exports = { createUser, getUsers, getUserById, loginUser,updateUser };
