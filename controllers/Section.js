const Course = require("../models/Course");
const Section = require("../models/Section");

exports.createSection = async (req, res) => {
    try{
        const {sectionName, courseId} = req.body;

        if(!sectionName || !courseId) {
            return res.status(400).json({
                success: true,
                message:"Misiing Properties"
            });
        }

        const newSection = await Section.create({sectionName});

        const updateCourseDetails = await Course.findByIdAndUpdate(
                                            courseId,
                                            {
                                                $push: {
                                                    courseContent:newSection._id,
                                                }
                                            },
                                            {new:true}
        )//TODO: use populate to replace section and Subsection both in the updateCourseDetails
        // return resonse
        return res.status(200).json({
            success:true,
            message:"Section created succesfully",
            updateCourseDetails
        });
    }
    catch(error) {
        return res.status(500).json({
            success:false,
            message:"Unable to create Section, please try again",
        });
    }
}

exports.updateSection = async (req, res) => {
    try {
        const {sectionName, sectionId} = req.body;

        if(!sectionId || sectionName) {
            return res.status(400).json({
                success:false,
                message:"Missiing Properties"
            });
        }

        const section = await Course.findByIdAndUpdate(sectionId, {sectionName}, {new:true});

        return res.status(200).json({
            success:true,
            message:"Section updated Successfully"
        });
    }
    catch(error) {
        return res.status(500).json({
            success:false,
            message:"Unable to fetch Section, please try again",
        });
    }
}

exports.deleteSection = async (req, res) => {
    try {
        const {sectionId} = req.params;

        await Section.findOneAndDelete(sectionId);

        return res.status(200).json({
            success:true,
            message: "Section deleted Successfully"
        });
    }
    catch(error) {
        return res.status(500).json({
            success:false,
            message:"Unable to delete Section, please try again",
        });
    }
}