const {db} = require("../config/firebase") 

const Quote = db.collection("quotes");

module.exports = Quote;