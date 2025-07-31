import React, {
  useEffect,
  useState,
  forwardRef,
  useImperativeHandle,
} from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { formatDistanceToNow } from "date-fns";
import { useUser } from "@/lib/AuthContext";
import axiosInstance from "@/lib/axiosinstance";

interface Comment {
  _id: string;
  videoid: string;
  userid: string;
  commentbody: string;
  usercommented: string;
  commentedon: string;
}

const Comments = forwardRef<HTMLDivElement, { videoId: string }>(
  ({ videoId }, ref) => {
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [editingCommentId, setEditingCommentId] = useState<string | null>(
      null
    );
    const [editText, setEditText] = useState("");
    const { user } = useUser();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      loadComments();
    }, [videoId]);

    const loadComments = async () => {
      try {
        const res = await axiosInstance.get(`/comment/${videoId}`);
        setComments(res.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    if (loading) {
      return <div>Loading comments...</div>;
    }

    const handleSubmitComment = async () => {
      if (!user || !newComment.trim()) return;

      setIsSubmitting(true);
      try {
        const res = await axiosInstance.post("/comment/postcomment", {
          videoid: videoId,
          userid: user._id,
          commentbody: newComment,
          usercommented: user.name,
        });
        if (res.data.comment) {
          const newCommentObj: Comment = {
            _id: Date.now().toString(),
            videoid: videoId,
            userid: user._id,
            commentbody: newComment,
            usercommented: user.name || "Anonymous",
            commentedon: new Date().toISOString(),
          };
          setComments([newCommentObj, ...comments]);
        }
        setNewComment("");
      } catch (error) {
        console.error("Error adding comment:", error);
      } finally {
        setIsSubmitting(false);
      }
    };

    const handleEdit = (comment: Comment) => {
      setEditingCommentId(comment._id);
      setEditText(comment.commentbody);
    };

    const handleUpdateComment = async () => {
      if (!editText.trim()) return;
      try {
        const res = await axiosInstance.post(
          `/comment/editcomment/${editingCommentId}`,
          { commentbody: editText }
        );
        if (res.data) {
          setComments((prev) =>
            prev.map((c) =>
              c._id === editingCommentId ? { ...c, commentbody: editText } : c
            )
          );
          setEditingCommentId(null);
          setEditText("");
        }
      } catch (error) {
        console.log(error);
      }
    };

    const handleDelete = async (id: string) => {
      try {
        const res = await axiosInstance.delete(`/comment/deletecomment/${id}`);
        if (res.data.comment) {
          setComments((prev) => prev.filter((c) => c._id !== id));
        }
      } catch (error) {
        console.log(error);
      }
    };

    return (
      <div ref={ref} className="space-y-6">
        <h2 className="text-xl font-semibold">{comments.length} Comments</h2>

        {user && (
          <div className="flex gap-4">
            <Avatar className="w-10 h-10">
              <AvatarImage src={user.image || ""} />
              <AvatarFallback>{user.name?.[0] || "U"}</AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-2">
              <Textarea
                placeholder="Add a comment..."
                value={newComment}
                onChange={(e: any) => setNewComment(e.target.value)}
                className="min-h-[80px] resize-none border-0 border-b-2 rounded-none focus-visible:ring-0"
              />
              <div className="flex gap-2 justify-end">
                <Button
                  variant="ghost"
                  onClick={() => setNewComment("")}
                  disabled={!newComment.trim()}
                  className="cursor-pointer"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSubmitComment}
                  disabled={!newComment.trim() || isSubmitting}
                  className="cursor-pointer"
                >
                  Comment
                </Button>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-4">
          {comments.length === 0 ? (
            <p className="text-sm text-gray-500 italic">
              No comments yet. Be the first to comment!
            </p>
          ) : (
            comments.map((comment) => (
              <div key={comment._id} className="flex gap-4">
                <Avatar className="w-10 h-10">
                  {/* <AvatarImage src="/placeholder.svg?height=40&width=40" /> */}
                  <AvatarFallback>{comment.usercommented[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-sm">
                      {comment.usercommented}
                    </span>
                    <span className="text-xs text-gray-600">
                      {formatDistanceToNow(new Date(comment.commentedon))} ago
                    </span>
                  </div>

                  {editingCommentId === comment._id ? (
                    <div className="space-y-2">
                      <Textarea
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                      />
                      <div className="flex gap-2 justify-end">
                        <Button
                          onClick={handleUpdateComment}
                          disabled={!editText.trim()}
                          className="cursor-pointer"
                        >
                          Save
                        </Button>
                        <Button
                          variant="ghost"
                          onClick={() => {
                            setEditingCommentId(null);
                            setEditText("");
                          }}
                          className="cursor-pointer"
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <p className="text-sm">{comment.commentbody}</p>
                      {comment.userid === user?._id && (
                        <div className="flex gap-2 mt-2 text-sm text-gray-500">
                          <button onClick={() => handleEdit(comment)} className="cursor-pointer">
                            Edit
                          </button>
                          <button onClick={() => handleDelete(comment._id)} className="cursor-pointer">
                            Delete
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    );
  }
);

Comments.displayName = "Comments";
export default Comments;
