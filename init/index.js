const mongoose = require("mongoose");
const initdata = require("./data.js");
const listing = require("../models/listing.js");

main()
.then(()=>{
    console.log("connected");
})
.catch((err) => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}

const initDb = async () =>{
    await listing.deleteMany({});
    // for listing ownership
    initdata.data = initdata.data.map((obj)=>({
      ...obj,
       owner : '68a00d74112e252e59f2bbaa',
      }));
    await listing.insertMany(initdata.data);
    console.log("data was initialized");
};

initDb();