const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');
const userModel = require("./models/user");
const connectDB = require('./db');
const postModel = require("./models/post");
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const sendEmail = require("./emailService");

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(cookieParser());

app.get("/", (req, res) => {
    res.render("Welcome");
})
app.get("/welcome", (req, res) => {
    res.render("Welcome");
})
app.get("/register-page", (req, res) => {
    res.render("Register");
})
app.get("/profile/add-page", (req, res) => {
    res.render("add");
})
let alarms = [];
async function checkAlarms() {
    const now = new Date();
    let hours = now.getHours();
    let indiaHours = hours + 5;
    let minutes = now.getMinutes();
    let indiaMinutes = minutes + 30;
    let seconds = now.getSeconds().toString().padStart(2, '0');
    if (indiaHours >= 24) {
        indiaHours -= 24;
    }
    if (indiaMinutes >= 60) {
        indiaMinutes -= 60;
        indiaHours += 1;
    }
    let newIndiaHours = indiaHours;
    let newIndiaMinutes = indiaMinutes;
    let currentTime = `${hours}:${minutes}:${seconds}`;
    const posts = await postModel.find({
        timeHours: indiaHours,
        timeMinutes: indiaMinutes,
        timeSeconds: seconds,
    }).populate("user", "email");


    let subject = "Medicine Reminder";
    // console.log(posts);
    // console.log(currentTime);
    for (const post of posts) {
        console.log("⏰ Time to take medicine!");

        --post.courseDuration;
        let text = `Take Medicine ${post.medicineName} ,Dosage:${post.dosage}, remaining course duration:${post.courseDuration} days`;
        sendEmail(post.user.email, subject, text);
        console.log("Remaining course duration:", post.courseDuration);

        if (post.courseDuration === 0) {
            posts = posts.filter(a => a !== posts); // Remove expired alarms
        }

    };
}

// Start the clock check (runs every second)
setInterval(checkAlarms, 1000);
// Function to check and trigger alarms

console.log("hello");


app.post("/profile/add", isLoggedIn, async (req, res) => {
    let user = await userModel.findOne({ email: req.user.email });
    let { medicineName, dosage, timeHours, timeMinutes, courseDuration } = req.body;
    let post = await postModel.create({
        user: user._id,
        medicineName,
        dosage,
        timeHours,
        timeMinutes,
        timeSeconds: 0,
        courseDuration,
    })
    user.posts.push(post._id);
    await user.save();
    let to = req.user.email;
    // Add new alarm dynamically
    let alarmTime = `${timeHours.toString().padStart(2, '0')}:${timeMinutes.toString().padStart(2, '0')}:00`;

    let subject = "Medicine Reminder";
    alarms.push({ time: alarmTime, medName: medicineName, dosage: dosage, cDuration: courseDuration, subject: subject, to: to });

    res.redirect("/profile/status");
})

app.get("/profile/status", isLoggedIn, async (req, res) => {
    let user = await userModel.findOne({ email: req.user.email }).populate("posts");
    res.render("status", { user });

})
app.post("/register", async (req, res) => {
    let { email, password, username, name, age } = req.body;
    let user = await userModel.findOne({ email });
    if (user) return res.status(500).send("User already registered");

    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(password, salt, async (err, hash) => {
            let user = await userModel.create({
                username,
                email,
                age,
                name,
                password: hash,
            });
            let token = jwt.sign({ email: email, userid: user._id }, "shhhh");
            res.cookie("token", token);
            res.redirect("profile/add-page");

        })
    })
});
app.get("/login-page", (req, res) => {
    res.render("login");
});
app.get("/error-login-page", (req, res) => {
    res.render("errLogin");
});
app.post('/login', async (req, res) => {
    let { email, password } = req.body;
    let user = await userModel.findOne({ email });
    if (!user) return res.status(500).send("something went wrong");
    bcrypt.compare(password, user.password, function (err, result) {
        if (result) {
            let token = jwt.sign({ email: email, userid: user._id }, "shhhh");
            res.cookie("token", token);
            // res.send("logged in successfully");
            res.redirect("profile/add-page");
        }
        else {
            res.redirect("/error-login-page");
        }
    })
})
function isLoggedIn(req, res, next) {
    if (req.cookies.token === "") {
        res.send("You must be logged in");
    }
    else {
        let data = jwt.verify(req.cookies.token, "shhhh");
        req.user = data;
        next();
    }
}
app.get('/logout', (req, res) => {
    res.cookie("token", "");
    res.redirect("/login-page");
})
const port = process.env.PORT || 4000;
let specificIP = "172.16.106.40";
connectDB.then(() => {
    app.listen(port, function (err) {

        console.log("It's running");
    });

})
