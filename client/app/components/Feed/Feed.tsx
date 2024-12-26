// "use client";

// import { useState, useRef } from "react";
// import { useUser } from "@clerk/nextjs";
// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// import { createClient } from "@supabase/supabase-js";
// import {
//   HeartIcon as HeartOutline,
//   ChatBubbleOvalLeftEllipsisIcon,
//   ShareIcon,
//   PhotoIcon,
//   XMarkIcon,
//   PencilIcon,
//   TrashIcon,
// } from "@heroicons/react/24/outline";
// import { HeartIcon as HeartSolid } from "@heroicons/react/24/solid";

// const supabase = createClient(
//   process.env.NEXT_PUBLIC_SUPABASE_URL!,
//   process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
// );

// interface Post {
//   id: string;
//   content: string;
//   created_at: string;
//   user_id: string;
//   image_url?: string;
//   comments: Comment[];
//   likes: Like[];
// }

// interface Comment {
//   id: string;
//   content: string;
//   user_id: string;
//   created_at: string;
// }

// interface Like {
//   id: string;
//   user_id: string;
// }

// export default function Feed() {
//   const [content, setContent] = useState("");
//   const [editContent, setEditContent] = useState<string | null>(null); // Store content for editing
//   const [commentContent, setCommentContent] = useState<Record<string, string>>(
//     {}
//   );
//   const [selectedImage, setSelectedImage] = useState<File | null>(null);
//   const [imagePreview, setImagePreview] = useState<string | null>(null);
//   const [showComments, setShowComments] = useState<Record<string, boolean>>({});
//   const imageInputRef = useRef<HTMLInputElement>(null);
//   const { user, isLoaded } = useUser();
//   const queryClient = useQueryClient();

//   // Query to fetch posts
//   const { data: posts, isLoading } = useQuery({
//     queryKey: ["posts"],
//     queryFn: async () => {
//       const { data, error } = await supabase
//         .from("posts")
//         .select(
//           `
//           id, content, created_at, user_id, image_url,
//           comments(id, content, user_id, created_at),
//           likes(id, user_id)
//         `
//         )
//         .order("created_at", { ascending: false });
//       if (error) throw error;
//       return data as Post[];
//     },
//     enabled: isLoaded && !!user,
//   });

//   // Function to upload image
//   const uploadImage = async (file: File) => {
//     const fileExt = file.name.split(".").pop();
//     const fileName = `${Math.random()}.${fileExt}`;
//     const { error: uploadError } = await supabase.storage
//       .from("post-images")
//       .upload(fileName, file);
//     if (uploadError) throw uploadError;
//     return fileName;
//   };

//   // Mutation for creating a post
//   const createPost = useMutation({
//     mutationFn: async () => {
//       if (!user) throw new Error("User not authenticated");

//       const { data: userData } = await supabase
//         .from("users")
//         .select("id")
//         .eq("clerk_id", user.id)
//         .single();

//       let imagePath = null;
//       if (selectedImage) {
//         imagePath = await uploadImage(selectedImage);
//       }

//       const { error } = await supabase.from("posts").insert({
//         content,
//         user_id: userData?.id,
//         image_url: imagePath,
//       });

//       if (error) throw error;
//     },
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["posts"] });
//       setContent("");
//       setSelectedImage(null);
//       setImagePreview(null);
//     },
//   });

//   const editPost = useMutation({
//     mutationFn: async ({
//       postId,
//       newContent,
//     }: {
//       postId: string;
//       newContent: string;
//     }) => {
//       const { error } = await supabase
//         .from("posts")
//         .update({ content: newContent })
//         .eq("id", postId);

//       if (error) throw error;
//     },
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["posts"] });
//       setEditContent(null); // Clear the edit state
//     },
//   });

//   // Mutation for deleting a post
//   const deletePost = useMutation({
//     mutationFn: async (postId: string) => {
//       const { error } = await supabase.from("posts").delete().eq("id", postId);

//       if (error) throw error;
//     },
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["posts"] });
//     },
//   });

//   // Mutation for toggling likes
//   const toggleLike = useMutation({
//     mutationFn: async (postId: string) => {
//       if (!user) throw new Error("User not authenticated");

//       const { data: userData } = await supabase
//         .from("users")
//         .select("id")
//         .eq("clerk_id", user.id)
//         .single();

//       const { data: existingLike } = await supabase
//         .from("likes")
//         .select("*")
//         .eq("post_id", postId)
//         .eq("user_id", userData?.id)
//         .single();

