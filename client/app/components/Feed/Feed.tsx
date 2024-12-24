

// "use client";

// import { useState, useRef } from "react";
// import { useUser } from "@clerk/nextjs";
// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// import { createClient } from "@supabase/supabase-js";
// import {
//   HeartIcon as HeartOutline,
//   ChatBubbleOvalLeftEllipsisIcon,
//   ShareIcon,
//   TrashIcon,
//   PhotoIcon,
//   XMarkIcon,
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
//   const [commentContent, setCommentContent] = useState<Record<string, string>>(
//     {}
//   );
//   const [selectedImage, setSelectedImage] = useState<File | null>(null);
//   const [imagePreview, setImagePreview] = useState<string | null>(null);
//   const [showComments, setShowComments] = useState<Record<string, boolean>>({});
//   const imageInputRef = useRef<HTMLInputElement>(null);
//   const { user, isLoaded } = useUser();
//   const queryClient = useQueryClient();

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

//   const uploadImage = async (file: File) => {
//     const fileExt = file.name.split(".").pop();
//     const fileName = `${Math.random()}.${fileExt}`;
//     const { error: uploadError } = await supabase.storage
//       .from("post-images")
//       .upload(fileName, file);
//     if (uploadError) throw uploadError;
//     return fileName;
//   };

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
//     <div className="min-h-screen bg-gray-100 text-white">
//       <div className="max-w-2xl mx-auto px-4 py-6">
//         {/* Create Post */}
//         <div className="bg-gray-800 rounded-xl p-4 mb-6">
//           <div className="flex items-start space-x-3">
//             <img
//               src={user?.imageUrl}
//               alt="Profile"
//               className="w-10 h-10 rounded-full"
//             />
//             <div className="flex-1 space-y-3">
//               <textarea
//                 value={content}
//                 onChange={(e) => setContent(e.target.value)}
//                 placeholder="What's happening?"
//                 className="w-full bg-gray-700 rounded-lg p-3 text-white placeholder-gray-400 border-none resize-none focus:ring-2 focus:ring-blue-500 min-h-[100px]"
//               />
//               {imagePreview && (
//                 <div className="relative rounded-lg overflow-hidden">
//                   <img
//                     src={imagePreview}
//                     alt="Preview"
//                     className="max-h-96 w-full object-cover"
//                   />
//                   <button
//                     onClick={() => {
//                       setImagePreview(null);
//                       setSelectedImage(null);
//                     }}
//                     className="absolute top-2 right-2 p-1 bg-gray-900 rounded-full hover:bg-gray-800"
//                   >
//                     <XMarkIcon className="w-5 h-5" />
//                   </button>
//                 </div>
//               )}
//               <div className="flex items-center justify-between">
//                 <input
//                   type="file"
//                   accept="image/*"
//                   ref={imageInputRef}
//                   className="hidden"
//                   onChange={handleImageSelect}
//                 />
//                 <button
//                   onClick={() => imageInputRef.current?.click()}
//                   className="p-2 hover:bg-gray-700 rounded-full transition-colors"
//                 >
//                   <PhotoIcon className="w-6 h-6 text-blue-400" />
//                 </button>
//                 <button
//                   onClick={() => createPost.mutate()}
//                   disabled={
//                     (!content.trim() && !selectedImage) || createPost.isPending
//                   }
//                   className="bg-blue-500 px-6 py-2 rounded-full font-semibold hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//                 >
//                   {createPost.isPending ? "Posting..." : "Post"}
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Posts Feed */}
//         <div className="space-y-6">
//           {posts?.map((post) => (
//             <div
//               key={post.id}
//               className="bg-gray-800 rounded-xl p-4 space-y-4 hover:bg-gray-750 transition-colors"
//             >
//               <div className="flex items-center space-x-3">
//                 <img
//                   src={user?.imageUrl}
//                   alt="Profile"
//                   className="w-10 h-10 rounded-full"
//                 />
//                 <div>
//                   <p className="font-semibold">{user?.fullName}</p>
//                   <p className="text-sm text-gray-400">
//                     {new Date(post.created_at).toLocaleDateString(undefined, {
//                       month: "short",
//                       day: "numeric",
//                     })}
//                   </p>
//                 </div>
//               </div>

//               <p className="text-lg">{post.content}</p>

//               {post.image_url && (
//                 <img
//                   src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/post-images/${post.image_url}`}
//                   alt="Post"
//                   className="rounded-xl max-h-96 w-full object-cover"
//                 />
//               )}

