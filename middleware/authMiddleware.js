const jwt = require("jsonwebtoken");

const JWT_SECRET = "m4vb3ZgZ2sP9afMCw1VquYqk2eHIA2o9Wd8j34mSo";

const authMiddleware = (req, res, next) => {
      // console.log("authheader mid");
  const authHeader = req.headers["authorization"];
  // const autht = req.headers.authorization
  console.log("authheader", authHeader);
  // console.log("authheadehdsdasdr", autht);

  if (!authHeader || !authHeader.startsWith("Bearer")) {
    return res
      .status(401)
      .json({ message: "Access denied, no token provided" });
  }
  const token = authHeader.split(" ")[1];
  console.log("token", token);

  try {
    console.log("verifying....")
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log("decoded token",decoded)
    req.user = decoded; // Save decoded user info to req
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid or expired token", error });
  }

}
module.exports = authMiddleware;
