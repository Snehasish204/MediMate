const mongoose = require("mongoose"); 
mongoose.connect("mongodb+srv://snehasishsaren54:<qMCiY9k49g89zt0b>@cluster0.f8aqk.mongodb.net/basic");

const userSchema = mongoose.Schema({
    username: String,
    name:String,
    email:String, 
    age:Number,
    password:String,
    posts:[{type: mongoose.Schema.Types.ObjectId, ref:"post"}],

});
module.exports = mongoose.model("user",userSchema);