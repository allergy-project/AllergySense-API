const express = require("express");
const app = express();
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
require("dotenv").config();
const authRoutes = require("./routes/auth");
const historiesRoutes = require("./routes/histories");
const profileRoutes = require("./routes/profile");
const quotesRoutes = require("./routes/quotes");
const mlRoutes = require("./routes/ml");
const checkLanguage = require("./middlewares/checkLanguageMiddleware");
const Allergy = require("./models/Allergy");

// For testing(Dont do In Production)
//const {admin, fbconf} = require("./config/firebase");

// Security Config
app.set("trust proxy", 1);
app.use(helmet());
app.use(cors());

// Config Limiter
const limiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 100,
});
app.use(limiter);

// Middleware Config
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(checkLanguage);

// Routes
app.get("/", (req, res) => res.send("API RUN"));
app.get("/api/v1/", (req, res) => res.send("API RUN"));
app.get("/api/v1/documentation", (req, res) => res.redirect("https://documenter.getpostman.com.view/18201966/2s93m8xKWN"))
app.use("/api/v1", authRoutes );
app.use("/api/v1/histories", historiesRoutes );
app.use("/api/v1/profile", profileRoutes );
app.use("/api/v1/quotes", quotesRoutes );
app.use("/api/v1/ml", mlRoutes );
app.get("/api/v1/seed-db", (req, res) => {
    const data = [[0, 'Almond', 'Almond', 'Nut Allergy'], [1, 'Apple', 'Apel', 'Oral Allergy Syndrome'], [2, 'Apricot', 'Aprikot', 'Stone Fruit Allergy'], [3, 'Artichoke', 'Artichoke', 'Insulin Allergy'], [4, 'Asparagus', 'Asparagus', 'Allium Allergy'], [5, 'Avocado', 'Alpukat', 'Oral Allergy Syndrome'], [6, 'Bamboo shoot', 'Tunas bambu', 'Histamine Allergy'], [7, 'Banana', 'Pisang', 'Banana Allergy'], [8, 'Barley', 'Barley', 'Gluten Allergy'], [9, 'Bean', 'Kacang', 'Legume Allergy'], [10, 'Blackberry', 'Blackberry', 'Salicylate Allergy'], [11, 'Black-eyed bean', 'Kacang merah', 'Legume Allergy'], [12, 'Blueberry', 'Blueberry', 'Salicylate Allergy'], [13, 'Bonito', 'Bonito', 'Histamine Allergy'], [14, 'Broad bean', 'Kacang panjang', 'Legume Allergy'], [15, 'Broccoli', 'Broccoli', 'Broccoli allergy'], [16, 'Brussels sprouts', 'Kembang kol Brussel', 'Cruciferous Allergy'], [17, 'Buckwheat', 'Buckwheat', 'Gluten Allergy'], [18, 'Burdock', 'Burdock', 'Ragweed Allergy'], [19, 'Butter', 'Mentega', 'Milk allergy / Lactose intolerance'], [20, 'Butter bean', 'Kacang butter', 'Legume Allergy'], [21, 'Buttermilk', 'Susu mentega', 'Milk allergy / Lactose intolerance'], [22, 'Button mushroom', 'Jamur kancing', 'Mushroom Allergy'], [23, 'Cabbage', 'Kubis', 'Cruciferous Allergy'], [24, 'Carrot', 'Wortel', 'Hypersensitivity'], [25, 'Casein', 'Kasein', 'Milk allergy / Lactose intolerance'], [26, 'Cattle', 'Sapi', 'Alpha-gal Syndrome'], [27, 'Cauliflower', 'Kembang kol', 'Cruciferous Allergy'], [28, 'Celery', 'Seledri', 'Hypersensitivity'], [29, 'Cheese', 'Keju', 'Milk allergy / Lactose intolerance'], [30, 'Cherry', 'Ceri', 'Stone Fruit Allergy'], [31, 'Chestnut', 'Kastanye', 'Nut Allergy'], [32, 'Chicken', 'Ayam', 'Poultry Allergy'], [33, 'Chicory', 'Cikori', 'Insulin Allergy'], [34, 'Chinese cabbage', 'Kubis Cina', 'Cruciferous Allergy'], [35, 'Coffee bean', 'Biji kopi', 'Ochratoxin Allergy'], [36, 'Corn', 'Jagung', 'Corn Allergy'], [37, 'Cotton seed', 'Biji kapas', 'Seed Allergy'], [38, 'Cranberry', 'Cranberry', 'Salicylate Allergy'], [39, 'Cream', 'Krim', 'Milk allergy / Lactose intolerance'], [40, 'Crustaceans', 'Krustasea', 'Shellfish Allergy'], [41, 'Custard', 'Custard', 'Milk allergy / Lactose intolerance'], [42, 'Date', 'Kurma', 'Oral Allergy Syndrome'], [43, 'Deer', 'Rusa', 'Alpha-gal Syndrome'], [44, 'Duck', 'Bebek', 'Poultry Allergy'], [45, 'Eel', 'Belut', 'Fish Allergy'], [46, 'Eggplant', 'Terong', 'Nightshade Allergy'], [47, 'Eggs', 'Telur', 'Poultry Allergy'], [48, 'Endive', 'Endive', 'Insulin Allergy'], [49, 'Fructose', 'Fruktosa', 'Sugar Allergy / Intolerance'], [50, 'Garlic', 'Bawang putih', 'Allium Allergy'], [51, 'Ginger', 'Jahe', 'Histamine Allergy'], [52, 'Ginkgo nut', 'Kacang ginkgo', 'Nut Allergy'], [53, 'Globfish', 'Ikan glob', 'Fish Allergy'], [54, 'Glucose', 'Glukosa', 'Sugar Allergy / Intolerance'], [55, 'Goat', 'Kambing', 'Alpha-gal Syndrome'], [56, 'Grape', 'Anggur', 'LTP Allergy'], [57, 'Grapefruit', 'Jeruk grapefruit', 'Citrus Allergy'], [58, 'Green soybean', 'Kedelai hijau', 'Legume Allergy'], [59, 'Guava', 'Jambu biji', 'Oral Allergy Syndrome'], [60, 'Honey', 'Madu', 'Honey Allergy'], [61, 'Hop', 'Hop', 'Beer Allergy'], [62, 'Horse', 'Kuda', 'Alpha-gal Syndrome'], [63, 'Horse Mackerel', 'Ikan kembung', 'Fish Allergy'], [64, 'Horseradish', 'Lobak', 'Cruciferous Allergy'], [65, 'Huckleberry', 'Huckleberry', 'Salicylate Allergy'], [66, 'Ice cream', 'Es krim', 'Milk allergy / Lactose intolerance'], [67, 'Japanese pear', 'Pir Jepang', 'Oral Allergy Syndrome'], [68, 'Japanese plum', 'Prem Jepang', 'Stone Fruit Allergy'], [69, 'Kale', 'Kale', 'Cruciferous Allergy'], [70, 'Kidney bean', 'Kacang merah', 'Legume Allergy'], [71, 'Kiwi', 'Kiwi', 'Oral Allergy Syndrome'], [72, 'Konjac', 'Konjac', 'Potato Allergy'], [73, 'Kyona', 'Kyona', 'Cruciferous Allergy'], [74, 'Lactose', 'Laktosa', 'Lactose Intolerance'], [75, 'Leek', 'Bawang daun', 'Allium Allergy'], [76, 'Lemon', 'Lemon', 'Citrus Allergy'], [77, 'Lentil', 'Kacang lentil', 'Legume Allergy'], [78, 'Lettuce', 'Selada', 'LTP Allergy'], [79, 'Lima bean', 'Kacang lima', 'Legume Allergy'], [80, 'Lime', 'Jeruk nipis', 'Citrus Allergy'], [81, 'Loquat', 'Loquat', 'Oral Allergy Syndrome'], [82, 'Mackerel', 'Ikan mackerel', 'Fish Allergy'], [83, 'Mango', 'Mangga', 'Oral Allergy Syndrome'], [84, 'Milk', 'Susu', 'Milk allergy / Lactose intolerance'], [85, 'Mineral water', 'Air mineral', 'Aquagenic Urticaria'], [86, 'Mitsuba', 'Mitsuba', 'Hypersensitivity'], [87, 'Mume plum', 'Prem Mume', 'Stone Fruit Allergy'], [88, 'Mustard Spinach', 'Bayam mustar', 'Cruciferous Allergy'], [89, 'Nectarine', 'Nektarin', 'Stone Fruit Allergy'], [90, 'Nira', 'Nira', 'Allium Allergy'], [91, 'Okra', 'Okra', 'Histamine Allergy'], [92, 'Onion', 'Bawang bombay', 'Allium Allergy'], [93, 'Orange', 'Jeruk', 'Citrus Allergy'], [94, 'Orange pulp', 'Daging jeruk', 'Citrus Allergy'], [95, 'Papaya', 'Pepaya', 'Oral Allergy Syndrome'], [96, 'Parsley', 'Peterseli', 'Hypersensitivity'], [97, 'Parsnip', 'Parsnip', 'Hypersensitivity'], [98, 'Passion fruit', 'Buah markisa', 'Oral Allergy Syndrome'], [99, 'Peach', 'Persik', 'Stone Fruit Allergy'], [100, 'Peanut', 'Kacang tanah', 'Peanut Allergy'], [101, 'Pear', 'Pir', 'Oral Allergy Syndrome'], [102, 'Peas', 'Kacang polong', 'Legume Allergy'], [103, 'Peas', 'Kacang polong', 'Legume Allergy'], [104, 'Pecan', 'Pecan', 'Nut Allergy'], [105, 'Pegia', 'Pegia', 'Legume Allergy'], [106, 'Peppermint', 'Peppermint', 'Mint Allergy'], [107, 'Percifomes', 'Percifomes', 'Fish Allergy'], [108, 'Pig', 'Babi', 'Alpha-gal Syndrome'], [109, 'Pineapple', 'Nanas', 'Oral Allergy Syndrome'], [110, 'Popcorn', 'Popcorn', 'Corn Allergy'], [111, 'Potato', 'Kentang', 'Potato Allergy'], [112, 'Prune', 'Prem', 'Stone Fruit Allergy'], [113, 'Qing-geng-cai', 'Qing-geng-cai', 'Cruciferous Allergy'], [114, 'Quince', 'Quince', 'Oral Allergy Syndrome'], [115, 'Radish root', 'Akar lobak', 'Hypersensitivity'], [116, 'Rapeseed', 'Biji rami', 'Seed Allergy'], [117, 'Raspberry', 'Raspberry', 'Salicylate Allergy'], [118, 'Rice', 'Beras', 'Rice Allergy'], [119, 'Royal Jelly', 'Royal Jelly', 'Honey Allergy'], [120, 'Rye', 'Gandum rye', 'Gluten Allergy'], [121, 'Safflower seed', 'Biji safflower', 'Seed Allergy'], [122, 'Salmon', 'Salmon', 'Fish Allergy'], [123, 'Salsify', 'Salsify', 'Insulin Allergy'], [124, 'Sansho', 'Sansho', 'Pepper Allergy'], [125, 'Sea Bass', 'Ikan Kakap', 'Fish Allergy'], [126, 'Sea Bream', 'Ikan Bawal', 'Fish Allergy'], [127, 'Sesame seed', 'Biji wijen', 'Seed Allergy'], [128, 'Shallot', 'Bawang merah', 'Allium Allergy'], [129, 'Sheep', 'Domba', 'Alpha-gal Syndrome'], [130, 'Shelled mollusc', 'Moluska berkulit', 'Fish Allergy'], [131, 'Shiitake mushroom', 'Jamur shiitake', 'Mushroom Allergy'], [132, 'Shungiku', 'Shungiku', 'Insulin Allergy'], [133, 'Sour cream', 'Krim asam', 'Milk allergy / Lactose intolerance'], [134, 'Soybean', 'Kedelai', 'Soy Allergy'], [135, 'Spearmint', 'Spearmint', 'Mint Allergy'], [136, 'Spinach', 'Bayam', 'Histamine Allergy'], [137, 'Strawberry', 'Stroberi', 'Salicylate Allergy'], [138, 'Sugar', 'Gula', 'Sugar Allergy / Intolerance'], [139, 'Sugar beet', 'Beet gula', 'Sugar Allergy / Intolerance'], [140, 'Sugarcane', 'Tebu', 'Sugar Allergy / Intolerance'], [141, 'Sultani', 'Sultani', 'Legume Allergy'], [142, 'Sultapya', 'Sultapya', 'Legume Allergy'], [143, 'Sunflower seed', 'Biji bunga matahari', 'Seed Allergy'], [144, 'Sweet corn', 'Jagung manis', 'Corn Allergy'], [145, 'Sweet Pepper', 'Paprika manis', 'Nightshade Allergy'], [146, 'Sweet potato', 'Ubi jalar', 'Potato Allergy'], [147, 'Taro', 'Taro', 'Potato Allergy'], [148, 'Tea', 'Teh', 'Tannin Allergy'], [149, 'Tetraodontiformes', 'Tetraodontiformes', 'Fish Allergy'], [150, 'Tomato', 'Tomat', 'Nightshade Allergy'], [151, 'Trout', 'Ikan trout', 'Fish Allergy'], [152, 'Tuna', 'Tuna', 'Fish Allergy'], [153, 'Turkey', 'Ayam kalkun', 'Poultry Allergy'], [154, 'Turnip root', 'Akar lobak', 'Thyroid'], [155, 'Walnut', 'Kenari', 'Nut Allergy'], [156, 'Welsh', 'Welsh', 'Allium Allergy'], [157, 'Wheat', 'Gandum', 'Gluten Allergy'], [158, 'Whey', 'Whey', 'Milk allergy / Lactose intolerance'], [159, 'White bean', 'Kacang putih', 'Legume Allergy'], [160, 'Yam', 'Ubi jalar', 'Potato Allergy'], [161, 'Yogurt', 'Yogurt', 'Milk allergy / Lactose intolerance']];
    
    for (item of data){
        Allergy.add({
            allergen_code_number: item[0],
            allergen: item[1],
            allergen_indo: item[2],
            allergy: item[3]
        });
    }
    
    res.status(200).send("Upload Data Berhasil");
})

app.listen(process.env.PORT || 4000, () => {
    console.log("Server Running In Port: "+process.env.PORT);
    // Dont do In Production(To Check ENV in Cloud Run/GCP)
    //console.log(admin.apps.length)
    //console.log(fbconf)
    });