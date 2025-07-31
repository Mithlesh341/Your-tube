import video from "../models/video.js";

export const uploadvideo = async (req, res) => {
  if (!req.file) {
    return res
      .status(400)
      .json({ message: "Please upload an MP4 video file only." });
  }

  try {
    const file = new video({
      videotitle: req.body.videotitle,
      filename: req.file.originalname,
      filepath: req.file.path, 
      filetype: req.file.mimetype,
      filesize: req.file.size,
      videochanel: req.body.videochanel,
      uploader: req.body.uploader,
    });

    await file.save();
    return res.status(201).json("File uploaded successfully to Cloudinary.");
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ message: "Something went wrong." });
  }
};

export const getallvideo = async (req, res) => {
  try {
    const files = await video.find();
    return res.status(200).send(files);
  } catch (error) {
    console.error(" error:", error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

