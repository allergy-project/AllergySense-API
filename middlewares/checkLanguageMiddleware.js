const checkLanguage = (req, res, next) => {
    try{
        if (req.query.lang && req.query.lang == "id"){
            req.isIndo = true;
            return next();
        }
        return next();
    }catch(error){
        return res.status(500).json({ status_code:500 ,message: error.message });
    }
};

module.exports = checkLanguage;