//               <div className="flex items-center space-x-6 pt-2">
//                 <button
//                   onClick={() => toggleLike.mutate(post.id)}
//                   className="flex items-center space-x-2 group"
//                 >
//                   {post.likes.some((like) => like.user_id === user?.id) ? (
//                     <HeartSolid className="w-6 h-6 text-pink-500" />
//                   ) : (
//                     <HeartOutline className="w-6 h-6 text-gray-400 group-hover:text-pink-500 transition-colors" />
//                   )}
//                   <span className="text-sm text-gray-400 group-hover:text-pink-500">
//                     {post.likes.length}
//                   </span>
//                 </button>

//                 <button
//                   onClick={() =>
//                     setShowComments({
//                       ...showComments,
//                       [post.id]: !showComments[post.id],
//                     })
//                   }
//                   className="flex items-center space-x-2 group"
//                 >
//                   <ChatBubbleOvalLeftEllipsisIcon className="w-6 h-6 text-gray-400 group-hover:text-blue-500" />
//                   <span className="text-sm text-gray-400 group-hover:text-blue-500">
//                     {post.comments.length}
//                   </span>
//                 </button>

//                 <button
//                   onClick={() => handleShare(post)}
//                   className="flex items-center space-x-2 group"
//                 >
//                   <ShareIcon className="w-6 h-6 text-gray-400 group-hover:text-green-500" />
//                 </button>
//               </div>

//               {showComments[post.id] && (
//                 <div className="space-y-4 mt-4 border-t border-gray-700 pt-4">
//                   {post.comments.map((comment) => (
//                     <div key={comment.id} className="flex space-x-3">
//                       <img
//                         src={user?.imageUrl}
//                         alt="Profile"
//                         className="w-8 h-8 rounded-full"
//                       />
//                       <div className="flex-1 bg-gray-700 rounded-lg p-3">
//                         <p className="text-sm">{comment.content}</p>
//                       </div>
//                     </div>
//                   ))}
//                   <div className="flex space-x-3">
//                     <img
//                       src={user?.imageUrl}
//                       alt="Profile"
//                       className="w-8 h-8 rounded-full"
//                     />
//                     <div className="flex-1 relative">
//                       <input
//                         type="text"
//                         value={commentContent[post.id] || ""}
//                         onChange={(e) =>
//                           setCommentContent({
//                             ...commentContent,
//                             [post.id]: e.target.value,
//                           })
//                         }
//                         placeholder="Add a comment..."
//                         className="w-full bg-gray-700 rounded-full py-2 px-4 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                       />
//                       <button
//                         onClick={() => {
//                           if (commentContent[post.id]?.trim()) {
//                             addComment.mutate({
//                               postId: post.id,
//                               content: commentContent[post.id],
//                             });
//                           }
//                         }}
//                         disabled={
//                           !commentContent[post.id]?.trim() ||
//                           addComment.isPending
//                         }
//                         className="absolute right-2 top-1/2 -translate-y-1/2 text-blue-500 hover:text-blue-400"
//                       >
//                         <svg
//                           className="w-5 h-5"
//                           fill="none"
//                           viewBox="0 0 24 24"
//                           stroke="currentColor"
//                         >
//                           <path
//                             strokeLinecap="round"
//                             strokeLinejoin="round"
//                             strokeWidth={2}
//                             d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
//                           />
//                         </svg>
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               )}
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }
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
//   const [editContent, setEditContent] = useState<string | null>(null);  // Store content for editing
//   const [commentContent, setCommentContent] = useState<Record<string, string>>({});
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

