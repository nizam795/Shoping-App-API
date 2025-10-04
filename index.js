const express = require("express")
const app = express()
const mongoose = require('mongoose');
const PORT = 4000
const userRoutes = require("./routes/userRoutes")
const productRoutes = require("./routes/productRoutes")
const cors = require("cors");
const path = require("path")
const upload = require("./middleware/upload")
const fs = require("fs");
const cartRoutes = require("./routes/cartRoutes")


const MONGO_URI = 'mongodb+srv://mohdnizam30885:QiZgEDJocXUwVIEL@cluster0.5vlpi2j.mongodb.net/';

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true, 
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// middleware to parse json
app.use(cors(
  {
  origin:["http://localhost:5173","http://localhost:5174"],
  credentials:true,
  methods:["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}
));
app.use(express.json())  


// ✅ Ensure uploads folder exists
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}
console.log("uploading....")
// 🔥 make uploads folder public
app.use("/uploads",express.static(path.join(__dirname,"uploads")))

app.post("/upload",upload.single("image"),(req,res)=>{
   
  if(!req.file){
    return res.status(400).json({ message: "No file uploaded" })
  }
  //create url
 const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`

 res.json({
  message:"Image uploaded successfully!",
  imageUrl:imageUrl
 })
})

// mount the route
app.use("/users", userRoutes);
app.use("/product",productRoutes)
app.use("/cart",cartRoutes)


app.listen(PORT,()=>{ 
    console.log(`Server running at http://localhost:${PORT}`);
})