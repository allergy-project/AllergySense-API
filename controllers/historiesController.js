const User = require("../models/User")
const History = require("../models/History")


exports.getHistories = async (req, res) => {
    // Cek User Login
    if (!req.user || req.user == null || req.user.length == 0) return res.status(401).json({ status_code:401, message: (req.isIndo)? `Pengguna Belum Terautentikasi!` : "User Not Authenticated!" });
  
   // Get User Id from Middleware
   const user_id = req.user.id;

  // Get All Histories
  try {
    // Get All Doc
    const historiesDocs = await History.where("user_id", "==", user_id).get();
    
    // If Histories Not Found
    if (historiesDocs.empty) return res.status(404).json({ status_code: 404, message: (req.isIndo)? `Histories/Riwayat Tidak Ditemukan!` :"Histories Not Found!" });
    
    // Populate Doc
    const histories = []
    // Determine Which Language Will Data Response
    if (req.isIndo){
        historiesDocs.forEach((doc) => {
            const history = doc.data();
            history.suggest = history.suggest_indo;
            delete history.suggest_indo;
            histories.push({id: doc.id, ...history})
        });
    }else{
        historiesDocs.forEach((doc) => {
            const history = doc.data();
            delete history.suggest_indo;
            histories.push({id: doc.id, ...history})
        });
    }
    

    return res.status(200).json({ status_code: 200, message: (req.isIndo)? `Berhasil Mengambil Histories/Riwayat!` : "Success Get Histories!", data: histories });
    
  } catch (error) {
    return res.status(500).json({ status_code: 500, message: error.message });
  }
};

exports.getHistoryById = async (req, res) => {
  // Cek User Login
  if (!req.user || req.user == null || req.user.length == 0) return res.status(401).json({ status_code:401, message: (req.isIndo)? `Pengguna Belum Terautentikasi!` : "User Not Authenticated!" });
  
  // Get User Id from Middleware
  const user_id = req.user.id;
  
  // Get History Id
  const { id } = req.params;

  // Get History
  try {
    // Get History Doc
    const historyDoc = await History.doc(id).get();

    // If History Not Found
    if (!historyDoc.exists) return res.status(404).json({ status_code:404, message: (req.isIndo)? `History/Riwayat Tidak Ditemukan!` : "History Not Found!" });
    
    // Populate Data
    let history = historyDoc.data();
    
    // Check did This History Owned by User
    if(history.user_id != user_id) return res.status(403).json({status_code:403, message: (req.isIndo)? `Sumber Daya Tidak Dapat Diakses oleh Anda!` : "Resource Not Accesssible!"})
        
    // Determine Which Language Will Data Response
    if (req.isIndo){
        history.suggest = history.suggest_indo;
        delete history.suggest_indo;
    }else{
        delete history.suggest_indo;
    }

    return res.status(200).json({ status_coe:200, message: (req.isIndo)? `Berhasil Mengambil History/Riwayat!` : "Success Get History!", data: history });
    
  } catch (error) {
    return res.status(500).json({ status_code: 500, message: error.message });
  }
};

exports.createHistory = async (req, res) => {
  // Cek User Login
  if (!req.user || req.user == null || req.user.length == 0) return res.status(401).json({ status_code:401, message: (req.isIndo)? `Pengguna Belum Terautentikasi!` : "User Not Authenticated!" });

  // Get User Id from Middleware
  const user_id = req.user.id;
  
  // Check Image Uploaded
  if (!req.image_url || req.image_url == null || req.image_url.length == 0) return res.status(400).json({ status_code:400, message: (req.isIndo)? `Upload Gambar Wajib Dilakukan!` : "Uploaded Image is Required!" });
  
  try {
    // Data for Created At(Unixtime)
    const created_at = Date.now(); 
    
    // Create History
    const historyDoc = await History.add({ ...req.data, created_at, user_id: req.user.id, image_url: req.image_url });
    
    return res.status(201).json({ status_code: 201, message: (req.isIndo)? `History/Riwayat Berhasil Dibuat!` : "History Created!", data: {history_id: historyDoc.id} });
    
  } catch (error) {
    return res.status(500).json({ status_code: 500, message: error.message });
  }
};

exports.deleteHistory = async (req, res) => {
   // Cek User Login
  if (!req.user || req.user == null || req.user.length == 0) return res.status(401).json({ status_code:401, message: (req.isIndo)? `Pengguna Belum Terautentikasi!` : "User Not Authenticated!" });

  // Get User Id from Middleware
  const user_id = req.user.id;
  
  // Get History Id
  const { id } = req.params;
  
  try {
   // Get History Doc
   const historyDoc = await History.doc(id).get();

   // If History Not Found
   if (!historyDoc.exists) return res.status(404).json({ status_code:404, message: (req.isIndo)? `History/Riwayat Tidak Ditemukan!` : "History Not Found! "});
    
   // Populate Data
   const history = historyDoc.data();
    
   // Check did This History Owned by User
   if(history.user_id != user_id) return res.status(403).json({status_code:403, message: (req.isIndo)? `Sumber Daya Tidak Bisa Diakses oleh Anda!` : "Resource Not Accesssible!"})
       
   // Delete History
   await History.doc(id).delete();

   return res.status(200).json({ status_code:200, message: (req.isIndo)? `History/Riwayat Berhasil Dihapus!` : "Success Delete History!" });
    
 } catch (error) {
   return res.status(500).json({ status_code: 500, message: error.message });
 }
};

