const mongoose = require("mongoose");
const postSchema = mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user"
    },
    date:{
        type: Date,
        default: Date.now
    },
    medicineName: String,
    dosage: String,
    timeHours: Number,
    timeMinutes: Number,
    timeSeconds: Number,
    courseDuration: Number,
})
module.exports = mongoose.model("post",postSchema);