const Quote = require("../models/Quote");

exports.getQuote = async (req, res) => {
    // Cek User Login
    if (!req.user || req.user == null || req.user.length == 0) return res.status(401).json({ status_code:401, message: (req.isIndo)? "Pengguna Belum Terautentikasi!" : "User Not Authenticated!" });

  // Get All quotes
  try {
    // Get All Doc
    const quotesDocs = await Quote.get();
    
    // If quotes Not Found
    if (quotesDocs.empty) return res.status(404).json({ status_code: 404, message: (req.isIndo)? "Quotes Tidak Ditemukan!" : "Quotes Not Found!" });
    
    // Populate Doc
    const quotes = [];
    quotesDocs.forEach((doc) => quotes.push({id: doc.id, ...doc.data()}));
    
    // Get Random Index
    const index = Math.floor(Math.random() * 10);
    
    // Determine Which Language Will Data Response and Take Only One Data
    let quote = {}
    if (req.isIndo){
        quote = {id: quotes[index].id, author: quotes[index].author, quote: quotes[index].quote_indo};
    }else{
        quote = {id: quotes[index].id, author: quotes[index].author, quote: quotes[index].quote};
    }
    
    return res.status(200).json({ status_code: 200, message: (req.isIndo)? "Berhasil Mengambil Quotes!" : "Success Get Quotes!", data: quote });
    
  } catch (error) {
    return res.status(500).json({ status_code: 500, message: error.message });
  }
};