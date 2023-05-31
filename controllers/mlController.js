const tf = require('@tensorflow/tfjs-node');
const path = require("path");
const fs = require("fs");

exports.allergyDetection = async (req, res) => {
    // Check File Image Exist
    if(!req.file) return res.status(400).json({status_code:400, message: (req.isIndo)? "Upload File Gambar!" : "No Image File Provided!"});
    
    try{
        const file = req.file;
        // req.data
        
        // Load Model
        modelLocation = path.join(__dirname, "../utils/allergyDetection.json");;
        const model = await tf.loadLayersModel(`file://${modelLocation}`);
        
        // Prepare Image for Input
        const imageBuffer = req.file.buffer;
        const decodeImage = tf.node.decodeImage(imageBuffer, 3);
        
        // Resize Input Image
        const resizedImage = tf.image.resizeBilinear(decodeImage, [56, 56]);
        const preprocessedImage = resizedImage.div(255.0);
        const inputTensor = preprocessedImage.expandDims(0);
        
        // Predict
        const predictions = model.predict(inputTensor);
        const result = predictions.arraySync();
        
        let message = ""
        if (result[0][0] > result[0][1]){
            (req.isIndo)? message = "Terindikasi Alergi!" : message = "Indicated Allergy!"
        }else if (result[0][0] > result[0][1]){
            (req.isIndo)? message = "Tidak Terindikasi Alergi!" : message = "Not Indicated Allergy!"
        }
        console.log(message);
        
        res.status(200).json({status_code:200, message, result, data: req.data});
        
    }catch(error){
        console.log(error);
        return res.status(500).json({ status_code: 500, message: error.message });
    }
};