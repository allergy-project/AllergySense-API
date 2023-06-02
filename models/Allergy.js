const {db} = require("../config/firebase") 

const Allergy = db.collection("allergies");

module.exports = Allergy;