const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const app = express();

require("./config/db");
const router = require("./router/route");
const fileUpload = require("express-fileupload");
const cors = require("cors");
app.use(fileUpload());
app.use(express.static("assets"));
// const path = require("path");


const corsOption = {
    origin:"http://localhost:3000",
    methods:'GET,POST,PUT,DELETE',
    credentials:true
}

app.use(cors(corsOption));

app.use(express.json());
const PORT = 2000;

app.use('/api',router);

app.listen(PORT,()=>{
    console.log(`Listening on port ${PORT}`);
});