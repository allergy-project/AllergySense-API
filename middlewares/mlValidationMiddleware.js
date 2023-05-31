exports.allergyDetection = () => async (req, res, next) => {
    try{
        // Check Image Uploaded
        if (!req.file || req.file == null || req.file.length == 0) return res.status(400).json({ status_code:400, message: (req.isIndo)? `Upload Gambar Wajib Dilakukan!` : "Uploaded Image is Required!" });
        
        const data = req.body;
    
        // Check Data
        for (requiredData of ["problem","allergen_code_number"]){
            // Check Required Data
            if (!(requiredData in data)) return res.status(400).json({status_code:400, message: (req.isIndo)? `${requiredData} Wajib Diisi!` : `${requiredData} is Required!`});
            
            // Check if Empty
            if(data[requiredData].length == 0) return res.status(400).json({status_code:400, message: (req.isIndo)? `${requiredData} Wajib Diisi!` : `${requiredData} is Required!`});
            
            // Convert to String if Problem and Trim Data
            if (requiredData != "allergen_code_number") data[requiredData] = data[requiredData].toString().trim();
        }
            
        // Check allergen_code_number must in range 0 - 161
        if (data["allergen_code_number"] < 0 || data["allergen_code_number"] < 161) return res.status(400).json({ status_code:400, message: (req.isIndo)? `Masukan Allergen/Bahan Makanan Sesuai Jangkauan!` : "Input Allergen/Ingredient According Given Scope!" });
        
        // Wrap Data for Used in Controller
        req.data = data;
        
        return next();
    }catch(error){
        return res.status(500).json({ status_code:500, message: error.message });
    }
}