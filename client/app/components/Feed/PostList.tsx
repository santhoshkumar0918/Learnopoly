// import { User } from "@clerk/nextjs/server";
// import { UseMutationResult } from "@tanstack/react-query";
// import {
//   Card,
//   CardContent,
//   CardFooter,
//   CardHeader,
// } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Textarea } from "@/components/ui/textarea";
// import { Input } from "@/components/ui/input";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { formatDistanceToNow } from "date-fns";
// import { Heart, MessageCircle, Share2 } from "lucide-react";
// import { useState } from "react";

// interface Post {
//   id: string;
//   content: string;
//   author: {
//     id: string;
//     name: string;
//     imageUrl: string;
//   };
//   createdAt: string;
//   likes: number;
//   comments: number;
// }

// interface PostListProps {
//   posts: Post[];
//   currentUser: User;
//   onLike: (postId: string) => void;
//   onComment: (postId: string, comment: string) => void;
//   onShare: (postId: string) => void;
// }

// const PostList = ({
//   posts,
//   currentUser,
//   onLike,
//   onComment,
//   onShare,
// }: PostListProps) => {
//   const [commentText, setCommentText] = useState<{ [key: string]: string }>({});

//   const handleCommentSubmit = (postId: string) => {
//     if (commentText[postId]?.trim()) {
//       onComment(postId, commentText[postId]);
//       setCommentText((prev) => ({ ...prev, [postId]: "" }));
//     }
//   };

//   return (
//     <div className="space-y-4">
//       {posts.map((post) => (
//         <Card key={post.id} className="w-full">
//           <CardHeader className="flex flex-row items-center gap-4">
//             <Avatar>
//               <AvatarImage src={post.author.imageUrl} alt={post.author.name} />
//               <AvatarFallback>{post.author.name[0]}</AvatarFallback>
//             </Avatar>
//             <div className="flex flex-col">
//               <span className="font-semibold">{post.author.name}</span>
//               <span className="text-sm text-gray-500">
//                 {formatDistanceToNow(new Date(post.createdAt), {
//                   addSuffix: true,
//                 })}
//               </span>
//             </div>
//           </CardHeader>

//           <CardContent>
//             <p className="text-gray-700">{post.content}</p>
//           </CardContent>

//           <CardFooter className="flex flex-col gap-4">
//             <div className="flex items-center justify-between w-full">
//               <Button
//                 variant="ghost"
//                 size="sm"
//                 className="flex items-center gap-2"
//                 onClick={() => onLike(post.id)}
//               >
//                 <Heart className="w-4 h-4" />
//                 <span>{post.likes}</span>
//               </Button>

//               <Button
//                 variant="ghost"
//                 size="sm"
//                 className="flex items-center gap-2"
//               >
//                 <MessageCircle className="w-4 h-4" />
//                 <span>{post.comments}</span>
//               </Button>

//               <Button
//                 variant="ghost"
//                 size="sm"
//                 className="flex items-center gap-2"
//                 onClick={() => onShare(post.id)}
//               >
//                 <Share2 className="w-4 h-4" />
//                 <span>Share</span>
//               </Button>
//             </div>

//             <div className="w-full">
//               <div className="flex gap-2">
//                 <Input
//                   placeholder="Write a comment..."
//                   value={commentText[post.id] || ""}
//                   onChange={(e) =>
//                     setCommentText((prev) => ({
//                       ...prev,
//                       [post.id]: e.target.value,
//                     }))
//                   }
//                   className="flex-grow"
//                 />
//                 <Button
//                   onClick={() => handleCommentSubmit(post.id)}
//                   disabled={!commentText[post.id]?.trim()}
//                 >
//                   Comment
//                 </Button>
//               </div>
//             </div>
//           </CardFooter>
//         </Card>
//       ))}
//     </div>
//   );
// };

// export default PostList;


import { UserResource } from "@clerk/types";
import { UseMutationResult } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";
import { Heart, MessageCircle, Share2, Edit, Trash2, X } from "lucide-react";

interface Post {
  id: string;
  user_id: string;
  content: string;
  image_url?: string;
  created_at: string;
  likes: Array<{ user_id: string }>;
  author: {
    id: string;
    name: string;
    imageUrl: string;
  };
  comments: Array<{
    id: string;
    user_id: string;
    content: string;
    created_at: string;
  }>;
}

