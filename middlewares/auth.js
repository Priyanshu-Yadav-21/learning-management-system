const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.auth = async (req, res) => {
    try{
        const token = req.cookies.token || req.body.token || req.header("Authorisation").replace("Bearer", "");

        //if token missing, return response
        if(!token) {
            return res.status(401).json({
                success:false,
                message:"Token is missing"
            });
        }

        //verify the token
        try {
            const decode = await jwt.verify(token, process.env.JWT_SECRET);
            console.log(decode);
            req.user = decode;
        }
        catch(error) {
            return res.status(401).json({
                success:false,
                message:"token is invalid"
            });
        }
    }
    catch(error) {

    }
}