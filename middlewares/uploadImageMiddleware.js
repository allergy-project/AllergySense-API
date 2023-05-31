const { Storage } = require('@google-cloud/storage');
const {PRIVATE_KEY_BUCKET} = JSON.parse(process.env.PRIVATE_KEY_BUCKET);
const crypto = require("crypto");
const Multer = require('multer');

// Multer Error Handling
exports.multerErrorHandler = () => (err, req, res, next) => {
    if (err instanceof Multer.MulterError){
        // If Input Field Name for Uploading File Wrong
        if (err.message == "Unexpected field") return res.status(500).json({ status_code: 500, message: (req.isIndo)? "Nama Field untuk Input File Salah!" : "Input Field Name for File Wrong!" });
        
        // If File Size to Large
        if (err.message == "File too large") return res.status(400).json({ status_code: 400, message: (req.isIndo)? "Ukuran File Melebihi Batas(5 MB)!" : "File Size Exceed Limit(5 MB)!" });

        return res.status(500).json({ status_code: 500, message: err.message });
    } else{
        return next(err);
    }
}

// Upload Image to Cloud Storage Bucket
exports.uploadToGCS = (bucketTarget = "blank", dontUpload=false) => async (req, res, next) => {
    try{
        // Configure the storage client with the loaded credentials
        const storageOptions = {
          projectId: process.env.PROJECT_ID,
          credentials: {
            client_email: process.env.CLIENT_EMAIL_BUCKET,
            private_key: PRIVATE_KEY_BUCKET,
          },
        };
        const storageClient = new Storage(storageOptions);
        
        const file = req.file;
        
        // Check File Exist
        //if(!file) return res.status(400).json({status_code:400, message:"No Image File Provided!"});
        if(!file) return next();
        
        // Check File is Image or Not
        const fileExtension = file.originalname.split(".").pop().toLowerCase();
        if (["png", "jpg","jpeg"].indexOf(fileExtension) == -1 ) return res.status(400).json({ status_code:400, message: (req.isIndo)? "Upload File dalam Format Gambar(png, jpg, jpeg)!" : 'Only Upload File in Image Format(png, jpg, jpeg)!' });
        
        // If Dont Want Upload to GCS(Just Want to Validate File)
        if (dontUpload) return next();
        
        // Generate Random String for Image Name
        const imageName = crypto.randomBytes(10).toString("hex");
        
        // Determine Where Bucket Should Targeted
        let bucketName = ""
        if (bucketTarget.toLowerCase() == "profile"){
            bucketName = process.env.BUCKET_NAME_PROFILE;
        }else if(bucketTarget.toLowerCase() == "histories"){
            bucketName = process.env.BUCKET_NAME_HISTORIES;
        }else{
            return res.status(500).json({ status_code:500, message: (req.isIndo)? "Pilih Bucket Mana yang Akan Jadi Tempat Gambar Diupload!" : 'Select Which Bucket Image Will Uploaded!' });
        }
        
        // Upload the image file to Google Cloud Storage
        const bucket = storageClient.bucket(bucketName);
        const blob = bucket.file(imageName+"."+fileExtension);
        const blobStream = blob.createWriteStream();

        blobStream.on('error', (err) => {
          console.error(err);
          res.status(500).json({ status_code:500, message: (req.isIndo)? "Error Ketika Upload Gambar!" : 'Error Uploading Image!' });
        });

        blobStream.on('finish', () => {
          const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
          req.image_url = publicUrl;
          next();
        });

        blobStream.end(file.buffer);
    }catch(error){
        return res.status(500).json({ status_code:500, message: error.message });
    }
};

