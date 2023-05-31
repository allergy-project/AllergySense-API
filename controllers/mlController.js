const tf = require('@tensorflow/tfjs-node');
const path = require("path");
const fs = require("fs");

exports.allergyDetection = async (req, res) => {
    // Check File Image Exist
    if(!req.file) return res.status(400).json({status_code:400, message: (req.isIndo)? "Upload File Gambar!" : "No Image File Provided!"});
    
    try{
        const file = req.file;
        
        // Load Model
        modelLocation = path.join(__dirname, "../utils/allergyDetection.json");;
        const model = await tf.loadLayersModel(`file://${modelLocation}`);
        
        // Prepare Image for Input
        const imageBuffer = req.file.buffer;
        const decodeImage = tf.node.decodeImage(imageBuffer);
        
        // Resize Input Image
        const resizedImage = tf.image.resizeBilinear(decodeImage, [53, 53]);
        const preprocessedImage = resizedImage.div(255.0);
        const inputTensor = tf.expandDims(decodeImage);
        
        // Predict
        const predictions = model.predict(inputTensor);
        res.status(200).send(prediction);
        
    }catch(error){
        console.log(error);
        return res.status(500).json({ status_code: 500, message: error.message });
    }
};