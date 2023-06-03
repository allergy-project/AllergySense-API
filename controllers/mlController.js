const tf = require('@tensorflow/tfjs-node');
const path = require("path");
const fs = require("fs");
const History = require("../models/History");
const Allergy = require("../models/Allergy");

exports.allergyCheck = async (req, res) => {
    // Cek User Login
    if (!req.user || req.user == null || req.user.length == 0) return res.status(401).json({ status_code:401, message: (req.isIndo)? `Pengguna Belum Terautentikasi!` : "User Not Authenticated!" });

    // Get User Id from Middleware
    const user_id = req.user.id;
    
    // Check File Image Exist
    if(!req.file) return res.status(400).json({status_code:400, message: (req.isIndo)? "Upload File Gambar!" : "No Image File Provided!"});
    
    try{
        const file = req.file;
        // req.data
        
        // Allergy Detection Logic(Determine Allergy or Not)
        // Load Model
        modelLocation = path.join(__dirname, "../utils/allergy_detection_model/allergyDetection.json");;
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
        
        // Check Allergy or Not
        let isAllergy = null
        let message = ""
        if (result[0][0] > result[0][1]){
            isAllergy = true;
            message = (req.isIndo)? "Terindikasi Alergi" : "Indicated Allergy";
        }else if (result[0][1] > result[0][0]){
            isAllergy = false
            message = (req.isIndo)? "Tidak Terindikasi Alergi" : "Not Indicated Allergy";
        }
        
        // Allergy Classification Logic(Determine Type of Allergy) allergy, suggest, suggest_indo, is_allergy, created_at, image_url
        // Get Allergy Type By Allengen Code Number
        console.log(req.data);
        console.log(req.data.allergen_code_number);
        const allergyDoc = await Allergy.where("allergen_code_number", "==", Number(req.data.allergen_code_number)).get();
        if (allergyDoc.empty) return res.status(404).json({ status_code: 404, message: (req.isIndo)? `Alergi Tidak Ditemukan!` :"Allergy Not Found!" });
        console.log(allergyDoc);
        console.log(allergyDoc[0].data());
        const dataAllergy = allergyDoc[0].data();
        
        // Create Data for Suggest and Suggest Indo
        let suggest = `Don't eat or use product related to ${dataAllergy.allergen}`
        let suggest_indo = `jangan makan atau menggunakan produk yang berkaitan dengan ${dataAllergy.allergen_indo}`
        const otherAllergenDocs = await Allergy.where("allergy", "==", dataAllergy.allergy).get();
        if (!(otherAllergenDocs.empty)){
            const otherAllergens = otherAllergenDocs.data();
            for (item of otherAllergens){
                suggest += `, ${item.allergen}`
                suggest_indo += `, ${item.allergen_indo}`
            }
        }
        
        
        const data = {allergy: `${dataAllergy.allergy}`, suggest, suggest_indo}
        
        // Prepare Data for Add to Histories
        // Data for Created At(Unixtime)
        const created_at = Date.now(); 
        
        // Change Allergy Related Field if Not Allergy
        if (!isAllergy){
            data.allergy = "Not Allergy";
            data.suggest = "Because is possible not allergy so just keep clean your surrounding and beware of something that dangerous to your skin health"
            data.suggest_indo = "Karena kemungkinan bukan terkena alergi, maka cukup jaga kebersihan lingkungan sekitar dan berhati-hati terhadap benda-benda disekitar yang berbahaya bagi kesehatan kulit"
        }
        
        // Add History
        const historyDoc = await History.add({ ...data, created_at, user_id: req.user.id, image_url: req.image_url, problem: req.data.problem, is_allergy: isAllergy });
        
        if (isAllergy) message = message+` ${data.allergy}`;
        
        res.status(200).json({status_code:200, message, data: {history_id: historyDoc.id, is_allergy: isAllergy}});
        
    }catch(error){
        console.log(error);
        return res.status(500).json({ status_code: 500, message: error.message });
    }
};
