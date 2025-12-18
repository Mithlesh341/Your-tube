// import { Check, FileVideo, Upload, X } from "lucide-react";
// import React, { ChangeEvent, useRef, useState } from "react";
// import { toast } from "sonner";
// import { Button } from "./ui/button";
// import { Input } from "./ui/input";
// import { Label } from "./ui/label";
// import { Progress } from "./ui/progress";
// import axiosInstance from "@/lib/axiosinstance";

// const VideoUploader = ({ channelId, channelName }: any) => {
//   const [isUploading, setIsUploading] = useState(false);
//   const [uploadProgress, setUploadProgress] = useState(0);
//   const [videoFile, setVideoFile] = useState<File | null>(null);
//   const [videoTitle, setVideoTitle] = useState("");
//   const [uploadComplete, setUploadComplete] = useState(false);


//   const fileInputRef = useRef<HTMLInputElement>(null);
//   const handlefilechange = (e: ChangeEvent<HTMLInputElement>) => {
//     const files = e.target.files;
//     if (files && files.length > 0) {
//       const file = files[0];
//       if (!file.type.startsWith("video/")) {
//         toast.error("Please upload a valid video file.");
//         return;
//       }
//       if (file.size > 200 * 1024 * 1024) {
//         toast.error("File size exceeds 100MB limit.");
//         return;
//       }
//       setVideoFile(file);
//       const filename = file.name;
//       if (!videoTitle) {
//         setVideoTitle(filename);
//       }
//     }
//   };
//   const resetForm = () => {
//     setVideoFile(null);
//     setVideoTitle("");
//     setIsUploading(false);
//     setUploadProgress(0);
//     setUploadComplete(false);
//     if (fileInputRef.current) {
//       fileInputRef.current.value = "";
//     }
//   };
//   const cancelUpload = () => {
//     if (isUploading) {
//       toast.error("Your video upload has been cancelled");
//     }
//   };
//   const handleUpload = async () => {
//     if (!videoFile || !videoTitle.trim()) {
//       toast.error("Please provide file and title");
//       return;
//     }
//     const formdata = new FormData();
//     formdata.append("file", videoFile);
//     formdata.append("videotitle", videoTitle);
//     formdata.append("videochanel", channelName);
//     formdata.append("uploader", channelId);


//     console.log(formdata)
//     try {
//       setIsUploading(true);
//       setUploadProgress(0);
//       const res = await axiosInstance.post("/video/upload", formdata, {
//          headers: {
//     "Content-Type": "multipart/form-data", //  FormData
//   },
//         onUploadProgress: (progresEvent: any) => {
//           const progress = Math.round(
//             (progresEvent.loaded * 100) / progresEvent.total
//           );
//           setUploadProgress(progress);
//         },
//       });
//       toast.success("Upload successfully");
//       resetForm();
//     } catch (error) {
//       console.error("Error uploading video:", error);
//       toast.error("There was an error uploading your video. Please try again.");
//     } finally {
//       setIsUploading(false);
//     }
//   };
//   return (
//     <div className="bg-gray-50 rounded-lg p-6">
//       <h2 className="text-xl font-semibold mb-4">Upload a video</h2>

//       <div className="space-y-4">
//         {!videoFile ? (
//           <div
//             className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:bg-gray-100 transition-colors"
//             onClick={() => fileInputRef.current?.click()}
//           >
//             <Upload className="w-12 h-12 mx-auto text-gray-400 mb-2" />
//             <p className="text-lg font-medium">
//               Drag and drop video files to upload
//             </p>
//             <p className="text-sm text-gray-500 mt-1">
//               or click to select files
//             </p>
//             <p className="text-xs text-gray-400 mt-4">
//               MP4, WebM, MOV or AVI • Up to 100MB
//             </p>
//             <input
//               type="file"
//               ref={fileInputRef}
//               className="hidden"
//               accept="video/*"
//               onChange={handlefilechange}
//             />
//           </div>
//         ) : (
//           <div className="space-y-4">
//             <div className="flex items-center gap-3 p-3 bg-white rounded-lg border">
//               <div className="bg-blue-100 p-2 rounded-md">
//                 <FileVideo className="w-6 h-6 text-blue-600" />
//               </div>
//               <div className="flex-1 min-w-0">
//                 <p className="font-medium truncate">{videoFile.name}</p>
//                 <p className="text-sm text-gray-500">
//                   {(videoFile.size / (1024 * 1024)).toFixed(2)} MB
//                 </p>
//               </div>
//               {!isUploading && (
//                 <Button variant="ghost" size="icon" onClick={cancelUpload}>
//                   <X className="w-5 h-5 cursor-pointer" />
//                 </Button>
//               )}
//               {uploadComplete && (
//                 <div className="bg-green-100 p-1 rounded-full">
//                   <Check className="w-5 h-5 text-green-600" />
//                 </div>
//               )}
//             </div>

