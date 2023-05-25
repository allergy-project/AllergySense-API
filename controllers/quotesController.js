const Quote = require("../models/Quote");

exports.getQuotes = async (req, res) => {
    // Cek User Login
    if (!req.user || req.user == null || req.user.length == 0) return res.status(401).json({ status_code:401, message: "User Not Authenticated!" });

  // Get All quotes
  try {
    // Get All Doc
    const quotesDocs = await Quote.get();
    
    // If quotes Not Found
    if (quotesDocs.empty) return res.status(404).json({ status_code: 404, message: "Quotes Not Found!" });
    
    // Populate Doc
    const quotes = []
    quotesDocs.forEach((doc) => quotes.push({id: doc.id, ...doc.data()}));

    return res.status(200).json({ status_code: 200, message: "Success Get Quotes!", data: quotes });
    
  } catch (error) {
    return res.status(500).json({ status_code: 500, message: error.message });
  }
};