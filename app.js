//jshint esversion:6
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

const app = express();

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
    extended: true
}));

mongoose.connect("mongodb://localhost:27017/userDB", {useNewUrlParser: true});

//create full mongoose schema DB
const userSchema = new mongoose.Schema ({
    email: String,  
    password: String
});

const secret = "Thisisourlittlesecret.";
// підключаємо плагін
userSchema.plugin(encrypt, { secret: secret, encryptedFields:["password"] });
//create model
 
const User =  new mongoose.model("User", userSchema);



//target the home route (render my home page)
app.get("/", function(req, res){
    res.render("home");
});

//target the login route (render my login page)
app.get("/login", function(req, res){
    res.render("login");
});

//target the register route (render my register page)
app.get("/register", function(req, res){
    res.render("register");
});

//create /register route
app.post("/register", function(req, res){
    //create brand new user
    const newUser = new User ({
        email: req.body.username,
        password:req.body.password
    });
    newUser.save(function(err){
        if (err){
            console.log(err);
        } else {
res.render("secrets");
        }
    });
});

//create /login route
app.post("/login", function(req, res){
    const username = req.body.username;
    const password = req.body.password

    //email: username -  czy pole email spiwpadae
    // z polem username
User.findOne({email: username}, function(err, foundUser){
if (err){
    console.log(err)
    } else {
        //jaksho isnuje user w bazi danych userDB
        if (foundUser){
            //jaksho u znajdenogo user spiwpadae 
            //z password w DB(bazi danych userDB)

            if (foundUser.password ===password){
res.render("secrets");
            }
        }
    }
});

});


app.listen(3000, function(){
    console.log("Server started on port 3000.");
});