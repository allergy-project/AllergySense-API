const { verifyToken } = require("../utils/functionJWT");

const validateAuth = async (req, res, next) => {
  if(req.user) return next() // Maybe Used if Implementing Session
	
  const token = req.header("Authorization");

  if (!token || token === undefined || token.length == 0) return res.status(401).json({ status_code:401, message: "User Not Authenticated!" });

  try {
    const data = verifyToken(token);
    req.user = data;
    return next();
  } catch (error) {
    return res.status(401).json({ status_code:401 ,message: "Invalid Token!" });
  }
};

module.exports = validateAuth;