//       if (existingLike) {
//         await supabase.from("likes").delete().eq("id", existingLike.id);
//       } else {
//         await supabase.from("likes").insert({
//           post_id: postId,
//           user_id: userData?.id,
//         });
//       }
//     },
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["posts"] });
//     },
//   });

//   // Mutation for adding comments
//   const addComment = useMutation({
//     mutationFn: async ({
//       postId,
//       content,
//     }: {
//       postId: string;
//       content: string;
//     }) => {
//       if (!user) throw new Error("User not authenticated");

//       const { data: userData } = await supabase
//         .from("users")
//         .select("id")
//         .eq("clerk_id", user.id)
//         .single();

//       const { error } = await supabase.from("comments").insert({
//         content,
//         post_id: postId,
//         user_id: userData?.id,
//       });

//       if (error) throw error;
//     },
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["posts"] });
//       setCommentContent({});
//     },
//   });

//   const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
//     const file = event.target.files?.[0];
//     if (file) {
//       setSelectedImage(file);
//       const reader = new FileReader();
//       reader.onloadend = () => setImagePreview(reader.result as string);
//       reader.readAsDataURL(file);
//     }
//   };

//   const handleShare = async (post: Post) => {
//     try {
//       await navigator.share({
//         title: "Check out this post!",
//         text: post.content,
//         url: window.location.href,
//       });
//     } catch (error) {
//       console.error("Error sharing:", error);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-800 text-white">
//       <div className="max-w-2xl mx-auto px-4 py-6">
//         {/* Create Post */}
//         <div className="bg-gray-700 rounded-xl p-6 mb-6 shadow-xl transform transition-all hover:scale-105 duration-300 ease-in-out">
//           <div className="flex items-start space-x-3">
//             <img
//               src={user?.imageUrl}
//               alt="Profile"
//               className="w-12 h-12 rounded-full transition-transform hover:scale-110"
//             />
//             <div className="flex-1 space-y-4">
//               <textarea
//                 value={content}
//                 onChange={(e) => setContent(e.target.value)}
//                 placeholder="What's on your mind?"
//                 className="w-full bg-gray-600 rounded-lg p-4 text-white placeholder-gray-400 border-none resize-none focus:ring-2 focus:ring-blue-500 min-h-[120px] focus:outline-none"
//               />
//               {imagePreview && (
//                 <div className="relative rounded-lg overflow-hidden shadow-lg">
//                   <img
//                     src={imagePreview}
//                     alt="Preview"
//                     className="max-h-96 w-full object-cover transition-transform duration-500 transform hover:scale-105"
//                   />
//                   <button
//                     onClick={() => {
//                       setImagePreview(null);
//                       setSelectedImage(null);
//                     }}
//                     className="absolute top-2 right-2 p-2 bg-gray-900 rounded-full hover:bg-gray-800"
//                   >
//                     <XMarkIcon className="w-6 h-6 text-white" />
//                   </button>
//                 </div>
//               )}
//               <div className="flex items-center justify-between">
//                 <input
//                   ref={imageInputRef}
//                   type="file"
//                   accept="image/*"
//                   onChange={handleImageSelect}
//                   className="hidden"
//                 />
//                 <button
//                   onClick={() => imageInputRef.current?.click()}
//                   className="text-white flex items-center space-x-2 hover:text-blue-500"
//                 >
//                   <PhotoIcon className="w-6 h-6" />
//                   <span>Upload Image</span>
//                 </button>
//                 <button
//                   onClick={() => createPost.mutate()}
//                   disabled={!content && !selectedImage}
//                   className="text-white bg-blue-500 px-4 py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50"
//                 >
//                   Post
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Feed Posts */}
//         {isLoading ? (
//           <div>Loading posts...</div>
//         ) : (
//           posts?.map((post) => (
//             <div
//               key={post.id}
//               className="bg-gray-700 rounded-xl p-6 mb-6 shadow-lg transition-all hover:scale-105 duration-300 ease-in-out"
//             >
//               <div className="flex items-start space-x-3">
//                 <img
//                   src={user?.imageUrl}
//                   alt="Profile"
//                   className="w-12 h-12 rounded-full"
//                 />
//                 <div className="flex-1">
//                   <div className="flex justify-between items-center">
//                     <div className="font-semibold">{post.user_id}</div>
//                     <div className="text-sm text-gray-400">
//                       {post.created_at}
//                     </div>
//                   </div>
//                   {editContent === post.id ? (
//                     <div>
//                       <textarea
//                         value={post.content}
//                         onChange={(e) => setEditContent(e.target.value)}
//                         className="w-full bg-gray-600 rounded-lg p-4 text-white placeholder-gray-400 border-none resize-none focus:ring-2 focus:ring-blue-500 min-h-[120px] focus:outline-none"
//                       />
//                     </div>
//                   ) : (
//                     <div>{post.content}</div>
//                   )}

