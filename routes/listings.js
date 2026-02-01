const express = require("express");
const router = express.Router();
const wrapasync = require("../utils/wrapasync.js");
const listing = require("../models/listing.js");
const { isLoggedIn, isowned, validateListing } = require("../middleware.js");
const { Cursor } = require("mongoose");
const listingsController = require("../controllers/listings.js");
const multer  = require('multer');
const {storage} = require("../cloudConfig.js");
const upload = multer({storage});

router.route("/")
    // all listings
    .get(wrapasync(listingsController.index))
    // Create Route
    .post(isLoggedIn, validateListing,upload.single("listing[image]"), wrapasync(listingsController.createListing));
    

// add new listings
router.get("/new", isLoggedIn, listingsController.renderNewform);

router.route("/:id")
    // show specefic listing
    .get(wrapasync(listingsController.showSpecificListing))
    // put requset
    .put(isLoggedIn,upload.single("Listing[image]") ,isowned, validateListing, wrapasync(listingsController.editSpecificLinting))
    //delete Route
    .delete(isLoggedIn, isowned, wrapasync(listingsController.deleteListing));

//Edit specific listing
router.get("/:id/edit", isLoggedIn, isowned, wrapasync(listingsController.renderSpecificEditForm));

module.exports = router;
