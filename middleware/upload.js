const multer = require("multer");
const path = require("path");

console.log("uploading....")
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        console.log("uploading...."
        )
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        console.log("uploading....")
        const uniquename = Date.now() + path.extname(file.originalname)
        cb(null, uniquename)
    }
})

//file filter
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
        cb(null, true)
    } else {
        cb(new Error("Only image files are allowed!"), false)
    }
}
const upload = multer({ storage, fileFilter })
module.exports = upload