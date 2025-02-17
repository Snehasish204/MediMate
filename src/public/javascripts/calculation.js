const userModel = require("./models/user");
const postModel = require("./models/post");

let user = userModel.findOne({email:req.user.email}).populate("posts");
user.posts.forEach(function(post){
    let timeHours = post.timeHours();
});

document.getElementsByClassName("courseDuration").innerHTML = 20;
console.log(timeHours);