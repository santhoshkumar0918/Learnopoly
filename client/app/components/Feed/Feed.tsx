

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
//     <div className="min-h-screen bg-gray-900 text-white">
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

import React, { useState, useRef, useCallback } from "react";
import { useUser } from "@clerk/nextjs";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@supabase/supabase-js";
import { Heart, MessageCircle, Share2, Image as ImageIcon, X, Send, MoreHorizontal, Loader2, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// TypeScript Interfaces
interface User {
  id: string;
  fullName: string;
  imageUrl: string;
}

interface Post {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  image_url?: string;
  comments: Comment[];
  likes: Like[];
  user: User;
}

interface Comment {
  id: string;
  content: string;
  user_id: string;
  created_at: string;
  user: User;
}

interface Like {
  id: string;
  user_id: string;
}

interface CreatePostInput {
  content: string;
  image_url?: string;
}

interface CreateCommentInput {
  postId: string;
  content: string;
}

export default function Feed() {
  // State management
  const [content, setContent] = useState("");
  const [commentContent, setCommentContent] = useState<Record<string, string>>({});
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [showComments, setShowComments] = useState<Record<string, boolean>>({});
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Refs and hooks
  const imageInputRef = useRef<HTMLInputElement>(null);
  const { user, isLoaded } = useUser();
  const queryClient = useQueryClient();

  // Fetch posts query
  const { data: posts, isLoading: isLoadingPosts, error: postsError } = useQuery({
    queryKey: ['posts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('posts')
        .select(`
          *,
          user:users(*),
          comments(*, user:users(*)),
          likes(*)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Post[];
    }
  });

  // Create post mutation
  const createPost = useMutation({
    mutationFn: async (input: CreatePostInput) => {
      const { data, error } = await supabase
        .from('posts')
        .insert([input])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      setContent("");
      setSelectedImage(null);
      setImagePreview(null);
      setError(null);
    },
    onError: (error) => {
      setError("Failed to create post. Please try again.");
    }
  });

  // Toggle like mutation with optimistic updates
  const toggleLike = useMutation({
    mutationFn: async (postId: string) => {
      const existingLike = posts?.find(p => p.id === postId)?.likes.find(l => l.user_id === user?.id);

      if (existingLike) {
        const { error } = await supabase
          .from('likes')
          .delete()
          .match({ id: existingLike.id });

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('likes')
          .insert([{ post_id: postId, user_id: user?.id }]);

        if (error) throw error;
      }
    },
    onMutate: async (postId) => {
      await queryClient.cancelQueries({ queryKey: ['posts'] });
      const previousPosts = queryClient.getQueryData<Post[]>(['posts']);

      queryClient.setQueryData<Post[]>(['posts'], (old) =>
        old?.map(post => {
          if (post.id === postId) {
            const isLiked = post.likes.some(like => like.user_id === user?.id);
            return {
              ...post,
              likes: isLiked
                ? post.likes.filter(like => like.user_id !== user?.id)
                : [...post.likes, { id: 'temp', user_id: user!.id }]
            };
          }
          return post;
        })
      );

      return { previousPosts };
    },
    onError: (err, postId, context) => {
      queryClient.setQueryData(['posts'], context?.previousPosts);
      setError("Failed to update like. Please try again.");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    }
  });

  // Add comment mutation
  const addComment = useMutation({
    mutationFn: async ({ postId, content }: CreateCommentInput) => {
      const { data, error } = await supabase
        .from('comments')
        .insert([{ post_id: postId, user_id: user?.id, content }])
        .select('*, user:users(*)');

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      setCommentContent({ ...commentContent, [variables.postId]: '' });
    },
    onError: () => {
      setError("Failed to add comment. Please try again.");
    }
  });

  // Image handling
  const handleImageSelect = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setError("Image size must be less than 5MB");
      return;
    }

    setSelectedImage(file);
    setImagePreview(URL.createObjectURL(file));
  }, []);

  const uploadImage = async (file: File): Promise<string> => {
    setIsUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const { data, error } = await supabase.storage
        .from('post-images')
        .upload(fileName, file);

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from('post-images')
        .getPublicUrl(fileName);

      return publicUrl;
    } catch (error) {
      throw new Error('Failed to upload image');
    } finally {
      setIsUploading(false);
    }
  };

  // UI Components
  const PostSkeleton = () => (
    <Card className="animate-pulse">
      <CardHeader className="flex flex-row items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700" />
        <div className="space-y-2">
          <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded" />
          <div className="h-3 w-16 bg-gray-200 dark:bg-gray-700 rounded" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-700 rounded" />
          <div className="h-4 w-1/2 bg-gray-200 dark:bg-gray-700 rounded" />
        </div>
      </CardContent>
    </Card>
  );

  const PostCard = ({ post }: { post: Post }) => {
    const isLiked = post.likes.some((like) => like.user_id === user?.id);
    const formattedDate = new Date(post.created_at).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });

    return (
      <Card className="overflow-hidden">
        <CardHeader className="flex flex-row items-start justify-between space-y-0">
          <div className="flex items-center space-x-4">
            <Avatar>
              <AvatarImage src={post.user.imageUrl} />
              <AvatarFallback>{post.user.fullName[0]}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold">{post.user.fullName}</h3>
              <p className="text-sm text-gray-500">{formattedDate}</p>
            </div>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {post.user_id === user?.id && (
                <DropdownMenuItem>Delete</DropdownMenuItem>
              )}
              <DropdownMenuItem>Report</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardHeader>

        <CardContent className="space-y-4">
          <p className="text-gray-900 dark:text-gray-100">{post.content}</p>
          {post.image_url && (
            <div className="rounded-lg overflow-hidden">
              <img
                src={post.image_url}
                alt="Post content"
                className="w-full object-cover max-h-[512px]"
                loading="lazy"
              />
            </div>
          )}
        </CardContent>

        <CardFooter className="flex justify-between border-t pt-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => toggleLike.mutate(post.id)}
            className={isLiked ? "text-pink-500 hover:text-pink-600" : ""}
          >
            <Heart className={`h-5 w-5 mr-1.5 ${isLiked ? "fill-current" : ""}`} />
            {post.likes.length}
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowComments({
              ...showComments,
              [post.id]: !showComments[post.id]
            })}
          >
            <MessageCircle className="h-5 w-5 mr-1.5" />
            {post.comments.length}
          </Button>

          <Button variant="ghost" size="sm">
            <Share2 className="h-5 w-5 mr-1.5" />
            Share
          </Button>
        </CardFooter>

        {showComments[post.id] && (
          <div className="px-4 pb-4 space-y-4 border-t bg-gray-50 dark:bg-gray-800/50">
            {post.comments.map((comment) => (
              <div key={comment.id} className="flex items-start space-x-3 pt-4">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={comment.user.imageUrl} />
                  <AvatarFallback>{comment.user.fullName[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-3 shadow-sm">
                    <p className="font-medium text-sm">{comment.user.fullName}</p>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      {comment.content}
                    </p>
                  </div>
                  <div className="mt-1">
                    <Button variant="ghost" size="sm" className="h-auto p-0 text-xs text-gray-500">
                      {new Date(comment.created_at).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        hour: "numeric",
                        minute: "2-digit",
                      })}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
            
            <div className="flex items-start space-x-3 pt-4">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user?.imageUrl} />
                <AvatarFallback>{user?.fullName?.[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1 relative">
                <Textarea
                  value={commentContent[post.id] || ""}
                  onChange={(e) => setCommentContent({
                    ...commentContent,
                    [post.id]: e.target.value,
                  })}
                  placeholder="Write a comment..."
                  className="min-h-[80px] pr-12"
                />
                <Button
                  size="sm"
                  className="absolute bottom-2 right-2"
                  disabled={!commentContent[post.id]?.trim() || addComment.isPending}
                  onClick={() => {
                    if (commentContent[post.id]?.trim()) {
                      addComment.mutate({
                        postId: post.id,
                        content: commentContent[post.id].trim(),
                      });
                    }
                  }}
                >
                  {addComment.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          </div>
        )}
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        {error && (
          <Alert variant="destructive" className="animate-in slide-in-from-top">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Failed to load posts. Please refresh the page.
            </AlertDescription>
              <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start space-x-4">
              <Avatar>
                <AvatarImage src={user?.imageUrl} />
                <AvatarFallback>{user?.fullName?.[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-4">
                <Textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="What's on your mind?"
                  className="min-h-[100px] resize-none"
                />

                {imagePreview && (
                  <div className="relative rounded-lg overflow-hidden">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="max-h-96 w-full object-cover rounded-lg"
                    />
                    <Button
                      size="sm"
                      variant="destructive"
                      className="absolute top-2 right-2"
                      onClick={() => {
                        setImagePreview(null);
                        setSelectedImage(null);
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                )}

                <div
                  className="border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-lg p-8 text-center transition-colors hover:border-gray-300 dark:hover:border-gray-600 cursor-pointer"
                  onClick={() => imageInputRef.current?.click()}
                >
                  <input
                    type="file"
                    accept="image/*"
                    ref={imageInputRef}
                    className="hidden"
                    onChange={handleImageSelect}
                  />
                  <div className="flex flex-col items-center space-y-2">
                    <ImageIcon className="h-8 w-8 text-gray-400" />
                    <p className="text-sm text-gray-500">
                      Drop an image here or click to upload
                    </p>
                    <p className="text-xs text-gray-400">
                      Maximum file size: 5MB
                    </p>
                  </div>
                </div>

                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setContent("");
                      setSelectedImage(null);
                      setImagePreview(null);
                    }}
                  >
                    Clear
                  </Button>
                  <Button
                    onClick={async () => {
                      try {
                        let imageUrl;
                        if (selectedImage) {
                          imageUrl = await uploadImage(selectedImage);
                        }
                        
                        await createPost.mutateAsync({
                          content: content.trim(),
                          image_url: imageUrl
                        });
                      } catch (err) {
                        setError("Failed to create post. Please try again.");
                      }
                    }}
                    disabled={(!content.trim() && !selectedImage) || createPost.isPending || isUploading}
                  >
                    {createPost.isPending || isUploading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        Posting...
                      </>
                    ) : (
                      "Post"
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          {isLoadingPosts ? (
            Array.from({ length: 3 }).map((_, i) => (
              <PostSkeleton key={i} />
            ))
          ) : postsError ? (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Failed to load posts. Please refresh the page.
              </AlertDescription>
            </Alert>
          ) : posts?.length === 0 ? (
            <Card className="p-8 text-center">
              <div className="flex flex-col items-center space-y-2">
                <MessageCircle className="h-8 w-8 text-gray-400" />
                <p className="text-gray-500">No posts yet. Be the first to share something!</p>
              </div>
            </Card>
          ) : (
            posts?.map((post) => (
              <PostCard key={post.id} post={post} />
            ))
          )}
        </div>

        {posts && posts.length > 0 && (
          <div className="flex justify-center pt-4">
            <Button
              variant="outline"
              onClick={() => {
                // Implement load more functionality
              }}
            >
              Load More
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}