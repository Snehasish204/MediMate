const mongoose = require("mongoose");
async function connectDB(){
    try {
        
       await  mongoose.connect("mongodb+srv://snehasishsaren54:qMCiY9k49g89zt0b@cluster0.f8aqk.mongodb.net/basic");
        
    } catch (error) {
        console.error("Mongo Connection error",error);
    }

}
module.exports = connectDB();