const {db} = require("../config/firebase") 

const History = db.collection("histories");

module.exports = History;