// // import { User } from "@clerk/nextjs/server";
// // import { UseMutationResult } from "@tanstack/react-query";
// // import {
// //   Card,
// //   CardContent,
// //   CardFooter,
// //   CardHeader,
// // } from "@/components/ui/card";
// // import { Button } from "@/components/ui/button";
// // import { Textarea } from "@/components/ui/textarea";
// // import { Input } from "@/components/ui/input";
// // import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// // import { formatDistanceToNow } from "date-fns";
// // import { Heart, MessageCircle, Share2 } from "lucide-react";
// // import { useState } from "react";

// // interface Post {
// //   id: string;
// //   content: string;
// //   author: {
// //     id: string;
// //     name: string;
// //     imageUrl: string;
// //   };
// //   createdAt: string;
// //   likes: number;
// //   comments: number;
// // }

// // interface PostListProps {
// //   posts: Post[];
// //   currentUser: User;
// //   onLike: (postId: string) => void;
// //   onComment: (postId: string, comment: string) => void;
// //   onShare: (postId: string) => void;
// // }

// // const PostList = ({
// //   posts,
// //   currentUser,
// //   onLike,
// //   onComment,
// //   onShare,
// // }: PostListProps) => {
// //   const [commentText, setCommentText] = useState<{ [key: string]: string }>({});

// //   const handleCommentSubmit = (postId: string) => {
// //     if (commentText[postId]?.trim()) {
// //       onComment(postId, commentText[postId]);
// //       setCommentText((prev) => ({ ...prev, [postId]: "" }));
// //     }
// //   };

// //   return (
// //     <div className="space-y-4">
// //       {posts.map((post) => (
// //         <Card key={post.id} className="w-full">
// //           <CardHeader className="flex flex-row items-center gap-4">
// //             <Avatar>
// //               <AvatarImage src={post.author.imageUrl} alt={post.author.name} />
// //               <AvatarFallback>{post.author.name[0]}</AvatarFallback>
// //             </Avatar>
// //             <div className="flex flex-col">
// //               <span className="font-semibold">{post.author.name}</span>
// //               <span className="text-sm text-gray-500">
// //                 {formatDistanceToNow(new Date(post.createdAt), {
// //                   addSuffix: true,
// //                 })}
// //               </span>
// //             </div>
// //           </CardHeader>

// //           <CardContent>
// //             <p className="text-gray-700">{post.content}</p>
// //           </CardContent>

// //           <CardFooter className="flex flex-col gap-4">
// //             <div className="flex items-center justify-between w-full">
// //               <Button
// //                 variant="ghost"
// //                 size="sm"
// //                 className="flex items-center gap-2"
// //                 onClick={() => onLike(post.id)}
// //               >
// //                 <Heart className="w-4 h-4" />
// //                 <span>{post.likes}</span>
// //               </Button>

// //               <Button
// //                 variant="ghost"
// //                 size="sm"
// //                 className="flex items-center gap-2"
// //               >
// //                 <MessageCircle className="w-4 h-4" />
// //                 <span>{post.comments}</span>
// //               </Button>

// //               <Button
// //                 variant="ghost"
// //                 size="sm"
// //                 className="flex items-center gap-2"
// //                 onClick={() => onShare(post.id)}
// //               >
// //                 <Share2 className="w-4 h-4" />
// //                 <span>Share</span>
// //               </Button>
// //             </div>

// //             <div className="w-full">
// //               <div className="flex gap-2">
// //                 <Input
// //                   placeholder="Write a comment..."
// //                   value={commentText[post.id] || ""}
// //                   onChange={(e) =>
// //                     setCommentText((prev) => ({
// //                       ...prev,
// //                       [post.id]: e.target.value,
// //                     }))
// //                   }
// //                   className="flex-grow"
// //                 />
// //                 <Button
// //                   onClick={() => handleCommentSubmit(post.id)}
// //                   disabled={!commentText[post.id]?.trim()}
// //                 >
// //                   Comment
// //                 </Button>
// //               </div>
// //             </div>
// //           </CardFooter>
// //         </Card>
// //       ))}
// //     </div>
// //   );
// // };

// // export default PostList;


// import { UserResource } from "@clerk/types";
// import { UseMutationResult } from "@tanstack/react-query";
// import {
//   Card,
//   CardContent,
//   CardFooter,
//   CardHeader,
// } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Textarea } from "@/components/ui/textarea";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { formatDistanceToNow } from "date-fns";
// import { Heart, MessageCircle, Share2, Edit, Trash2 } from "lucide-react";

// interface Post {
//   id: string;
//   user_id: string;
//   content: string;
//   image_url?: string;
//   created_at: string;
//   likes: Array<{ user_id: string }>;
//   author: {
//     id: string;
//     name: string;
//     imageUrl: string;
//   };
// }

// interface PostListProps {
//   posts: Post[];
//   isLoading: boolean;
//   user: UserResource | null;
//   editingPost: { id: string; content: string } | null;
//   setEditingPost: (post: { id: string; content: string } | null) => void;
//   deletePost: UseMutationResult<void, Error, string>;
//   editPost: UseMutationResult<
//     void,
//     Error,
//     { postId: string; newContent: string }
//   >;
//   toggleLike: UseMutationResult<void, Error, string>;
// }

// const PostList = ({
//   posts,
//   isLoading,
//   user,
//   editingPost,
//   setEditingPost,
//   deletePost,
//   editPost,
//   toggleLike,
// }: PostListProps) => {
//   const handleLike = (postId: string) => {
//     toggleLike.mutate(postId);
//   };

//   return (
//     <div className="space-y-4">
//       {isLoading ? (
//         <div>Loading posts...</div>
//       ) : (
//         posts.map((post) => (
//           <Card key={post.id} className="bg-gray-800/50 backdrop-blur-lg">
//             <CardHeader className="flex items-start space-x-4">
//               <Avatar className="h-10 w-10 ring-2 ring-teal-500">
//                 <AvatarImage src={post.author.imageUrl} />
//                 <AvatarFallback>{post.author.name?.[0]}</AvatarFallback>
//               </Avatar>
//               <div>
//                 <p className="font-semibold text-teal-300">
//                   {post.author.name}
//                 </p>
//                 <p className="text-xs text-gray-500">
//                   {formatDistanceToNow(new Date(post.created_at))} ago
//                 </p>
//               </div>
//             </CardHeader>
//             <CardContent className="text-gray-300">
//               <p>{post.content}</p>
//               {post.image_url && <img src={post.image_url} alt="Post Image" />}
//             </CardContent>
//             <CardFooter className="space-x-4">
//               <Button
//                 onClick={() => handleLike(post.id)}
//                 className="text-teal-400"
//               >
//                 <Heart />
//               </Button>
//               <Button className="text-teal-400">
//                 <MessageCircle />
//               </Button>
//               <Button className="text-teal-400">
//                 <Share2 />
//               </Button>
//               {user?.id === post.user_id && (
//                 <>
//                   <Button
//                     onClick={() =>
//                       setEditingPost({ id: post.id, content: post.content })
//                     }
//                   >
//                     <Edit />
//                   </Button>
//                   <Button
//                     onClick={() => deletePost.mutate(post.id)}
//                     className="text-red-500"
//                   >
//                     <Trash2 />
//                   </Button>
//                 </>
//               )}
//             </CardFooter>
//           </Card>
//         ))
//       )}
//     </div>
//   );
// };

// export default PostList;