//   // Mutation for editing a post
//   const editPost = useMutation({
//     mutationFn: async ({ postId, newContent }: { postId: string, newContent: string }) => {
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
//     mutationFn: async ({ postId, content }: { postId: string; content: string }) => {
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
//                   <span className="text-sm">Add Image</span>
//                 </button>
//                 <button
//                   onClick={() => createPost.mutate()}
//                   className="bg-blue-500 text-white py-2 px-6 mt-4 rounded-full hover:bg-blue-600 transition-colors"
//                 >
//                   Post
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Posts Feed */}
//         {isLoading ? (
//           <div>Loading posts...</div>
//         ) : (
//           posts?.map((post) => (
//             <div key={post.id} className="bg-gray-700 rounded-xl p-6 mb-6 shadow-lg transform transition-all hover:scale-105 duration-300 ease-in-out">
//               <div className="flex items-start space-x-3">
//                 <img
//                   src={user?.imageUrl}
//                   alt="User"
//                   className="w-12 h-12 rounded-full transition-transform hover:scale-110"
//                 />
//                 <div className="flex-1 space-y-3">
//                   <p className="font-semibold">{user?.firstName} {user?.lastName}</p>
//                   {editContent === post.id ? (
//                     <textarea
//                       value={post.content}
//                       onChange={(e) => setEditContent(e.target.value)}
//                       className="w-full bg-gray-600 rounded-lg p-4 text-white placeholder-gray-400 border-none resize-none focus:ring-2 focus:ring-blue-500 min-h-[120px] focus:outline-none"
//                     />
//                   ) : (
//                     <p>{post.content}</p>
//                   )}
//                   <div className="flex items-center space-x-6 mt-4">
//                     <button
//                       onClick={() => toggleLike.mutate(post.id)}
//                       className="flex items-center space-x-1 text-white hover:text-blue-500 transition-colors"
//                     >
//                       <HeartOutline className="w-6 h-6" />
//                       <span className="text-sm">{post.likes.length}</span>
//                     </button>

//                     <button
//                       onClick={() =>
//                         setShowComments((prev) => ({
//                           ...prev,
//                           [post.id]: !prev[post.id],
//                         }))
//                       }
//                       className="flex items-center space-x-1 text-white hover:text-blue-500 transition-colors"
//                     >
//                       <ChatBubbleOvalLeftEllipsisIcon className="w-6 h-6" />
//                       <span className="text-sm">{post.comments.length}</span>
//                     </button>

//                     <button
//                       onClick={() => handleShare(post)}
//                       className="flex items-center space-x-1 text-white hover:text-blue-500 transition-colors"
//                     >
//                       <ShareIcon className="w-6 h-6" />
//                     </button>

//                     <button
//                       onClick={() => {
//                         if (editContent === post.id) {
//                           editPost.mutate({ postId: post.id, newContent: editContent });
//                         } else {
//                           setEditContent(post.id);
//                         }
//                       }}
//                       className="text-blue-500 hover:text-blue-600 transition-colors"
//                     >
//                       <PencilIcon className="w-6 h-6" />
//                     </button>

//                     <button
//                       onClick={() => deletePost.mutate(post.id)}
//                       className="text-red-500 hover:text-red-600 transition-colors"
//                     >
//                       <TrashIcon className="w-6 h-6" />
//                     </button>
//                   </div>
//                 </div>
//               </div>

//               {showComments[post.id] && (
//                 <div className="space-y-3 mt-4">
//                   {post.comments.map((comment) => (
//                     <div key={comment.id} className="bg-gray-600 p-3 rounded-lg">
//                       <p className="text-sm text-white">{comment.content}</p>
//                     </div>
//                   ))}

//                   <div className="mt-3">
//                     <input
//                       type="text"
//                       value={commentContent[post.id] || ""}
//                       onChange={(e) =>
//                         setCommentContent((prev) => ({
//                           ...prev,
//                           [post.id]: e.target.value,
//                         }))
//                       }
//                       placeholder="Add a comment"
//                       className="w-full bg-gray-600 rounded-lg p-3 text-white placeholder-gray-400 border-none resize-none focus:ring-2 focus:ring-blue-500"
//                     />
//                     <button
//                       onClick={() =>
//                         addComment.mutate({ postId: post.id, content: commentContent[post.id] })
//                       }
//                       className="bg-blue-500 text-white py-2 px-6 mt-3 rounded-full hover:bg-blue-600 transition-colors"
//                     >
//                       Post Comment
//                     </button>
//                   </div>
//                 </div>
//               )}
//             </div>
//           ))
//         )}
//       </div>
//     </div>
//   );
// }



"use client";

import { useState, useRef } from "react";
import { useUser } from "@clerk/nextjs";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@supabase/supabase-js";
import {
  HeartIcon as HeartOutline,
  ChatBubbleOvalLeftEllipsisIcon,
  ShareIcon,
  PhotoIcon,
  XMarkIcon,
  PencilIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolid } from "@heroicons/react/24/solid";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface Post {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  image_url?: string;
  comments: Comment[];
  likes: Like[];
}

interface Comment {
  id: string;
  content: string;
  user_id: string;
  created_at: string;
}

interface Like {
  id: string;
  user_id: string;
}

