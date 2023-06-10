const { verifyToken } = require("../utils/functionJWT");
const User = require("../models/User");

const validateAuth = async (req, res, next) => {
  if(req.user) return next() // Maybe Used if Implementing Session
	
  const token = req.header("Authorization");

  if (!token || token === undefined || token.length == 0) return res.status(401).json({ status_code:401, message: (req.isIndo)? "Pengguna Belum Terautentikasi" : "User Not Authenticated!" });

  try {
    const data = verifyToken(token);
    req.user = data;
    const userDoc = await User.doc(req.user.id).get();
    if (!userDoc.exists) return res.status(401).json({ status_code:401 ,message:(req.isIndo)? "Pengguna Tidak Ditemukan!" : "User Not Found!" });
    return next();
  } catch (error) {
    return res.status(401).json({ status_code:401 ,message: "Session Expired, Please Login Again!" });
  }
};

module.exports = validateAuth;
