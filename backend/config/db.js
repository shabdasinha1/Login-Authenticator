const mongoose = require("mongoose");
const Url = process.env.URL;

mongoose.connect(Url).then(()=>{
    console.log("connection done")
}).catch(()=>{
    console.log("error in connection")
})