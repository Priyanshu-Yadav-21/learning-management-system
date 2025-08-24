const User = require("../models/User");
const OTP = require("../models/OTP");
const otpGenerator = require("otp-generator");
const bcrypt = require("bcrypt");

exports.sendOTP = async (req, res) => {

    try {
        const { email } = req.body;

        const checkUserPresent = await User.findOne({ email });

        if (checkUserPresent) {
            return res.status(401).json({
                success: false,
                message: "User Already Exist"
            })
        }

        var otp = otpGenerator.generate(6, {
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            specialChars: false
        });

        const findOTP = await OTP.findOne({ otp: otp });

        while (findOTP) {
            var otp = otpGenerator.generate(6, {
                upperCaseAlphabets: false,
                lowerCaseAlphabets: false,
                specialChars: false
            })

            const findOTP = await OTP.findOne({ otp: otp });
        }

        const otpPayload = { email, otp };

        const otpBody = await OTP.create(otpPayload);
        console.log(otpBody);

        res.status(200).json({
            success: true,
            message: "OTP sent successfully",
            otp,
        })
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

//signup
exports.signUp = async (req, res) => {

    try {
        //data fetch from request ki body
        const {
            firstName,
            lastName,
            email,
            password,
            confirmPassword,
            accountType,
            contactNumber,
            otp,
        } = req.body;

        //validate karlo
        if (!firstName || !lastName || !password || !confirmPassword || !otp) {
            return res.status(403).json({
                success: false,
                message: "All Fields are required"
            })
        }

        //password match 
        if (password !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "password and confirmpassword doesn't match"
            })
        }

        //check user existence
        const checkUser = await User.findOne({ email });

        if (checkUser) {
            return res.status(400).json({
                success: false,
                message: "User Already Registered"
            })
        }

        //find recent otp stored for the user
        const recentOTP = await OTP.find({ email }).sort({ createdAt: -1 }).limit(1);
        console.log(recentOTP);

        if (recentOTP.length == 0) {
            return res.status(400).json({
                success: false,
                message: "OTP not found"
            })
        }
        else if (otp !== recentOTP.otp) {
            return res.status(400).json({
                success: false,
                message: "Invalid OTP"
            })
        }

        //hash password

        const hashedPassword = await bcrypt.hash(password, 10);
        //entry create in database
        const profileDetails = await Profiler.create({
            gender: null,
            dateOfbirth: null,
            about: null,
            contactNumber: null,
        });

        const user = await User.create({
            firstName,
            lastName,
            email,
            contactNumber,
            password: hashedPassword,
            additionalDetails: profileDetails._id,
            image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`
        })

        return res.status(200).json({
            success:true,
            message:"User is Registered Successfully",
            user,
        })
    }
    catch (error) {
        console.log(error);
        return res.status(400).json({
            success:false,
            message:"User cannot be registered"
        })
    }

}