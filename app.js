if (process.env.NODE_ENV != "production") {
    require('dotenv').config();
}

const express = require("express");
const app = express();
const mongoose = require('mongoose');
const path = require("path");
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
const { render } = require("ejs");
let methodOverride = require('method-override');
app.use(methodOverride('_method'));
const ejsMate = require('ejs-mate');
app.engine('ejs', ejsMate);
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/users.js");
// Express Route
const listingsRouter = require("./routes/listings.js");
const reviewsRouter = require("./routes/reviews.js");
const userRouter = require("./routes/user.js");

const dburl = process.env.ATLASDB_URL;

main()
    .then((res) => {
        console.log("connected");
    })
    .catch(err => console.log(err));

async function main() {
    await mongoose.connect(dburl);
}

const store = MongoStore.create({
    mongoUrl: dburl,
    crypto: {
        secret: process.env.SECRET,
    },
    touchAfter: 24 * 3600,
});
store.on("error", () => {
    console.log("mongo session error");
});
// express session
const sessionOption = {
    store: store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    }
};

// session middleware
app.use(session(sessionOption));
// flash middleware
app.use(flash());

//user authentication
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});

// all listings
app.use("/listings", listingsRouter);
app.use("/listings/:id/reviews", reviewsRouter);
app.use("/", userRouter);



// Custom ExpressError 
app.use((req, res, next) => {
    next(new ExpressError(404, "Page Not Found!"));
});
// error handler Middleware
app.use((err, req, res, next) => {
    let { status = 404, message = "somthing wrong" } = err;
    res.status(status).render("error.ejs", { err });
});
app.listen(process.env.PORT || 8080, () => {
    console.log("continue working in port 8080");
});
