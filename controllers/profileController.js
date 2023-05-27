const User = require("../models/User");
const bcrypt = require("bcrypt");
const crypto = require("crypto")
const sendEmail = require("../utils/sendEmail");

exports.getProfile = async(req, res) => {
   // Cek User Login
   if (!req.user || req.user == null || req.user.length == 0) return res.status(401).json({ status_code:401, message: (req.isIndo)? "Pengguna Tidak Terautentikasi!" : "User Not Authenticated!" });
  
   // Get User Id from Middleware
   const user_id = req.user.id;
   
   try{
       // Get Profile Doc
       const userDoc = await User.doc(user_id).get();
       
       // If User Not Found
       if(!(userDoc.exists)) return res.status(404).json({status_code:404, message: (req.isIndo)? "Pengguna Tidak Ditemukan!" : "User Not Found!"});
       
       // Get Data
       const userData = userDoc.data();
       
       // Filter Data to Return
       const data = {username: userData.username, name: userData.name, email: userData.email, image_url: userData.image_url, created_at: userData.created_at, update_at: (userData.update_at)? userData.update_at:userData.created_at};
       
       return res.status(200).json({status_code:200, message:(req.isIndo)? "Berhasil Mengambil Profil!" : "Success Get Profile!", data: data});
   } catch(error){
       return res.status(500).json({ status_code: 500, message: error.message });
   }
};

exports.updateProfile = async(req, res) => {
   // Cek User Login
   if (!req.user || req.user == null || req.user.length == 0) return res.status(401).json({ status_code:401, message: (req.isIndo)? "Pengguna Tidak Terautentikasi!" : "User Not Authenticated!" });
  
   // Get User Id from Middleware
   const user_id = req.user.id;
   
   // Check req.data From Validation
   if ((req.data == null || Object.keys(req.data) == 0) && (!req.data.image_url || req.data.image_url == null)) return res.status(400).json({status_code:400, message: (req.isIndo)? "Tidak Ada Data yang Perlu di Update!" : `No Data To Be Updated!`});
   
   // Get Data from Validation
   data = req.data;
   
   try{
       // Get Profile Doc
       const userDoc = await User.doc(user_id).get();
       
       // If User Not Found
       if(!(userDoc.exists)) return res.status(404).json({status_code:404, message: (req.isIndo)? "Pengguna Tidak Ditemukan!" : "User Not Found!"});
       
       const userData = userDoc.data();
       
       // Check Password, If Not Right Forbid Change(Only Do If There is Username, Email, or New Password)
       if (("username" in data) || ("email" in data) || ("new_password" in data)){
           // Check Password Exist or Not
           if (!("password" in data)) return res.status(400).json({ status_code:400, message: (req.isIndo)? "Password Wajib Diisi Jika Anda Ingin Mengganti Informasi yang Bersifat Credential/Rahasia/Penting!" : "Password Required If You Want to Change Credential Information!" });
           const match = await bcrypt.compare(data.password, userData.password);
           if (!match) return res.status(400).json({ status_code:400, message: (req.isIndo)? "Password Salah!" : "Password Wrong!" });
       }
       
       // If Change Name
       if (data.name) userData.name = data.name;
       
       // If Change Username
       if (data.username) userData.username = data.username;
       
       // If Change Image
       if (data.image_url) userData.image_url = data.image_url;
       
       // If Change Password
       if (data.new_password){
           // Hash Password & Replace Old Password
           userData.password = await bcrypt.hash(data.new_password, 10);
       }
       
       // If Email Change
       if (data.email){
            // Change Status Verified
            userData.is_verified = false;
          
            // Change Email
            userData.email = data.email;
            
            // Generate Random Code for Verification Code
            const code = crypto.randomBytes(10).toString("hex");
            
            // Change Verification Code
            userData.verification_code = code;
            
            // Construct URL for Verification
            const url = (req.isIndo)? `${req.protocol}://${req.hostname}/api/v1/verify/${code}?lang=id` : `${req.protocol}://${req.hostname}/api/v1/verify/${code}`;
            
            // Send Email
            let html = `
            <h1>Hello AllergySense User</h1>
            <p>Its Look Like Your Email for Account Has Changed, Verify Your Account by Access Link Below!</p>
            <a href=${url}>${url}</a>
            `;
            if (req.isIndo){
                html = `
                <h1>Halo Pengguna AllergySense</h1>
                <p>Sepertinya Email untuk Akun Anda Berubah, Verifikasi Kembali Akun Anda dengan Mengakses Link Dibawah Ini!</p>
                <a href=${url}>${url}</a>
                `;
            }
            await sendEmail(userData.email, (req.isIndo)? "Verifikasi Ganti Email AllergySense" : "AllergySense Verification Change Email", html);
       }
       
       // Data for Update At(Unixtime)
       const update_at = Date.now();
       userData.update_at = update_at;
       
       // Update Profile
       await User.doc(user_id).update(userData);
       
       return res.status(200).json({status_code:200, message: (req.isIndo)? "Update Profil Berhasil!" : "Success Editing Profile!"});
   } catch(error){
       return res.status(500).json({ status_code: 500, message: error.message });
   }
};