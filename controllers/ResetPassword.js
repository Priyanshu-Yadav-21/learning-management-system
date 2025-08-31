const User = require("../models/User");
const mailSender = require("../utils/mailSender");
const bcrypt = require("bcrypt");

//reset password token
exports.resetPasswordToken = async (req, res) => {
    try {
        //get email from req.body
        const { email } = req.body.email;
        //check user for this email and validate it
        const checkUser = await User.findOne({ email: email });
        if (!checkUser) {
            return res.json({
                success: false,
                message: "Your email is not registered"
            });
        }

        //generate token
        const token = crypto.randomUUID();
        //update user by adding token and expiration time
        const updateDetails = await User.findOneAndUpdate({ email: email }, { token: token, resetPasswordExpires: Date.now() + 5 * 60 * 1000 }, { new: true });

        //create url
        const url = `http://localhost:5000/update-password/${token}`;

        await mailSender(email, "Password reset link", `Password Reset Link: ${url}`);

        return res.status(200).json({
            success: true,
            message: "Email sent Successfully, please check your email"
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong while reset password mail"
        });
    }
}

//reset password
const resetPassword = async (req, res) => {
    try {
        //data fetch
        const { password, confirmPassword, token } = req.body;

        //validation
        if (password !== confirmPassword) {
            return res.status(500).json({
                success: false,
                message: "password doesn't match"
            });
        }

        //get user details from database using token
        const userDetails = await User.findOne({ token: token });

        //if no entry - invalid token
        if (!userDetails) {
            return res.json({
                success: false,
                message: "Token is invalid"
            });
        }

        //token time check
        if (userDetails.resetPasswordExpires < Date.now()) {
            return res.json({
                success: false,
                message: "Token is expired, please generate new token"
            });
        }

        //hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        //update to database
        const updatePassword = await User.findOneAndUpdate({ token: token }, { password: hashedPassword }, { new: true });

        //return response
        return res.json({
            success: true,
            message: "Password reset successfully",
        });

    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong while reset password mail"
        });
    }
}