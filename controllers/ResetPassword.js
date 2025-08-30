const User = require("../models/User");
const mailSender = require("../utils/mailSender");

exports.resetPasswordToken = async (req, res) => {
    try {
        //get email from req.body
        const {email} = req.body.email;
        //check user for this email and validate it
        const checkUser = await User.findOne({email:email});
        if(!checkUser) {
            return res.json({
                success:false,
                message:"Your email is not registered"
            });
        }

        //generate token
        const token = crypto.randomUUID();
        //update user by adding token and expiration time
        const updateDetails = await User.findOneAndUpdate({email:email}, {token:token, resetPasswordExpires:Date.now() + 5*60*1000}, {new:true});

        //create url
        const url = `http://localhost:5000/update-password/${token}`;

        await mailSender(email, "Password reset link", `Password Reset Link: ${url}`);

        return res.status(200).json({
            success:true,
            message:"Email sent Successfully, please check your email"
        });
    }
    catch(error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Something went wrong while reset password mail"
        });
    }
}