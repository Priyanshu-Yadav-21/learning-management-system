const Tags = require("../models/Tags");

exports.createTag = async(req, res) => {
    try {
        const {name, description} = req.body;

        if(!name || !description) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }

        const tagDetaile = await Tags.create({name: name, description:description});
        console.log(tagDetaile);

        return res.status(200).json({
            succes:true,
            message:"Tags created Successfully"
        })
    }
    catch(error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Error while creating tags"
        });
    }


}