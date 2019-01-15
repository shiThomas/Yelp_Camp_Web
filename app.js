var express    = require("express"),
    app        = express(),
    bodyparser = require("body-parser"),
    mongoose   = require("mongoose"),
    passport   = require("passport"),
    flash      = require("connect-flash"),
    LocalStrategy = require("passport-local"),
    methodOverride = require("method-override"),
    Campground = require("./models/campground"),
    Comment    = require("./models/comment"),
    User       = require("./models/user"),
    seedDB     = require("./models/seeds");
    
//Routes
var commentRoute     = require("./routes/comments"),
    campgroundRoute  = require("./routes/campgrounds"),
    indexRoute       = require("./routes/index");
    
//Seed Campground
// seedDB();

// mongoose.connect("mongodb://localhost:27017/yelp_camp",{useNewUrlParser: true});
mongoose.connect("mongodb://wweswc:wwe123@ds157574.mlab.com:57574/yelpcamp",{useNewUrlParser: true});
//mongodb://wweswc:wwe123@ds157574.mlab.com:57574/yelpcamp
app.use(flash());
app.use(bodyparser.urlencoded({extended:true}));
app.set("view engine","ejs");
app.use(express.static(__dirname+"/public"));
app.use(methodOverride("_method"));
//Passport Confituration
app.use(require("express-session")({
    secret:"Once again",
    resave:false,
    saveUninitialized:false
}));


app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req,res,next){
    res.locals.currentUser=req.user;
    res.locals.error=req.flash("error");
    res.locals.success=req.flash("success");
    next();
});


//code divided into different routes.
app.use(indexRoute);
app.use("/campgrounds",campgroundRoute);
app.use("/campgrounds/:id/comments",commentRoute);


app.listen(process.env.PORT, process.env.IP, function(){
    console.log("YelpCamp Server has started!!");
})