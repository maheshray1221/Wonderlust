const listing = require("../models/listing");

module.exports.index = async (req, res) => {
    const allListings = await listing.find({});
    res.render("listings/index.ejs", { allListings });
}

module.exports.renderNewform = (req, res) => {
    res.render("listings/new.ejs");
}

module.exports.showSpecificListing = async (req, res) => {
    let { id } = req.params;
    const listingdata = await listing.findById(id)
        .populate({
            path: "reviews", populate: { path: "author" }
        })
        .populate("owner");
    if (!listingdata) {
        req.flash("error", "Listing You requested for does not exist!");
        res.redirect("/listings");
    }
    res.render("listings/show.ejs", { listingdata });
}

module.exports.createListing = async (req, res) => {
    //create new model
    let url = req.file.path;
    let filename = req.file.filename;
    const newlisting = new listing(req.body.listing);
    newlisting.owner = req.user._id;
    newlisting.image = { url, filename };
    await newlisting.save();
    req.flash("success", "New Listing created");
    res.redirect("/listings");
}
module.exports.renderSpecificEditForm = async (req, res) => {
    const { id } = req.params;
    const Listing = await listing.findById(id);
    if (!Listing) {
        req.flash("error", "Listing You requested for does not exist!");
        res.redirect("/listings");
    }
    let orignalImageUrl = Listing.image.url;
    orignalImageUrl = orignalImageUrl.replace("/upload", "/upload/h_250,w_250");
    res.render("listings/edit.ejs", { Listing ,orignalImageUrl});
}
//
module.exports.editSpecificLinting = async (req, res) => {
    const { id } = req.params;
    let updatedListing = await listing.findByIdAndUpdate(id, { ...req.body.Listing });
    if (typeof req.file !== "undefined") {
        let url = req.file.path;
        let filename = req.file.filename;
        updatedListing.image = { url, filename };
        await updatedListing.save();
    }
    req.flash("success", "Listing Updated");
    res.redirect(`/listings/${id}`);
}

module.exports.deleteListing = async (req, res) => {
    const { id } = req.params;
    await listing.findByIdAndDelete(id);
    req.flash("success", " Listing was deleted");
    res.redirect("/listings");
}