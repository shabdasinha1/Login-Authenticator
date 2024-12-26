const  jwt = require("jsonwebtoken");

const Auth = async(req,res,next) =>{
    try{
        const token = req.headers.authorization.split(" ")[1];
        const decodeToken = await jwt.verify(token,process.env.JWT_SECRET_KEY);
        req.user = decodeToken
        next();
    }catch(err){
        res.status(400).json({
            error:"Authenication failed"
        })
    }
}

module.exports = {Auth};