const User = require("../models/User");
const bcrypt = require("bcrypt");
const crypto = require("crypto")
const sendEmail = require("../utils/sendEmail");

exports.getProfile = async(req, res) => {
   // Cek User Login
   if (!req.user || req.user == null || req.user.length == 0) return res.status(401).json({ status_code:401, message: "User Not Authenticated!" });
  
   // Get User Id from Middleware
   const user_id = req.user.id;
   
   try{
       // Get Profile Doc
       const userDoc = await User.doc(user_id).get();
       
       // If User Not Found
       if(!(userDoc.exists)) return res.status(404).json({status_code:404, message:"User Not Found!"});
       
       // Get Data
       const userData = userDoc.data();
       
       // Filter Data to Return
       const data = {username: userData.username, email: userData.email, created_at: userData.created_at, update_at: (userData.update_at)? userData.update_at:userData.created_at};
       
       return res.status(200).json({status_code:200, message:"Success Get Profile!", data: data});
   } catch(error){
       return res.status(500).json({ status_code: 500, message: error.message });
   }
};

exports.updateProfile = async(req, res) => {
   // Cek User Login
   if (!req.user || req.user == null || req.user.length == 0) return res.status(401).json({ status_code:401, message: "User Not Authenticated!" });
  
   // Get User Id from Middleware
   const user_id = req.user.id;
   
   // Get Data from Validation
   data = req.data;
   
   try{
       // Get Profile Doc
       const userDoc = await User.doc(user_id).get();
       
       // If User Not Found
       if(!(userDoc.exists)) return res.status(404).json({status_code:404, message:"User Not Found!"});
       
       const userData = userDoc.data();
       
       // Check Password, If Not Right Forbid Change
       const match = await bcrypt.compare(data.password, userData.password);
       if (!match) return res.status(400).json({ status_code:400, message: "Password Wrong!" });
       
       // Pass Username
       userData.username = data.username;
       
       // If Change Password
       if (data.new_password){
           // Hash Password & Replace Old Password
           userData.password = await bcrypt.hash(data.new_password, 10);
       }
       
       // If Email Change
       if (userData.email != data.email){
            // Change Status Verified
            userData.is_verified = false;
          
            // Change Email
            userData.email = data.email;
            
            // Generate Random Code for Verification Code
            const code = crypto.randomBytes(10).toString("hex");
            
            // Change Verification Code
            userData.verification_code = code;
            
            // Construct URL for Verification
            const url = `${req.protocol}://${req.hostname}/api/v1/verify/${code}`;
            
            // Send Email
            const html = `
            <h1>Hello AllergySense User</h1>
            <p>Its Look Like Your Email for Account Has Changed, Verify Your Account by Access Link Below!</p>
            <a href=${url}>${url}</a>
            `;
            await sendEmail(userData.email, "AllergySense Verification Change Email", html);
       }
       
       // Data for Update At(Unixtime)
       const update_at = Date.now();
       userData.update_at = update_at;
       
       // Update Profile
       await User.doc(user_id).update(userData);
       
       return res.status(200).json({status_code:200, message:"Success Editing Profile!"});
   } catch(error){
       return res.status(500).json({ status_code: 500, message: error.message });
   }
};