const mongoose = require('mongoose');
const Review = require('./review.js');
const Schema = mongoose.Schema;

const listingSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    image: {
        url: String,
        filename: String,
    },
    price: {
        type: Number,

    },
    location: {
        type: String,

    },
    country: {
        type: String,

    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review",
        }
    ],
    owner : {
        type : Schema.Types.ObjectId,
        ref : "User",
    } 
});
// mongo middleware

listingSchema.post("findOneAndDelete", async (listings)=>{
    if(listings){
      await Review.deleteMany({ _id: { $in: listings.reviews}});
    }
});
const listing = mongoose.model("listing", listingSchema);
module.exports = listing;