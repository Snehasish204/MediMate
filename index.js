const express = require('express');
const app = express();

app.get("/",(req,res)=>{
    res.send("server chalu hain bhai");
})

app.listen(3000,function(err){
    console.log("It's running");
})