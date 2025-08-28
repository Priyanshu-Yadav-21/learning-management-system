const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.auth = async (req, res, next) => {
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
            const decode = jwt.verify(token, process.env.JWT_SECRET);
            console.log(decode);
            req.user = decode;
        }
        catch(error) {
            return res.status(401).json({
                success:false,
                message:"token is invalid"
            });
        }

        next();
    }
    catch(error) {
        return res.success(401).json({
            success:false,
            message:"error while validating the token"
        });
    }
}

//isStudent
exports.isStudent = async (req, res, nect) => {
    try {
        if(req.user.accountType !== "Student") {
            return res.status(401).json({
                success: false,
                message: "This is a protected route for student"
            });
        }
        next();
    }
    catch(error) {
        return res.status(500).json({
            success: false,
            message: "User cannot be varified, please try again"
        });
    }
}

//isInstructor
exports.isInstructor = async (req, res, nect) => {
    try {
        if(req.user.accountType !== "Instructor") {
            return res.status(401).json({
                success: false,
                message: "This is a protected route for Instructor"
            });
        }
        next();
    }
    catch(error) {
        return res.status(500).json({
            success: false,
            message: "User cannot be varified, please try again"
        });
    }
}

//isAdmin
exports.isAdmin = async (req, res, nect) => {
    try {
        if(req.user.accountType !== "Admin") {
            return res.status(401).json({
                success: false,
                message: "This is a protected route for Admin"
            });
        }
        next();
    }
    catch(error) {
        return res.status(500).json({
            success: false,
            message: "User cannot be varified, please try again"
        });
    }
}

