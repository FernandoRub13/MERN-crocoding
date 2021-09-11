const jwt = require("jsonwebtoken");

var  jwtSecret = "mysecrettoken";
module.exports = function (req,res,next) {
  //Get token from header 
  const token = req.header("x-auth-token");  
  //Check if there is no token in the header
  if(!token){
    return res.status(401).json({ msg : "No token, authorization denied"});
  }

  //Verify the token given
  try {
    const decoded = jwt.verify(token, jwtSecret);
    req.user = decoded.user;
    next();
  } catch (error) {
    return res.status(401).json({ msg : "Token is not valid"});
  }
}