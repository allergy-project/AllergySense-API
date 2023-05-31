const tf = require('@tensorflow/tfjs');

exports.allergyDetection = async (req, res) => {
    // Check File Image Exist
    if(!req.file) return res.status(400).json({status_code:400, message: (req.isIndo)? "Upload File Gambar!" : "No Image File Provided!"});
    
    try{
        const file = req.file;
        
        // Load Model
        const model = await tf.loadLayersModel('../utils/allergyDetection.h5');
        
        // Predict
        const predictions = model.predict(file);
        res.status(200).send(prediction);
        
    }catch(error){
        return res.status(500).json({ status_code: 500, message: error.message });
    }
};