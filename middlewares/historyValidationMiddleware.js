exports.create = () => async (req, res, next) => {
  try {
    const data = req.body;
    
    // Check Data
    for (requiredData of ["allergy","suggest", "suggest_indo", "problem"]){
        // Check Required Data
        if (!(requiredData in data)) return res.status(400).json({status_code:400, message: (req.isIndo)? `${requiredData} Wajib Diisi!` : `${requiredData} is Required!`});
        
        // Check if Empty
        if(data[requiredData].length == 0) return res.status(400).json({status_code:400, message: (req.isIndo)? `${requiredData} Wajib Diisi!` : `${requiredData} is Required!`});
        
        // Convert to String and Trim Data
        data[requiredData] = data[requiredData].toString().trim();
        
        // Check Symbol in Input
        // for History Its Oke Without Check Symbol?
        /*
        for(x of data[requiredData]){
            if(["--", "_", "-", "%", "'", '"', "$", "&", "`", "#", "*"].indexOf(x) != -1)return res.status(400).json({status_code:400, message: `Can't Use ${x} Symbol for Input!`});
        }
        */
    }
        
    // Wrap Data for Used in Controller
    req.data = data;
    
    return next();
  } catch (error) {
    return res.status(500).json({ status_code:500, message: error.message });
  }
};