//             <div className="space-y-3">
//               <div>
//                 <Label htmlFor="title">Title (required)</Label>
//                 <Input
//                   id="title"
//                   value={videoTitle}
//                   onChange={(e) => setVideoTitle(e.target.value)}
//                   placeholder="Add a title that describes your video"
//                   disabled={isUploading || uploadComplete}
//                   className="mt-1"
//                 />


//               </div>
//             </div>

//             {isUploading && (
//               <div className="space-y-2">
//                 <div className="flex justify-between text-sm">
//                   <span>Uploading...</span>
//                   <span>{uploadProgress}%</span>
//                 </div>
//                 <Progress value={uploadProgress} className="h-2" />
//               </div>
//             )}

//             <div className="flex justify-end gap-3">
//               {!uploadComplete && (
//                 <>
//                   <Button onClick={cancelUpload} disabled={uploadComplete} className="cursor-pointer">
//                     Cancel
//                   </Button>
//                   <Button
//                     onClick={handleUpload}
//                     disabled={
//                       isUploading || !videoTitle.trim() || uploadComplete
//                     } className="cursor-pointer"
//                   >
//                     {isUploading ? "Uploading..." : "Upload"}
//                   </Button>
//                 </>
//               )}
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default VideoUploader;





import { Check, FileVideo, Upload, X } from "lucide-react";
import React, { ChangeEvent, useRef, useState } from "react";
import { toast } from "sonner";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Progress } from "./ui/progress";
import axiosInstance from "@/lib/axiosinstance";

const categoriesList = [
  "Music",
  "Gaming",
  "Movies",
  "News",
  "Sports",
  "Technology",
  "Comedy",
  "Education",
  "Science",
  "Travel",
  "Food",
  "Fashion",
  "Others"
];

