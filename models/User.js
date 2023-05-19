const {db} = require("../config/firebase") 

const User = db.collection("users");

module.exports = User;