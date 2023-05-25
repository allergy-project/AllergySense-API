const User = require("../models/User");
const validator = require("validator");

// const admin = require("../config/firebase");
// where(admin.firestore.FieldPath.documentId(), "!=", user_id) // Used to Where Not Self Id document

exports.register = () => async (req, res, next) => {
  try {
    const data = req.body;
    
    // Check Data
    for (requiredData of ["username", "password", "email"]){
        // Check Required Data
        if (!(requiredData in data)) return res.status(400).json({status_code:400, message: `${requiredData} is Required!`});
        
        // Check if Empty
        if(data[requiredData].length == 0) return res.status(400).json({status_code:400, message: `${requiredData} is Required!`});
        
        // Convert to String and Trim Data
        data[requiredData] = data[requiredData].toString().trim();
        
        // Check Symbol in Input
        for(x of data[requiredData]){
            if(["--", "_", "-", "%", "'", '"', "$", "&", "`", "#", "*"].indexOf(x) != -1)return res.status(400).json({status_code:400, message: `Can't Use ${x} Symbol for Input!`});
        }
    }
    
    // Username Min 5 Char
    if (data.username.length < 5) return res.status(400).json({status_code:400, message: `Username Min 5 Character!`});
        
    // Username Unique
    const usernameExistDoc = await User.where("username", "==", data.username).where("is_verified", "==", true).get();
    if (!(usernameExistDoc.empty)) return res.status(400).json({status_code:400, message: `Username Already Used!`}); 
    
    // Password Min 8
    if (data.password.length < 8) return res.status(400).json({status_code:400, message: `Password Min 8 Character!`});
    
    // Check Email
    if(!validator.isEmail(data.email)) return res.status(400).json({status_code:400, message: `Use Valid Email!`});

    // Email Unique
    const emailExistDoc = await User.where("email", "==", data.email).where("is_verified", "==", true).get();
    if (!(emailExistDoc.empty)) return res.status(400).json({status_code:400, message:`Email Already Used!`})
        
    // Wrap Data for Used in Controller
    req.data = data;
    
    return next();
  } catch (error) {
    return res.status(500).json({ status_code:500, message: error.message });
  }
};

exports.login = () => (req, res, next) => {
  try {
    const data = req.body;
    
    // Check Data
    for (requiredData of ["username","password"]){
        // Check Required Data
        if (!(requiredData in data)) return res.status(400).json({status_code:400, message: `${requiredData} is Required!`});
        
        // Check if Empty
        if(data[requiredData].length == 0) return res.status(400).json({status_code:400, message: `${requiredData} is Required!`});
        
        // Convert to String and Trim Data
        data[requiredData] = data[requiredData].toString().trim();
        
        // Check Symbol in Input
        for(x of data[requiredData]){
            if(["--", "_", "-", "%", "'", '"', "$", "&", "`", "#", "*"].indexOf(x) != -1)return res.status(400).json({status_code:400, message: `Can't Use ${x} Symbol for Input!`});
        }
    }

    // Wrap Data for Used in Controller
    req.data = data;
    
    return next();
  } catch (error) {
    return res.status(500).json({ status_code:500, message: error.message });
  }
};

exports.updateProfile = () => async (req, res, next) => {
  try { 
      
    // Check Data in Body
    if (req.body == null || Object.keys(req.body) == 0) return res.status(400).json({status_code:400, message: `No Data To Be Updated!`});
       
    let data = req.body;
    const user_id = req.user.id;
    
    // Check if Image URL Exist, If Exist Pass To Data
    if (req.image_url) data.image_url = req.image_url;
    
    // If Exist Data Name, Just Pass It
    
    // Get Current User Data for Comparing
    const userDoc = await User.doc(user_id).get();
    const userData = userDoc.data();
    
    // Convert and Check  Symbol when Exist Username in Body
    if (data.username){
        // Clean
        data["username"].toString().trim();
        for(x of data["username"]){
            if(["--", "_", "-", "%", "'", '"', "$", "&", "`", "#", "*"].indexOf(x) != -1)return res.status(400).json({status_code:400, message: `Can't Use ${x} Symbol for Input!`});
        }
        
        // If Username Change
        if (userData.username != data.username){
            // Username Min 5 Char
            if (data.username.length < 5) return res.status(400).json({status_code:400, message: `Username Min 5 Character!`});
                
            // Username Unique
            const usernameExistDoc = await User.where("username", "==", data.username).where("is_verified", "==", true).get();
            if (!(usernameExistDoc.empty)) return res.status(400).json({status_code:400, message: `Username Already Used!`}); 
        }
        
        // If Username Not Change, Remove it From data
        if (userData.username == data.username) delete data["username"];
    }
    
    // Convert and Check  Symbol when Exist Email in Body
    if (data.email){
        // Clean
        data["email"].toString().trim();
        for(x of data["email"]){
            if(["--", "_", "-", "%", "'", '"', "$", "&", "`", "#", "*"].indexOf(x) != -1)return res.status(400).json({status_code:400, message: `Can't Use ${x} Symbol for Input!`});
        }
        
        // If Email Change
        if (userData.email != data.email){
            // Check Email
            if(!validator.isEmail(data.email)) return res.status(400).json({status_code:400, message: `Use Valid Email!`});

            // Email Unique
            const emailExistDoc = await User.where("email", "==", data.email).where("is_verified", "==", true).get();
            if (!(emailExistDoc.empty)) return res.status(400).json({status_code:400, message:`Email Already Used!`})
        }
    
        // If Email Not Change, Remove it From data
        if (userData.email == data.email) delete data["email"];
    }
    
    // Convert and Check Symbol when User Want to Change Password
    if (data.new_password){
        // Clean
        data["new_password"].toString().trim();
        for(x of data["new_password"]){
            if(["--", "_", "-", "%", "'", '"', "$", "&", "`", "#", "*"].indexOf(x) != -1)return res.status(400).json({status_code:400, message: `Can't Use ${x} Symbol for Input!`});
        }
        
        // Password Min 8
        if (data.new_password.length < 8) return res.status(400).json({status_code:400, message: `Password Min 8 Character!`});        
    }
    
    // Delete Object or Emptyed it If Field Inside it Random
    if (!("username" in data) && !("email" in data) && !("new_password" in data) && !("name" in data)){
        data = null;
    }

    // Wrap Data for Used in Controller
    req.data = data;
    
    return next();
  } catch (error) {
    return res.status(500).json({ status_code:500, message: error.message });
  }
};
