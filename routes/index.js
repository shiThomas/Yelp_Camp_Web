var express = require("express");
var router  = express.Router({mergeParams:true});
var User    = require("../models/user");
var passport= require("passport");

//Root Route
router.get("/", function(req, res){
   res.render("landing");
});


//Register Logic
router.post("/register",function(req,res){
    var newUser = new User({username:req.body.username});
    User.register(newUser,req.body.password,function(err,user){
        if(err){
            req.flash("error",err);
            return res.render("register");
        } else{
            passport.authenticate("local")(req,res,function(){
                req.flash("success","Welcome to YelpCamp "+user.username);
                res.redirect("/campgrounds")
            })
        }
    })
})

//Register Form Route
router.get("/register",function(req,res){
    res.render("register")
})


//Login Form
router.get("/login",function(req,res){
    res.render("login");
})

//Login Logic
router.post("/login", passport.authenticate("local", {
    successRedirect: "/campgrounds",
    failureRedirect: "/login"
}) ,function(req, res){
});

//Logout
router.get("/logout",function(req,res){
    req.logout();
    req.flash("success","Logged You Out!");
    res.redirect("campgrounds");
    
})


//export
module.exports = router;