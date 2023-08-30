//jshint esversion:6
require('dotenv').config();
const express = require("express"); //npm i express.js
const bodyParser = require("body-parser"); //npm i body-parser
const ejs = require("ejs"); // npm i ejs
const mongoose = require("mongoose"); // npm i mongoose
const encrypt = require("mongoose-encryption"); // npm i mongoose-encryption
const app = express();

console.log(process.env.API_KEY);

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
    extended: true
}));

mongoose.connect('mongodb+srv://admin-zumrud:Test123@cluster0.f14wlq0.mongodb.net/userDB', { useNewUrlParser: true });

const userSchema = new mongoose.Schema({ // create from mongoose Schema class
    email: String,
    password: String
});

userSchema.plugin(encrypt, { requireAuthenticationCode: false, secret: process.env.SECRET, encryptedFields: ["password"] }); // encrypt our password database

const User = new mongoose.model("User", userSchema);

app.get("/", function(req, res) {
    res.render("home");
});

app.get("/login", function(req, res) {
    res.render("login");
});

app.get("/register", function(req, res) {
    res.render("register");
});

app.post("/register", function(req, res) {
    const newUser = new User({
        email: req.body.username,
        password: req.body.password
    });

    newUser.save()
        .then(() => {
            res.render("secrets");
        })
        .catch((err) => {
            console.log(err);
        });
});

app.post("/login", function(req, res) {
    const username = req.body.username;
    const password = req.body.password;

    User.findOne({ email: username })
        .then((foundUser) => {
            if (foundUser) {
                if (foundUser.password === password) {
                    res.render("secrets");
                }
            }
        })
        .catch((err) => {
            console.log(err);
        });
});

app.listen(3000, function() {
    console.log("Server started on port 3000.");
});