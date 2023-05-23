const bcrypt = require("bcrypt");
const crypto = require("crypto")
const { createToken } = require("../utils/functionJWT");
const User = require("../models/User")
const sendEmail = require("../utils/sendEmail");

exports.register = async (req, res) => {
  // Get Data From Validation Middleware
  const { username, password, email } = req.data;

  try {
    // Check If Username Has Already Used
    // Check If Email Already Used
    // Above Already Done in Validation!
    
    // Generate Random Code for Verification Code
    const code = crypto.randomBytes(10).toString("hex");
    
    // Construct URL for Verification
    const url = `${req.protocol}://${req.hostname}/api/v1/verify/${code}`;
    
    // Send Email
    const html = `
    <h1>Welcome To AllergySense</h1>
    <p>Verify Your Account by Access Link Below!</p>
    <a href=${url}>${url}</a>
    `;
    await sendEmail(email, "AllergySense Verification", html);
    
     // Hash Password
    const hash = await bcrypt.hash(password, 10);
    
    // Data for Created At(Unixtime)
    const created_at = Date.now(); 
    
    // Create User
    await User.add({ username, password: hash, email, is_verified: false, verification_code: code , created_at});
    
    return res.status(201).json({ status_code:201, message: "User Registered!" });
  } catch (error) {
    return res.status(500).json({ status_code:500, message: error.message });
  }

};

exports.login = async (req, res) => {
  // Get Data from Validation Middleware
  const { username, password } = req.data;

  // Check If Username&Password match
  try {
    // Check Username
    const userDocs = await User.where("username", "==", username).get();
    if (userDocs.empty) return res.status(400).json({ status_code:400, message: "Wrong Username or Password!" });
    const userDoc = userDocs.docs[0];
    const userData = userDoc.data()
    
    // Check Password
    const match = await bcrypt.compare(password, userData.password);
    if (!match) return res.status(400).json({ status_code:400, message: "Wrong Username or Password!" });
    
    // Check Verified Status
    if (userData.is_verified != true) return res.status(401).json({ status_code:401, message: "Account Not Verified!" });

    // Create Token
    payload = {id: userDoc.id, ...userData}
    const token = createToken(payload);
    
    return res.status(200).json({ status_code:200, message: "Login Success!", token: token });
  } catch (error) {
    return res.status(500).json({ status_code:500, message: error.message });
  }
};

exports.verify = async (req, res) => {
    // Get Code from URl Verify Account
    const {code} = req.params;
    
    // Check if Code Empty
    if (code.length == 0 || code == null) return res.status(400).json({ status_code:400, message: "Verification Code Required!" });
    
    try{
       // Check if Code Valid
       const userDocs = await User.where("verification_code", "==", code.toString()).get();
       if(userDocs.empty) return res.status(404).send("Verification Code Not Found!");
       
       // Check if User Has Verified
       const userDoc = userDocs.docs[0];
       const userData = userDoc.data();
       if (userData.is_verified == true) return res.status(400).send("Account Already Verified!");
       
       // Change Status User + Add Update At
       userData.is_verified = true;
       // Data for Update At(Unixtime)
       const update_at = Date.now(); 
       await User.doc(userDoc.id).update({...userData, update_at});
       
       // Delete Other Account with Same username or email With this but Hasnt been Verified
       // Same Username 
       let otherUserDocs = await User.where("username", "==", userData.username).where("is_verified", "==", false).get();
       otherUserDocs.forEach(async (doc) => {await User.doc(doc.id).delete()});
       // Same Email
       otherUserDocs = await User.where("email", "==", userData.email).where("is_verified", "==", false).get();
       otherUserDocs.forEach(async (doc) => {await User.doc(doc.id).delete()});
       
       return res.status(200).send("Account Verification Success!");
    } catch(error){
       return res.status(500).json({ status_code:500, message: error.message });
    }
};