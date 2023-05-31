const tf = require('@tensorflow/tfjs-node');
const path = require("path");
const fs = require("fs");

exports.allergyDetection = async (req, res) => {
    // Check File Image Exist
    if(!req.file) return res.status(400).json({status_code:400, message: (req.isIndo)? "Upload File Gambar!" : "No Image File Provided!"});
    
    try{
        const file = req.file;
        
        // Load Model
        //modelLocation = path.join(__dirname, "../utils/allergyDetection.json");;
        const modelLocation = "../utils/allergyDetection.json";
        //modelData = fs.readFileSync(modelLocation, "utf8");
        const model = await tf.loadLayersModel(`file://${modelLocation}`);
        
        // Predict
        const predictions = model.predict(file);
        res.status(200).send(prediction);
        
    }catch(error){
        console.log(error);
        return res.status(500).json({ status_code: 500, message: error.message });
    }
};