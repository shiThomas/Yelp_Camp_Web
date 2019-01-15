var express = require("express");
var router  = express.Router({mergeParams:true});
var Campground = require("../models/campground");
var middleware = require("../middleware");


//INDEX -- Show all campgrounds
router.get("/",function(req,res){
    //Get all campgrounds from Database
    Campground.find({},function(err,allcampgrounds){
        if(err){
            console.log(err);
        } else{
              res.render("campgrounds/index",{campgrounds:allcampgrounds});
        }
    });
})
   
//CREATE -- Add new campgrounds to database
router.post("/",isLoggedIn,function(req,res){
    var name = req.body.name;
    var price = req.body.price;
    var image  = req.body.image;
    var description = req.body.description;
    var author = {
        id:req.user._id,
        username:req.user.username
    }
    var new_campground = {name:name, price:price,image:image,description:description,author:author};
    //Create a new campground, and add to database
    Campground.create(new_campground,function(err,newcamp){
        if(err){
            console.log(err);
        } else{
             //redirect to campgrounds page
             res.redirect("campgrounds");
        }
    });
   
})

//NEW -- Show form to create new campgrounds
router.get("/new",middleware.isLoggedIn, function(req,res){
    res.render("campgrounds/new");
})

//SHOW -- Show more info about one campground
router.get("/:id", function(req,res){
    Campground.findById(req.params.id).populate("comments").exec(function(err,foundcampground){
        if(err){
            console.log(err);
        } else{
            console.log(foundcampground);
            res.render("campgrounds/show",{campground:foundcampground})
        }
    })
    
})

//Middleware
function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

//EDIT Campground Routes
router.get("/:id/edit",middleware.checkCampgroundOwnership, function(req,res){
    Campground.findById(req.params.id,function(err,foundcampground){
    res.render("campgrounds/edit",{campground:foundcampground});
    });
});

//UPDATE Campground Routes
router.put("/:id",middleware.checkCampgroundOwnership,function(req,res){
    Campground.findByIdAndUpdate(req.params.id,req.body.campground,function(err,updatedCampgruond){
        if(err){
            res.redirect("/campgrounds");
        } else{
            res.redirect("/campgrounds/"+req.params.id);
        }
    
    })
})

//DESTROY Campground Routes
router.delete("/:id",middleware.checkCampgroundOwnership,function(req,res){
    Campground.findByIdAndRemove(req.params.id,function(err){
        if(err){
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds");
        }
    })
})


//export
module.exports = router;