const Section = require("../models/Section");
const SubSection = require("../models/SubSection");
const {uploadImageToCloudinary} = require("../utils/imageUploader");

exports.createSubSection = async (req, res) => {
    try {
        const {SectionId, title, timeDuration, description} = req.body;

        const video = req.files.videoFile;

        if(!SectionId || !title || !timeDuration || !description || !video) {
            return res.status(400).json({
                success: true,
                message: "All fields are required"
            });
        }

        const uploadDetails = await uploadImageToCloudinary(video, process.env.FOLDER_NAME);

        const subSectionDetails = await SubSection.create({
            title:title,
            timeduration:timeDuration,
            description:description,
            videoUrl:uploadDetails.secure_url,
        });

        const updateSection = await Section.findByIdAndUpdate({_id:SectionId}, 
                                                            {$push: {
                                                                subSection:subSectionDetails._id,
                                                            }},
                                                            {new:true}
        );
        //TODO: log update section by adding populate

        return res.status(200).json({
            success:true,
            message:"Sub Section created Successfully"
        });
    }
    catch(error) {
        return res.status(500).json({
            success:false,
            message:"Internal Server Error",
            error:error.message
        });
    }
}