export default function Feed() {
  const [content, setContent] = useState("");
  const [editContent, setEditContent] = useState<string | null>(null); // Store content for editing
  const [commentContent, setCommentContent] = useState<Record<string, string>>(
    {}
  );
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [showComments, setShowComments] = useState<Record<string, boolean>>({});
  const imageInputRef = useRef<HTMLInputElement>(null);
  const { user, isLoaded } = useUser();
  const queryClient = useQueryClient();

  // Query to fetch posts
  const { data: posts, isLoading } = useQuery({
    queryKey: ["posts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("posts")
        .select(
          `
          id, content, created_at, user_id, image_url,
          comments(id, content, user_id, created_at),
          likes(id, user_id)
        `
        )
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as Post[];
    },
    enabled: isLoaded && !!user,
  });

  // Function to upload image
  const uploadImage = async (file: File) => {
    const fileExt = file.name.split(".").pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const { error: uploadError } = await supabase.storage
      .from("post-images")
      .upload(fileName, file);
    if (uploadError) throw uploadError;
    return fileName;
  };

  // Mutation for creating a post
  const createPost = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error("User not authenticated");

      const { data: userData } = await supabase
        .from("users")
        .select("id")
        .eq("clerk_id", user.id)
        .single();

      let imagePath = null;
      if (selectedImage) {
        imagePath = await uploadImage(selectedImage);
      }

      const { error } = await supabase.from("posts").insert({
        content,
        user_id: userData?.id,
        image_url: imagePath,
      });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      setContent("");
      setSelectedImage(null);
      setImagePreview(null);
    },
  });

  // Mutation for editing a post
  const editPost = useMutation({
    mutationFn: async ({
      postId,
      newContent,
    }: {
      postId: string;
      newContent: string;
    }) => {
      const { error } = await supabase
        .from("posts")
        .update({ content: newContent })
        .eq("id", postId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      setEditContent(null); // Clear the edit state
    },
  });

  // Mutation for deleting a post
  const deletePost = useMutation({
    mutationFn: async (postId: string) => {
      const { error } = await supabase.from("posts").delete().eq("id", postId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });

  // Mutation for toggling likes
  const toggleLike = useMutation({
    mutationFn: async (postId: string) => {
      if (!user) throw new Error("User not authenticated");

      const { data: userData } = await supabase
        .from("users")
        .select("id")
        .eq("clerk_id", user.id)
        .single();

      const { data: existingLike } = await supabase
        .from("likes")
        .select("*")
        .eq("post_id", postId)
        .eq("user_id", userData?.id)
        .single();

      if (existingLike) {
        await supabase.from("likes").delete().eq("id", existingLike.id);
      } else {
        await supabase.from("likes").insert({
          post_id: postId,
          user_id: userData?.id,
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });

  // Mutation for adding comments
  const addComment = useMutation({
    mutationFn: async ({
      postId,
      content,
    }: {
      postId: string;
      content: string;
    }) => {
      if (!user) throw new Error("User not authenticated");

      const { data: userData } = await supabase
        .from("users")
        .select("id")
        .eq("clerk_id", user.id)
        .single();

      const { error } = await supabase.from("comments").insert({
        content,
        post_id: postId,
        user_id: userData?.id,
      });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      setCommentContent({});
    },
  });

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleShare = async (post: Post) => {
    try {
      await navigator.share({
        title: "Check out this post!",
        text: post.content,
        url: window.location.href,
      });
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-800 text-white">
      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Create Post */}
        <div className="bg-gray-700 rounded-xl p-6 mb-6 shadow-xl transform transition-all hover:scale-105 duration-300 ease-in-out">
          <div className="flex items-start space-x-3">
            <img
              src={user?.imageUrl}
              alt="Profile"
              className="w-12 h-12 rounded-full transition-transform hover:scale-110"
            />
            <div className="flex-1 space-y-4">
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="What's on your mind?"
                className="w-full bg-gray-600 rounded-lg p-4 text-white placeholder-gray-400 border-none resize-none focus:ring-2 focus:ring-blue-500 min-h-[120px] focus:outline-none"
              />
              {imagePreview && (
                <div className="relative rounded-lg overflow-hidden shadow-lg">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="max-h-96 w-full object-cover transition-transform duration-500 transform hover:scale-105"
                  />
                  <button
                    onClick={() => {
                      setImagePreview(null);
                      setSelectedImage(null);
                    }}
                    className="absolute top-2 right-2 p-2 bg-gray-900 rounded-full hover:bg-gray-800"
                  >
                    <XMarkIcon className="w-6 h-6 text-white" />
                  </button>
                </div>
              )}
              <div className="flex items-center justify-between">
                <input
                  ref={imageInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="hidden"
                />
                <button
                  onClick={() => imageInputRef.current?.click()}
                  className="text-white flex items-center space-x-2 hover:text-blue-500"
                >
                  <PhotoIcon className="w-6 h-6" />
                  <span>Upload Image</span>
                </button>
                <button
                  onClick={() => createPost.mutate()}
                  disabled={!content && !selectedImage}
                  className="text-white bg-blue-500 px-4 py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50"
                >
                  Post
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Feed Posts */}
        {isLoading ? (
          <div>Loading posts...</div>
        ) : (
          posts?.map((post) => (
            <div
              key={post.id}
              className="bg-gray-700 rounded-xl p-6 mb-6 shadow-lg transition-all hover:scale-105 duration-300 ease-in-out"
            >
              <div className="flex items-start space-x-3">
                <img
                  src={user?.imageUrl}
                  alt="Profile"
                  className="w-12 h-12 rounded-full"
                />
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <div className="font-semibold">{post.user_id}</div>
                    <div className="text-sm text-gray-400">
                      {post.created_at}
                    </div>
                  </div>
                  {editContent === post.id ? (
                    <div>
                      <textarea
                        value={post.content}
                        onChange={(e) => setEditContent(e.target.value)}
                        className="w-full bg-gray-600 rounded-lg p-4 text-white placeholder-gray-400 border-none resize-none focus:ring-2 focus:ring-blue-500 min-h-[120px] focus:outline-none"
                      />
                    </div>
                  ) : (
                    <div>{post.content}</div>
                  )}

                  {post.image_url && (
                    <img
                      src={post.image_url}
                      alt="Post Image"
                      className="w-full mt-4 rounded-lg object-cover"
                    />
                  )}

                  <div className="flex items-center mt-4 space-x-4">
                    <button
                      onClick={() => toggleLike.mutate(post.id)}
                      className="flex items-center space-x-2 text-gray-400 hover:text-red-500"
                    >
                      {post.likes.length ? (
                        <HeartSolid className="w-6 h-6" />
                      ) : (
                        <HeartOutline className="w-6 h-6" />
                      )}
                      <span>{post.likes.length}</span>
                    </button>
                    <button
                      onClick={() =>
                        setShowComments((prev) => ({
                          ...prev,
                          [post.id]: !prev[post.id],
                        }))
                      }
                      className="flex items-center space-x-2 text-gray-400 hover:text-blue-500"
                    >
                      <ChatBubbleOvalLeftEllipsisIcon className="w-6 h-6" />
                      <span>{post.comments.length}</span>
                    </button>
                    <button
                      onClick={() => handleShare(post)}
                      className="flex items-center space-x-2 text-gray-400 hover:text-green-500"
                    >
                      <ShareIcon className="w-6 h-6" />
                    </button>
                  </div>

                  {showComments[post.id] && (
                    <div className="mt-4 space-y-4">
                      {post.comments.map((comment) => (
                        <div
                          key={comment.id}
                          className="bg-gray-800 p-4 rounded-lg"
                        >
                          <div>{comment.content}</div>
                        </div>
                      ))}
                      <div className="mt-4 flex space-x-3">
                        <input
                          type="text"
                          value={commentContent[post.id] || ""}
                          onChange={(e) =>
                            setCommentContent((prev) => ({
                              ...prev,
                              [post.id]: e.target.value,
                            }))
                          }
                          placeholder="Add a comment..."
                          className="w-full bg-gray-600 text-white p-2 rounded-lg"
                        />
                        <button
                          onClick={() =>
                            addComment.mutate({
                              postId: post.id,
                              content: commentContent[post.id],
                            })
                          }
                          disabled={!commentContent[post.id]}
                          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50"
                        >
                          Comment
                        </button>
                      </div>
                    </div>
                  )}
                </div>
                <div className="space-x-2">
                  <button onClick={() => setEditContent(post.id)}>
                    <PencilIcon className="w-6 h-6 text-yellow-500" />
                  </button>
                  <button onClick={() => deletePost.mutate(post.id)}>
                    <TrashIcon className="w-6 h-6 text-red-500" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
