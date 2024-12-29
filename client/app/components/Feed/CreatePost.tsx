// // CreatePost.tsx
// import React, { useState, useRef } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { Button } from "@/components/ui/button";
// import { toast } from "@/hooks/use-toast";
// import { PhotoIcon, XMarkIcon } from "@heroicons/react/24/outline";

// interface CreatePostProps {
//   onSuccess: () => void;
// }

// export function CreatePost({ onSuccess }: CreatePostProps) {
//   const [content, setContent] = useState("");
//   const [image, setImage] = useState<File | null>(null);
//   const [preview, setPreview] = useState<string | null>(null);
//   const [isLoading, setIsLoading] = useState(false);
//   const fileRef = useRef<HTMLInputElement>(null);

//   const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       setImage(file);
//       const reader = new FileReader();
//       reader.onloadend = () => setPreview(reader.result as string);
//       reader.readAsDataURL(file);
//     }
//   };

//   const handleSubmit = async () => {
//     if (!content.trim()) return;

//     setIsLoading(true);
//     const formData = new FormData();
//     formData.append("content", content);
//     if (image) formData.append("image", image);

//     try {
//       const res = await fetch("/api/posts", {
//         method: "POST",
//         body: formData
//       });
      
//       if (!res.ok) throw new Error("Failed to create post");
      
//       setContent("");
//       setImage(null);
//       setPreview(null);
//       onSuccess();
//       toast({ title: "Success", description: "Post created" });
//     } catch (error) {
//       toast({
//         title: "Error",
//         description: "Failed to create post",
//         variant: "destructive"
//       });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="bg-gray-800 rounded-xl p-6 shadow-lg space-y-4">
//       <textarea
//         value={content}
//         onChange={(e) => setContent(e.target.value)}
//         className="w-full bg-gray-700 rounded-lg p-4 text-white resize-none min-h-[100px]"
//         placeholder="What's on your mind?"
//       />

//       <AnimatePresence>
//         {preview && (
//           <motion.div
//             initial={{ opacity: 0, scale: 0.9 }}
//             animate={{ opacity: 1, scale: 1 }}
//             exit={{ opacity: 0, scale: 0.9 }}
//             className="relative mt-4"
//           >
//             <img
//               src={preview}
//               alt="Preview"
//               className="rounded-lg max-h-96 w-full object-cover"
//             />
//             <button
//               onClick={() => {
//                 setImage(null);
//                 setPreview(null);
//               }}
//               className="absolute top-2 right-2 p-2 bg-gray-900/80 rounded-full hover:bg-gray-800"
//             >
//               <XMarkIcon className="w-5 h-5" />
//             </button>
//           </motion.div>
//         )}
//       </AnimatePresence>

//       <div className="flex justify-between items-center">
//         <input
//           ref={fileRef}
//           type="file"
//           accept="image/*"
//           onChange={handleImageChange}
//           className="hidden"
//         />
//         <Button
//           variant="ghost"
//           onClick={() => fileRef.current?.click()}
//           className="text-gray-300 hover:text-blue-400"
//         >
//           <PhotoIcon className="w-5 h-5 mr-2" />
//           Add Image
//         </Button>
//         <Button
//           onClick={handleSubmit}
//           disabled={!content.trim() || isLoading}
//           className="bg-blue-500 hover:bg-blue-600"
//         >
//           {isLoading ? "Posting..." : "Post"}
//         </Button>
//       </div>
//     </div>
//   );
// }
// CreatePostCard.


import { User } from "@clerk/nextjs/server";
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
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { cn } from "@/lib/utils";

interface UserResource {
  id: string;
  firstName: string | null;
  lastName: string | null;
  username: string | null;
  imageUrl: string | null;
}

interface CreatePostCardProps {
  user: User | null;
  content: string;
  setContent: (content: string) => void;
  imagePreview: string | null;
  setImagePreview: (preview: string | null) => void;
  setSelectedImage: (file: File | null) => void;
  imageInputRef: React.RefObject<HTMLInputElement>;
  handleImageSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
  createPost: UseMutationResult<void, Error, void, unknown>;
}
function mapUserResourceToUser(
  userResource: UserResource | null
): Partial<User> | null {
  if (!userResource) return null;

  return {
    id: userResource.id,
    firstName: userResource.firstName,
    lastName: userResource.lastName,
    username: userResource.username,
    imageUrl: userResource.imageUrl ?? undefined,
    banned: false,
    locked: false,
    privateMetadata: {},
    lastActiveAt: Date.now(),
    legalAcceptedAt: Date.now(),
  };
}