interface PostListProps {
  posts: Post[];
  isLoading: boolean;
  user: UserResource | null;
  editingPost: { id: string; content: string } | null;
  setEditingPost: (post: { id: string; content: string } | null) => void;
  showComments: Record<string, boolean>;
  setShowComments: (value: Record<string, boolean>) => void;
  commentContent: Record<string, string>;
  setCommentContent: (value: Record<string, string>) => void;
  deletePost: UseMutationResult<void, Error, string>;
  editPost: UseMutationResult<
    void,
    Error,
    { postId: string; newContent: string }
  >;
  toggleLike: UseMutationResult<void, Error, string>;
  addComment: UseMutationResult<
    void,
    Error,
    { postId: string; content: string }
  >;
}

const PostList = ({
  posts,
  isLoading,
  user,
  editingPost,
  setEditingPost,
  showComments,
  setShowComments,
  commentContent,
  setCommentContent,
  deletePost,
  editPost,
  toggleLike,
  addComment,
}: PostListProps) => {
  if (isLoading) {
    return <div className="text-center text-gray-400">Loading posts...</div>;
  }

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <Card key={post.id} className="bg-gray-800 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex items-center gap-4">
              <Avatar>
                <AvatarImage
                  src={post.author.imageUrl}
                  alt={post.author.name}
                />
                <AvatarFallback>{post.author.name[0]}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="font-semibold text-white">
                  {post.author.name}
                </span>
                <span className="text-sm text-gray-400">
                  {formatDistanceToNow(new Date(post.created_at), {
                    addSuffix: true,
                  })}
                </span>
              </div>
            </div>
            {user?.id === post.user_id && (
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    setEditingPost({ id: post.id, content: post.content })
                  }
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => deletePost.mutate(post.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            )}
          </CardHeader>

          <CardContent>
            {editingPost?.id === post.id ? (
              <div className="space-y-2">
                <Textarea
                  value={editingPost.content}
                  onChange={(e) =>
                    setEditingPost({ ...editingPost, content: e.target.value })
                  }
                  className="bg-gray-700 border-gray-600"
                />
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={() =>
                      editPost.mutate({
                        postId: post.id,
                        newContent: editingPost.content,
                      })
                    }
                  >
                    Save
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setEditingPost(null)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div>
                <p className="text-gray-200">{post.content}</p>
                {post.image_url && (
                  <img
                    src={post.image_url}
                    alt="Post attachment"
                    className="mt-4 rounded-lg max-h-96 w-full object-cover"
                  />
                )}
              </div>
            )}
          </CardContent>

          <CardFooter className="flex flex-col gap-4">
            <div className="flex items-center justify-between w-full">
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center gap-2 text-gray-300"
                onClick={() => toggleLike.mutate(post.id)}
              >
                <Heart
                  className={`w-4 h-4 ${
                    post.likes.some((like) => like.user_id === user?.id)
                      ? "fill-red-500 text-red-500"
                      : ""
                  }`}
                />
                <span>{post.likes.length}</span>
              </Button>

              <Button
                variant="ghost"
                size="sm"
                className="flex items-center gap-2 text-gray-300"
                onClick={() =>
                  setShowComments({
                    ...showComments,
                    [post.id]: !showComments[post.id],
                  })
                }
              >
                <MessageCircle className="w-4 h-4" />
                <span>{post.comments.length}</span>
              </Button>
            </div>

            {showComments[post.id] && (
              <div className="w-full space-y-4">
                <div className="flex gap-2">
                  <Textarea
                    placeholder="Write a comment..."
                    value={commentContent[post.id] || ""}
                    onChange={(e) =>
                      setCommentContent({
                        ...commentContent,
                        [post.id]: e.target.value,
                      })
                    }
                    className="bg-gray-700 border-gray-600"
                  />
                  <Button
                    onClick={() =>
                      addComment.mutate({
                        postId: post.id,
                        content: commentContent[post.id],
                      })
                    }
                    disabled={!commentContent[post.id]?.trim()}
                  >
                    Comment
                  </Button>
                </div>

                <div className="space-y-2">
                  {post.comments.map((comment) => (
                    <div
                      key={comment.id}
                      className="bg-gray-700 p-3 rounded-lg"
                    >
                      <p className="text-sm text-gray-300">{comment.content}</p>
                      <span className="text-xs text-gray-400">
                        {formatDistanceToNow(new Date(comment.created_at), {
                          addSuffix: true,
                        })}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default PostList;