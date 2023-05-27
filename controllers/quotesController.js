const Quote = require("../models/Quote");

exports.getQuotes = async (req, res) => {
    // Cek User Login
    if (!req.user || req.user == null || req.user.length == 0) return res.status(401).json({ status_code:401, message: (req.isIndo)? "Pengguna Belum Terautentikasi!" : "User Not Authenticated!" });

  // Get All quotes
  try {
    // Get All Doc
    const quotesDocs = await Quote.get();
    
    // If quotes Not Found
    if (quotesDocs.empty) return res.status(404).json({ status_code: 404, message: (req.isIndo)? "Quotes Tidak Ditemukan!" : "Quotes Not Found!" });
    
    // Populate Doc
    const quotes = []
    // Determine Which Language Will Data Response
    if (req.isIndo){
        quotesDocs.forEach((doc) => quotes.push({id: doc.id, author:doc.data()['author'], quote: doc.data()['quote_indo']}));
    }else{
        quotesDocs.forEach((doc) => quotes.push({id: doc.id, author:doc.data()['author'], quote: doc.data()['quote']}));
    }
    

    return res.status(200).json({ status_code: 200, message: (req.isIndo)? "Berhasil Mengambil Quotes!" : "Success Get Quotes!", data: quotes });
    
  } catch (error) {
    return res.status(500).json({ status_code: 500, message: error.message });
  }
};