//                   {post.image_url && (
//                     <img
//                       src={post.image_url}
//                       alt="Post Image"
//                       className="w-full mt-4 rounded-lg object-cover"
//                     />
//                   )}

//                   <div className="flex items-center mt-4 space-x-4">
//                     <button
//                       onClick={() => toggleLike.mutate(post.id)}
//                       className="flex items-center space-x-2 text-gray-400 hover:text-red-500"
//                     >
//                       {post.likes.length ? (
//                         <HeartSolid className="w-6 h-6" />
//                       ) : (
//                         <HeartOutline className="w-6 h-6" />
//                       )}
//                       <span>{post.likes.length}</span>
//                     </button>
//                     <button
//                       onClick={() =>
//                         setShowComments((prev) => ({
//                           ...prev,
//                           [post.id]: !prev[post.id],
//                         }))
//                       }
//                       className="flex items-center space-x-2 text-gray-400 hover:text-blue-500"
//                     >
//                       <ChatBubbleOvalLeftEllipsisIcon className="w-6 h-6" />
//                       <span>{post.comments.length}</span>
//                     </button>
//                     <button
//                       onClick={() => handleShare(post)}
//                       className="flex items-center space-x-2 text-gray-400 hover:text-green-500"
//                     >
//                       <ShareIcon className="w-6 h-6" />
//                     </button>
//                   </div>

//                   {showComments[post.id] && (
//                     <div className="mt-4 space-y-4">
//                       {post.comments.map((comment) => (
//                         <div
//                           key={comment.id}
//                           className="bg-gray-800 p-4 rounded-lg"
//                         >
//                           <div>{comment.content}</div>
//                         </div>
//                       ))}
//                       <div className="mt-4 flex space-x-3">
//                         <input
//                           type="text"
//                           value={commentContent[post.id] || ""}
//                           onChange={(e) =>
//                             setCommentContent((prev) => ({
//                               ...prev,
//                               [post.id]: e.target.value,
//                             }))
//                           }
//                           placeholder="Add a comment..."
//                           className="w-full bg-gray-600 text-white p-2 rounded-lg"
//                         />
//                         <button
//                           onClick={() =>
//                             addComment.mutate({
//                               postId: post.id,
//                               content: commentContent[post.id],
//                             })
//                           }
//                           disabled={!commentContent[post.id]}
//                           className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50"
//                         >
//                           Comment
//                         </button>
//                       </div>
//                     </div>
//                   )}
//                 </div>
//                 <div className="space-x-2">
//                   <button onClick={() => setEditContent(post.id)}>
//                     <PencilIcon className="w-6 h-6 text-yellow-500" />
//                   </button>
//                   <button onClick={() => deletePost.mutate(post.id)}>
//                     <TrashIcon className="w-6 h-6 text-red-500" />
//                   </button>
//                 </div>
//               </div>
//             </div>
//           ))
//         )}
//       </div>
//     </div>
//   );
// }


import React, { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { CreatePost } from "./CreatePost";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import {
  HeartIcon,
  ChatBubbleOvalLeftIcon,
  ShareIcon,
  LinkIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolid } from "@heroicons/react/24/solid";

interface Post {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  username: string;
  userImage: string;
  image_url?: string;
  comments: Comment[];
  likes: Like[];
  isLiked: boolean;
}

interface Comment {
  id: string;
  content: string;
  user_id: string;
  created_at: string;
  username: string;
  userImage: string;
}

interface Like {
  id: string;
  user_id: string;
}

const api = {
  getPosts: async () => {
    const res = await fetch("/api/posts");
    if (!res.ok) throw new Error("Failed to fetch posts");
    return res.json();
  },
  toggleLike: async (postId: string) => {
    const res = await fetch(`/api/posts/${postId}/like`, { method: "POST" });
    if (!res.ok) throw new Error("Failed to toggle like");
  },
  deletePost: async (postId: string) => {
    const res = await fetch(`/api/posts/${postId}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Failed to delete post");
  },
  addComment: async (postId: string, content: string) => {
    const res = await fetch(`/api/posts/${postId}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content }),
    });
    if (!res.ok) throw new Error("Failed to add comment");
    return res.json();
  },
};

