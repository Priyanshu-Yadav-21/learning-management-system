const Course = require("../models/Course");
const Tag = require("../models/Tags");
const User = require("../models/User");
const {uploadImageToCloudinary} = require("../utils/imageUploader");

exports.createCourse = async (req, res) => {
    try {
        const {courseName, courseDescription, whatWillYouLearn, price, tag} = req.body;

        //get thumbnail
        const thumbnail = req.files.thumbnailImage;

        //validation
        if(!courseName || !courseDescription || !whatWillYouLearn || !price || !tag || !thumbnail) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        //get instructor details
        const userId = req.user.id;
        const instructorDetails = await User.find(userId);

        if(!instructorDetails) {
            return res.status(404).json({
                success: false,
                message: "instructorDetails not found"
            });
        }

        //check given tag is valid or not
        const tagDetails = await Tag.findById(tag);
        if(!tagDetails) {
            return res.status(404).json({
                success: false,
                message: "tagDetails not found"
            });
        }

        const thumbnailImage = await uploadImageToCloudinary(thumbnail, process.env.FOLDER_NAME);

        //create an entry for new course
        const newCourse = await Course.create({
            courseName,
            courseDescription,
            instructor: instructorDetails._id,
            whatYouWillLearn:whatWillYouLearn,
            price,
            tag:tagDetails._id,
            thumbnail:thumbnailImage.secure_url
        });

        //adds new course to the user schema of instructor
        await User.findByIdAndUpdate(
            {id:instructorDetails._id},
            {
                $push: {
                    courses: newCourse._id,
                }
            },
            {new:true},
        );

        
        //update tag schema: pending

        //return response
        return res.status(200).json({
            success:true,
            message:"Course Created Successfully",
            data:newCourse,
        });

    }
    catch(error) {
        console.error(error);
        return res.status(500).json({
            success:false,
            message:"failed to create course",
            error: error.message
        });
    }
}