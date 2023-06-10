const jwt = require("jsonwebtoken");

exports.createToken = (user) => {
  try {
    const token = jwt.sign({ id: user.id }, process.env.SECRET_KEY, { expiresIn: "12h" });
    return token;
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.verifyToken = (token) => {
  try {
    const data = jwt.verify(token, process.env.SECRET_KEY);
    return data;
  } catch (error) {
    throw new Error(error.message);
  }
};
