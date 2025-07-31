import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../utils/cloudinary.js";

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "youtube_clone_videos", // Cloudinary folder
    resource_type: "video", // Important!
    format: async (req, file) => "mp4", 
    public_id: (req, file) =>
      new Date().toISOString().replace(/:/g, "-") + "-" + file.originalname,
  },
});

const filefilter = (req, file, cb) => {
  if (file.mimetype === "video/mp4") {
    cb(null, true);
  } else {
    cb(new Error("Only MP4 videos are allowed"), false);
  }
};

const upload = multer({ storage: storage, fileFilter: filefilter });
export default upload;
