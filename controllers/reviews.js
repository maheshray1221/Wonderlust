const listing = require("../models/listing");
const Review = require("../models/review");
module.exports.postReviews = async (req,res)=>{
    let listings = await listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    listings.reviews.push(newReview);
    newReview.author = req.user._id;
    await newReview.save();
    await listings.save();
    req.flash("success","New Review created");
    res.redirect(`/listings/${listings._id}`);
}

module.exports.deleteReviews = async (req,res)=>{
    let {id,reviewId} = req.params;
    await listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success"," Review was deleted");
    res.redirect(`/listings/${id}`);
}