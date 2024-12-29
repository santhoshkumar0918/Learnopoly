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

"use client";

import { useState, useRef } from "react";
import { useUser } from "@clerk/nextjs";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@supabase/supabase-js";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import {
  Heart,
  MessageCircle,
  Share,
  Image as ImageIcon,
  MoreVertical,
  Pencil,
  Trash2,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

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
  const [editingPost, setEditingPost] = useState<{
    id: string;
    content: string;
  } | null>(null);
  const [commentContent, setCommentContent] = useState<Record<string, string>>(
    {}
  );
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [showComments, setShowComments] = useState<Record<string, boolean>>({});
  const imageInputRef = useRef<HTMLInputElement>(null);
  const { user, isLoaded } = useUser();
  const queryClient = useQueryClient();

  // Query and mutation functions remain the same
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

  // Existing mutations remain the same but editPost is updated
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
      setEditingPost(null);
    },
  });

  // Other mutation functions remain the same

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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        {/* Create Post Card */}
        <Card className="border-teal-200 dark:border-teal-800 shadow-lg">
          <CardHeader className="space-y-4">
            <div className="flex items-start space-x-3">
              <Avatar>
                <AvatarImage src={user?.imageUrl} alt="Profile" />
                <AvatarFallback>{user?.firstName?.[0] || "U"}</AvatarFallback>
              </Avatar>
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="What's on your mind?"
                className="flex-1 min-h-[120px] resize-none focus:ring-teal-500"
              />
            </div>
          </CardHeader>

          {imagePreview && (
            <CardContent>
              <div className="relative rounded-lg overflow-hidden">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="max-h-96 w-full object-cover"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2"
                  onClick={() => {
                    setImagePreview(null);
                    setSelectedImage(null);
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          )}

          <CardFooter className="justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => imageInputRef.current?.click()}
              className="text-teal-600 hover:text-teal-700 hover:bg-teal-50"
            >
              <ImageIcon className="w-4 h-4 mr-2" />
              Upload Image
            </Button>
            <input
              ref={imageInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageSelect}
              className="hidden"
            />
            <Button
              onClick={() => createPost.mutate()}
              disabled={!content && !selectedImage}
              className="bg-teal-600 hover:bg-teal-700 text-white"
            >
              Post
            </Button>
          </CardFooter>
        </Card>

        {/* Feed Posts */}
        {isLoading ? (
          <div className="text-center text-gray-500">Loading posts...</div>
        ) : (
          posts?.map((post) => (
            <Card
              key={post.id}
              className="border-teal-200 dark:border-teal-800 shadow-lg"
            >
              <CardHeader className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar>
                      <AvatarImage src={user?.imageUrl} alt="Profile" />
                      <AvatarFallback>{post.user_id ? post.user_id[0] : "U"}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-semibold">{post.user_id}</div>
                      <div className="text-sm text-gray-500">
                        {post.created_at}
                      </div>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() =>
                          setEditingPost({ id: post.id, content: post.content })
                        }
                      >
                        <Pencil className="h-4 w-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => deletePost.mutate(post.id)}
                        className="text-red-600"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {editingPost?.id === post.id ? (
                  <div className="space-y-4">
                    <Textarea
                      value={editingPost.content}
                      onChange={(e) =>
                        setEditingPost({
                          ...editingPost,
                          content: e.target.value,
                        })
                      }
                      className="w-full"
                    />
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="outline"
                        onClick={() => setEditingPost(null)}
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={() =>
                          editPost.mutate({
                            postId: editingPost.id,
                            newContent: editingPost.content,
                          })
                        }
                        className="bg-teal-600 hover:bg-teal-700 text-white"
                      >
                        Save
                      </Button>
                    </div>
                  </div>
                ) : (
                  <p>{post.content}</p>
                )}

                {post.image_url && (
                  <img
                    src={post.image_url}
                    alt="Post"
                    className="w-full rounded-lg object-cover"
                  />
                )}
              </CardContent>

              <CardFooter className="flex justify-between pt-4">
                <div className="flex space-x-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleLike.mutate(post.id)}
                    className={cn(
                      "text-gray-600 hover:text-red-600",
                      post.likes.length && "text-red-600"
                    )}
                  >
                    <Heart className="h-4 w-4 mr-2" />
                    {post.likes.length}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      setShowComments((prev) => ({
                        ...prev,
                        [post.id]: !prev[post.id],
                      }))
                    }
                    className="text-gray-600 hover:text-teal-600"
                  >
                    <MessageCircle className="h-4 w-4 mr-2" />
                    {post.comments.length}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleShare(post)}
                    className="text-gray-600 hover:text-teal-600"
                  >
                    <Share className="h-4 w-4" />
                  </Button>
                </div>
              </CardFooter>

              {showComments[post.id] && (
                <div className="px-6 pb-6 space-y-4">
                  <Separator className="my-4" />
                  {post.comments.map((comment) => (
                    <Card
                      key={comment.id}
                      className="bg-gray-50 dark:bg-gray-800"
                    >
                      <CardContent className="py-4">
                        <p>{comment.content}</p>
                      </CardContent>
                    </Card>
                  ))}
                  <div className="flex space-x-2">
                    <Input
                      value={commentContent[post.id] || ""}
                      onChange={(e) =>
                        setCommentContent((prev) => ({
                          ...prev,
                          [post.id]: e.target.value,
                        }))
                      }
                      placeholder="Add a comment..."
                      className="flex-1"
                    />
                    <Button
                      onClick={() =>
                        addComment.mutate({
                          postId: post.id,
                          content: commentContent[post.id],
                        })
                      }
                      disabled={!commentContent[post.id]}
                      className="bg-teal-600 hover:bg-teal-700 text-white"
                    >
                      Comment
                    </Button>
                  </div>
                </div>
              )}
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
async function uploadImage(file: File): Promise<string> {
  const fileExt = file.name.split(".").pop();
  const fileName = `${Math.random()}.${fileExt}`;
  const { error, data } = await supabase.storage
    .from("post-images")
    .upload(fileName, file);
  if (error) throw error;
  return data.path;
}