export default function CreatePost({
  user,
  content,
  setContent,
  imagePreview,
  setImagePreview,
  setSelectedImage,
  imageInputRef,
  handleImageSelect,
  createPost,
}: CreatePostCardProps) {
  // Simulate userResource being passed
  const userResource: UserResource | null = {
    id: "123",
    firstName: "John",
    lastName: "Doe",
    username: "johndoe",
    imageUrl: "https://example.com/avatar.png",
  };

  const mappedUser = mapUserResourceToUser(userResource);

  return (
    <Card className="bg-gray-900/50 backdrop-blur-lg border-gray-800/50 shadow-2xl hover:shadow-teal-900/30 transition-all duration-500">
      <CardHeader className="space-y-4 pb-2">
        <div className="flex items-start space-x-4">
          <HoverCard>
            <HoverCardTrigger>
              <Avatar className="h-14 w-14 ring-2 ring-teal-500/30 transition-all duration-300 hover:ring-4 hover:ring-teal-500/50">
                <AvatarImage
                  src={mappedUser?.imageUrl}
                  alt="Profile"
                  className="object-cover"
                />
                <AvatarFallback className="bg-gradient-to-br from-teal-900 to-teal-700">
                  {mappedUser?.firstName?.[0] || "U"}
                </AvatarFallback>
              </Avatar>
            </HoverCardTrigger>
            <HoverCardContent className="w-80 bg-gray-900/90 backdrop-blur-xl border-gray-800/50">
              <div className="flex justify-between space-x-4">
                <Avatar className="h-20 w-20 ring-2 ring-teal-500/20">
                  <AvatarImage
                    src={mappedUser?.imageUrl}
                    className="object-cover"
                  />
                  <AvatarFallback className="bg-gradient-to-br from-teal-900 to-teal-700">
                    {mappedUser?.firstName?.[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-2">
                  <h4 className="text-lg font-semibold bg-gradient-to-r from-teal-400 to-teal-300 bg-clip-text text-transparent">
                    {mappedUser?.fullName ||
                      `${mappedUser?.firstName} ${mappedUser?.lastName}`}
                  </h4>
                  <p className="text-sm text-gray-400">
                    @{mappedUser?.username}
                  </p>
                  <div className="flex items-center space-x-2 text-xs text-gray-500">
                    <span>Profile Completion</span>
                    <Progress value={80} className="h-1 w-16" />
                  </div>
                </div>
              </div>
            </HoverCardContent>
          </HoverCard>
          <div className="flex-1 space-y-2">
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Share your thoughts..."
              className="min-h-[120px] bg-gray-800/50 border-gray-700/50 resize-none focus:ring-2 focus:ring-teal-500/50 placeholder:text-gray-500 text-gray-100 transition-all duration-300"
            />
            <Alert className="bg-teal-950/30 border-teal-900/50">
              <AlertDescription className="text-xs text-teal-400">
                Share your thoughts with your community
              </AlertDescription>
            </Alert>
          </div>
        </div>
      </CardHeader>

      {imagePreview && (
        <CardContent className="pt-2">
          <div className="relative rounded-lg overflow-hidden bg-gray-800/50 backdrop-blur-sm">
            <img
              src={imagePreview}
              alt="Preview"
              className="max-h-[32rem] w-full object-cover transition-all duration-500 hover:scale-[1.02]"
            />
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 bg-gray-900/90 hover:bg-gray-900 transition-all duration-300"
              onClick={() => {
                setImagePreview(null);
                setSelectedImage(null);
              }}
            >
              ✕
            </Button>
          </div>
        </CardContent>
      )}

      <CardFooter className="justify-between pt-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => imageInputRef.current?.click()}
          className="text-teal-400 hover:text-teal-300 hover:bg-teal-900/20 transition-all duration-300"
        >
          📷 Add Photo
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
          disabled={!content && !imagePreview}
          className={cn(
            "bg-gradient-to-r from-teal-600 to-teal-500 hover:from-teal-500 hover:to-teal-400 text-white transition-all duration-300",
            !content && !imagePreview && "opacity-50 cursor-not-allowed"
          )}
        >
          {createPost.isPending ? (
            <span className="animate-spin mr-2">◌</span>
          ) : (
            <span className="mr-2">➤</span>
          )}
          Share Post
        </Button>
      </CardFooter>
    </Card>
  );
}
