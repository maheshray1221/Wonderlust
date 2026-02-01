const express = require("express");
const router = express.Router({mergeParams : true});
const wrapasync = require("../utils/wrapasync.js");
const ExpressError = require("../utils/ExpressError.js");
const { validateReview ,isLoggedIn,isReviewAuthor} = require("../middleware.js");
const reviewController = require("../controllers/reviews.js");
// Reviews 
//post
router.post("/",isLoggedIn,validateReview, wrapasync(reviewController.postReviews));
// delete review
router.delete("/:reviewId",isLoggedIn,isReviewAuthor,wrapasync(reviewController.deleteReviews));

module.exports = router;