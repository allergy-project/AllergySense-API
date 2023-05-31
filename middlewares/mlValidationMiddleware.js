exports.allergyDetection = () => async (req, res, next) => {
    try{
        // Check Image Uploaded
        if (!req.image_url || req.image_url == null || req.image_url.length == 0) return res.status(400).json({ status_code:400, message: (req.isIndo)? `Upload Gambar Wajib Dilakukan!` : "Uploaded Image is Required!" });
        
        const data = req.body;
    
        // Check Data
        for (requiredData of ["problem","allergen_code_number"]){
            // Check Required Data
            if (!(requiredData in data)) return res.status(400).json({status_code:400, message: (req.isIndo)? `${requiredData} Wajib Diisi!` : `${requiredData} is Required!`});
            
            // Check if Empty
            if(data[requiredData].length == 0) return res.status(400).json({status_code:400, message: (req.isIndo)? `${requiredData} Wajib Diisi!` : `${requiredData} is Required!`});
            
            // Convert to String if Problem and Trim Data
            if (requiredData != "allergen_number") data[requiredData] = data[requiredData].toString().trim();
        }
            
        // Wrap Data for Used in Controller
        req.data = data;
    }catch(error){
        return res.status(500).json({ status_code:500, message: error.message });
    }
}