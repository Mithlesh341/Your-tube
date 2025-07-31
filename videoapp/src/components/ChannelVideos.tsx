import VideoCard from "./videocard";
export default function ChannelVideos({ videos }: any) {
  if (videos.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">No videos uploaded yet.</p>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 md:px-8">
      <h2 className="text-xl font-semibold mb-4">Videos</h2>
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
        {videos.map((video: any) => (
          <VideoCard key={video._id} video={video} />
        ))}
      </div>
    </div>
  );
}