const VideoUploader = ({ channelId, channelName }: any) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoTitle, setVideoTitle] = useState("");
  const [uploadComplete, setUploadComplete] = useState(false);

  // ✅ New: multiple categories
  const [categories, setCategories] = useState<string[]>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlefilechange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (!file.type.startsWith("video/")) {
        toast.error("Please upload a valid video file.");
        return;
      }
      if (file.size > 200 * 1024 * 1024) {
        toast.error("File size exceeds 100MB limit.");
        return;
      }
      setVideoFile(file);
      const filename = file.name;
      if (!videoTitle) {
        setVideoTitle(filename);
      }
    }
  };

  const resetForm = () => {
    setVideoFile(null);
    setVideoTitle("");
    setCategories([]);
    setIsUploading(false);
    setUploadProgress(0);
    setUploadComplete(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const cancelUpload = () => {
    if (isUploading) {
      toast.error("Your video upload has been cancelled");
    }
  };

  const handleUpload = async () => {
    if (!videoFile || !videoTitle.trim()) {
      toast.error("Please provide file and title");
      return;
    }
    if (categories.length === 0) {
      toast.error("Please select at least one category");
      return;
    }

    const formdata = new FormData();
    formdata.append("file", videoFile);
    formdata.append("videotitle", videoTitle);
    formdata.append("videochanel", channelName);
    formdata.append("uploader", channelId);

    // ✅ Append categories (multiple)
    categories.forEach((cat) => formdata.append("categories", cat));

    try {
      setIsUploading(true);
      setUploadProgress(0);
      const res = await axiosInstance.post("/video/upload", formdata, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progresEvent: any) => {
          const progress = Math.round(
            (progresEvent.loaded * 100) / progresEvent.total
          );
          setUploadProgress(progress);
        },
      });
      toast.success("Upload successfully");
      resetForm();
    } catch (error) {
      console.error("Error uploading video:", error);
      toast.error("There was an error uploading your video. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = Array.from(e.target.selectedOptions, (opt) => opt.value);
    setCategories(selected);
  };

  // return (
  //   <div className="bg-gray-50 rounded-lg p-6">
  //     <h2 className="text-xl font-semibold mb-4">Upload a video</h2>

  //     <div className="space-y-4">
  //       {!videoFile ? (
  //         <div
  //           className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:bg-gray-100 transition-colors"
  //           onClick={() => fileInputRef.current?.click()}
  //         >
  //           <Upload className="w-12 h-12 mx-auto text-gray-400 mb-2" />
  //           <p className="text-lg font-medium">
  //             Drag and drop video files to upload
  //           </p>
  //           <p className="text-sm text-gray-500 mt-1">
  //             or click to select files
  //           </p>
  //           <p className="text-xs text-gray-400 mt-4">
  //             MP4, WebM, MOV or AVI • Up to 100MB
  //           </p>
  //           <input
  //             type="file"
  //             ref={fileInputRef}
  //             className="hidden"
  //             accept="video/*"
  //             onChange={handlefilechange}
  //           />
  //         </div>
  //       ) : (
  //         <div className="space-y-4">
  //           {/* File Preview */}
  //           <div className="flex items-center gap-3 p-3 bg-white rounded-lg border">
  //             <div className="bg-blue-100 p-2 rounded-md">
  //               <FileVideo className="w-6 h-6 text-blue-600" />
  //             </div>
  //             <div className="flex-1 min-w-0">
  //               <p className="font-medium truncate">{videoFile.name}</p>
  //               <p className="text-sm text-gray-500">
  //                 {(videoFile.size / (1024 * 1024)).toFixed(2)} MB
  //               </p>
  //             </div>
  //             {!isUploading && (
  //               <Button variant="ghost" size="icon" onClick={cancelUpload}>
  //                 <X className="w-5 h-5 cursor-pointer" />
  //               </Button>
  //             )}
  //             {uploadComplete && (
  //               <div className="bg-green-100 p-1 rounded-full">
  //                 <Check className="w-5 h-5 text-green-600" />
  //               </div>
  //             )}
  //           </div>

  //           {/* Title */}
  //           <div className="space-y-3">
  //             <div>
  //               <Label htmlFor="title">Title (required)</Label>
  //               <Input
  //                 id="title"
  //                 value={videoTitle}
  //                 onChange={(e) => setVideoTitle(e.target.value)}
  //                 placeholder="Add a title that describes your video"
  //                 disabled={isUploading || uploadComplete}
  //                 className="mt-1"
  //               />
  //             </div>
  //           </div>

  //           {/* ✅ Categories Multi Select */}
  //           <div>
  //             <Label htmlFor="categories">Categories (select multiple)</Label>
  //             <select
  //               id="categories"
  //               multiple
  //               value={categories}
  //               onChange={handleCategoryChange}
  //               disabled={isUploading || uploadComplete}
  //               className="w-full mt-1 p-2 border rounded-md"
  //             >
  //               {categoriesList.map((cat) => (
  //                 <option key={cat} value={cat}>
  //                   {cat}
  //                 </option>
  //               ))}
  //             </select>
  //             <p className="text-xs text-gray-500 mt-1">
  //               Hold <strong>Ctrl</strong> (Windows) or <strong>Cmd</strong>{" "}
  //               (Mac) to select multiple
  //             </p>
  //           </div>

  //           {isUploading && (
  //             <div className="space-y-2">
  //               <div className="flex justify-between text-sm">
  //                 <span>Uploading...</span>
  //                 <span>{uploadProgress}%</span>
  //               </div>
  //               <Progress value={uploadProgress} className="h-2" />
  //             </div>
  //           )}

  //           {/* Buttons */}
  //           <div className="flex justify-end gap-3">
  //             {!uploadComplete && (
  //               <>
  //                 <Button
  //                   onClick={cancelUpload}
  //                   disabled={uploadComplete}
  //                   className="cursor-pointer"
  //                 >
  //                   Cancel
  //                 </Button>
  //                 <Button
  //                   onClick={handleUpload}
  //                   disabled={
  //                     isUploading ||
  //                     !videoTitle.trim() ||
  //                     uploadComplete ||
  //                     categories.length === 0
  //                   }
  //                   className="cursor-pointer"
  //                 >
  //                   {isUploading ? "Uploading..." : "Upload"}
  //                 </Button>
  //               </>
  //             )}
  //           </div>
  //         </div>
  //       )}
  //     </div>
  //   </div>
  // );


return (
  <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl shadow-sm p-6 border border-gray-200 max-w-3xl mx-auto mt-6">
    <h2 className="text-2xl font-semibold mb-6 text-gray-800 flex items-center gap-2">
      <Upload className="w-6 h-6 text-blue-600" />
      Upload Your Video
    </h2>

    <div className="space-y-6">
      {!videoFile ? (
        // Upload area
        <div
          className="border-2 border-dashed border-gray-300 rounded-xl p-10 text-center cursor-pointer hover:bg-gray-100 hover:border-blue-400 transition-all"
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="flex flex-col items-center justify-center space-y-3">
            <FileVideo className="w-14 h-14 text-blue-500" />
            <p className="text-lg font-medium text-gray-700">
              Drag & drop video files to upload
            </p>
            <p className="text-sm text-gray-500">or click to select files</p>
            <p className="text-xs text-gray-400 mt-2">
              Supported: MP4, WebM, MOV, AVI • Max 100 MB
            </p>
          </div>
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="video/*"
            onChange={handlefilechange}
          />
        </div>
      ) : (
        <>
          {/* File Preview */}
          <div className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
            <div className="bg-blue-100 p-3 rounded-lg">
              <FileVideo className="w-6 h-6 text-blue-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-800 truncate">
                {videoFile.name}
              </p>
              <p className="text-sm text-gray-500">
                {(videoFile.size / (1024 * 1024)).toFixed(2)} MB
              </p>
            </div>
            {!isUploading && (
              <Button
                variant="ghost"
                size="icon"
                onClick={cancelUpload}
                className="hover:bg-red-50 hover:text-red-600 transition"
              >
                <X className="w-5 h-5" />
              </Button>
            )}
            {uploadComplete && (
              <div className="bg-green-100 p-2 rounded-full">
                <Check className="w-5 h-5 text-green-600" />
              </div>
            )}
          </div>

          {/* Title input */}
          <div>
            <Label htmlFor="title" className="text-gray-700 font-medium">
              Video Title
            </Label>
            <Input
              id="title"
              value={videoTitle}
              onChange={(e) => setVideoTitle(e.target.value)}
              placeholder="Enter a descriptive title"
              disabled={isUploading || uploadComplete}
              className="mt-2 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Multi-Select Categories */}
          {/* <div>
            <Label
              htmlFor="categories"
              className="text-gray-700 font-medium mb-1 block"
            >
              Categories (select multiple)
            </Label>
            <div className="relative">
              <select
                id="categories"
                multiple
                value={categories}
                onChange={handleCategoryChange}
                disabled={isUploading || uploadComplete}
                className="w-full mt-1 p-3 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
              >
                {categoriesList.map((cat) => (
                  <option
                    key={cat}
                    value={cat}
                    className="p-2 text-gray-700 hover:bg-gray-100"
                  >
                    {cat}
                  </option>
                ))}
              </select>
              <p className="text-xs text-gray-500 mt-2">
                Hold <strong>Ctrl</strong> (Windows) or <strong>Cmd</strong> (Mac)
                to select multiple.
              </p>
            </div>
          </div> */}

{/* ✅ Categories Selection with Checkboxes */}
<div>
  <Label className="text-gray-700 font-medium mb-2 block">
    Select Categories
  </Label>

  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 mt-2">
    {categoriesList.map((cat) => (
      <label
        key={cat}
        className={`flex items-center gap-2 border rounded-lg px-3 py-2 cursor-pointer transition-all ${
          categories.includes(cat)
            ? "bg-blue-50 border-blue-500"
            : "bg-white border-gray-300 hover:border-blue-300"
        }`}
      >
        <input
          type="checkbox"
          value={cat}
          checked={categories.includes(cat)}
          onChange={(e) => {
            const value = e.target.value;
            if (categories.includes(value)) {
              setCategories(categories.filter((c) => c !== value));
            } else {
              setCategories([...categories, value]);
            }
          }}
          disabled={isUploading || uploadComplete}
          className="text-blue-600 focus:ring-0 cursor-pointer"
        />
        <span className="text-sm text-gray-700">{cat}</span>
      </label>
    ))}
  </div>

  {categories.length > 0 && (
    <p className="text-xs text-gray-500 mt-2">
      Selected:{" "}
      <span className="font-medium text-gray-700">
        {categories.join(", ")}
      </span>
    </p>
  )}
</div>



          {/* Upload progress */}
          {isUploading && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Uploading...</span>
                <span>{uploadProgress}%</span>
              </div>
              <Progress value={uploadProgress} className="h-2 bg-gray-200" />
            </div>
          )}

          {/* Action buttons */}
          <div className="flex justify-end gap-3 pt-2">
            {!uploadComplete && (
              <>
                <Button
                  onClick={cancelUpload}
                  disabled={uploadComplete}
                  className="bg-gray-200 text-gray-700 hover:bg-gray-300 transition"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleUpload}
                  disabled={
                    isUploading ||
                    !videoTitle.trim() ||
                    uploadComplete ||
                    categories.length === 0
                  }
                  className="bg-blue-600 hover:bg-blue-700 text-white transition"
                >
                  {isUploading ? "Uploading..." : "Upload"}
                </Button>
              </>
            )}
          </div>
        </>
      )}
    </div>
  </div>
);




};

export default VideoUploader;