export default function Feed() {
  const queryClient = useQueryClient();
  const [commentContent, setCommentContent] = useState("");

  const { data: posts, isLoading } = useQuery<Post[]>({
    queryKey: ["posts"],
    queryFn: api.getPosts,
  });

  const handleLike = async (postId: string) => {
    try {
      await api.toggleLike(postId);
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to like post",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (postId: string) => {
    try {
      await api.deletePost(postId);
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      toast({ title: "Success", description: "Post deleted" });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete post",
        variant: "destructive",
      });
    }
  };

  const handleComment = async (postId: string) => {
    if (!commentContent.trim()) return;
    try {
      await api.addComment(postId, commentContent);
      setCommentContent("");
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      toast({ title: "Success", description: "Comment added" });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add comment",
        variant: "destructive",
      });
    }
  };

  const handleShare = async (postId: string) => {
    try {
      await navigator.clipboard.writeText(
        `${window.location.origin}/posts/${postId}`
      );
      toast({ title: "Success", description: "Link copied" });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy link",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-2xl mx-auto p-4 space-y-6">
        <CreatePost
          onSuccess={() =>
            queryClient.invalidateQueries({ queryKey: ["posts"] })
          }
        />

        <AnimatePresence>
          {posts?.map((post) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-gray-800 rounded-xl p-6 shadow-lg"
            >
              <div className="flex items-start space-x-4">
                <img
                  src={post.userImage}
                  alt={post.username}
                  className="w-12 h-12 rounded-full"
                />
                <div className="flex-1 space-y-4">
                  <div className="flex justify-between">
                    <h3 className="font-semibold">{post.username}</h3>
                    <span className="text-gray-400 text-sm">
                      {new Date(post.created_at).toLocaleDateString()}
                    </span>
                  </div>

                  <p className="text-gray-200">{post.content}</p>

                  {post.image_url && (
                    <img
                      src={post.image_url}
                      alt=""
                      className="rounded-lg w-full object-cover max-h-[500px]"
                    />
                  )}

                  <div className="flex items-center space-x-6">
                    <Button
                      variant="ghost"
                      onClick={() => handleLike(post.id)}
                      className="text-gray-400 hover:text-red-500"
                    >
                      {post.isLiked ? (
                        <HeartSolid className="w-5 h-5 text-red-500" />
                      ) : (
                        <HeartIcon className="w-5 h-5" />
                      )}
                      <span className="ml-2">{post.likes.length}</span>
                    </Button>

                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="ghost"
                          className="text-gray-400 hover:text-blue-400"
                        >
                          <ChatBubbleOvalLeftIcon className="w-5 h-5 mr-2" />
                          {post.comments.length}
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="bg-gray-800 text-white">
                        <DialogHeader>
                          <DialogTitle>Comments</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          {post.comments.map((comment) => (
                            <div
                              key={comment.id}
                              className="p-4 bg-gray-700 rounded-lg"
                            >
                              <div className="flex items-start space-x-3">
                                <img
                                  src={comment.userImage}
                                  alt=""
                                  className="w-8 h-8 rounded-full"
                                />
                                <div>
                                  <div className="font-semibold">
                                    {comment.username}
                                  </div>
                                  <p className="text-gray-300">
                                    {comment.content}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))}
                          <div className="flex space-x-2">
                            <input
                              value={commentContent}
                              onChange={(e) =>
                                setCommentContent(e.target.value)
                              }
                              placeholder="Write a comment..."
                              className="flex-1 bg-gray-700 rounded-lg px-4 py-2"
                            />
                            <Button onClick={() => handleComment(post.id)}>
                              Send
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>

                    <Button
                      variant="ghost"
                      onClick={() => handleShare(post.id)}
                      className="text-gray-400 hover:text-green-400"
                    >
                      <ShareIcon className="w-5 h-5" />
                    </Button>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          className="text-gray-400 hover:text-red-400"
                        >
                          <TrashIcon className="w-5 h-5" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="bg-gray-800 text-white">
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Post</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure? This cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel className="bg-gray-700 hover:bg-gray-600">
                            Cancel
                          </AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(post.id)}
                            className="bg-red-500 hover:bg-red-600"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}