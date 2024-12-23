// import { useState, useEffect } from "react";
// import { useUser } from "@clerk/nextjs";
// import { createClient } from "@supabase/supabase-js";
// import {
//   CheckIcon,
//   HeartIcon,
//   ChatBubbleLeftEllipsisIcon,
//   ShareIcon,
// } from "@heroicons/react/24/outline";
// import { formatDistanceToNow } from "date-fns";

// // Supabase Client
// const supabase = createClient(
//   process.env.NEXT_PUBLIC_SUPABASE_URL!,
//   process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
// );

// export default function Feed() {
//   const [content, setContent] = useState("");
//   const [posts, setPosts] = useState<any[]>([]);
//   const { user, isLoaded } = useUser();

//   useEffect(() => {
//     if (isLoaded) {
//       console.log("User from Clerk:", user);
//       fetchPosts(); // Fetch posts once user is loaded
//     }
//   }, [isLoaded, user]);

//   const fetchPosts = async () => {
//     try {
//       const { data, error } = await supabase
//         .from("posts")
//         .select("*")
//         .order("created_at", { ascending: false });

//       if (error) {
//         console.error("Error fetching posts:", error.message);
//         return;
//       }

//       setPosts(data);
//     } catch (error) {
//       console.error("Error fetching posts:", error);
//     }
//   };

//   const handlePostSubmit = async () => {
//     if (!user) {
//       alert("Please log in to post.");
//       return;
//     }

//     try {
//       // Fetch user data from Supabase
//       const { data: userData, error } = await supabase
//         .from("users")
//         .select("id")
//         .eq("clerk_id", user.id);

//       if (error) {
//         console.error("Error fetching user from Supabase:", error.message);
//         alert("Error fetching user data.");
//         return;
//       }

//       const userId = userData[0]?.id;
//       if (!userId) {
//         alert("User not found.");
//         return;
//       }

//       const { error: postError } = await supabase.from("posts").insert({
//         content,
//         user_id: userId,
//       });

//       if (postError) {
//         console.error("Error submitting post:", postError.message);
//         alert("Failed to submit post.");
//       } else {
//         console.log("Post submitted successfully!");
//         alert("Post submitted!");
//         setContent(""); // Reset form
//         fetchPosts(); // Fetch posts after submission
//       }
//     } catch (error) {
//       console.error("Unexpected error:", error);
//       alert("Something went wrong.");
//     }
//   };

//   const handleLikePost = async (postId: string) => {
//     try {
//       const { error } = await supabase
//         .from("likes")
//         .insert([{ post_id: postId, user_id: user?.id }]);

//       if (error) {
//         console.error("Error liking post:", error.message);
//       } else {
//         fetchPosts(); // Re-fetch posts after like
//       }
//     } catch (error) {
//       console.error("Unexpected error:", error);
//     }
//   };

//   const handleCommentPost = (postId: string) => {
//     alert(`Comment on Post ID: ${postId}`);
//     // Implement comment functionality here
//   };

//   const handleSharePost = (postId: string) => {
//     alert(`Share Post ID: ${postId}`);
//     // Implement share functionality here
//   };

//   if (!isLoaded) {
//     return <div className="text-center text-gray-500">Loading...</div>;
//   }

//   return (
//     <div className="max-w-2xl mx-auto mt-8 p-6 bg-white rounded-lg shadow-lg">
//       {/* Create Post Section */}
//       <div className="mb-6">
//         <h2 className="text-3xl font-bold text-center text-gray-800 mb-4">
//           Create a Post
//         </h2>
//         <textarea
//           value={content}
//           onChange={(e) => setContent(e.target.value)}
//           placeholder="What's on your mind?"
//           className="w-full h-40 p-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none mb-4"
//         />
//         <div className="flex justify-end">
//           <button
//             onClick={handlePostSubmit}
//             className="flex items-center bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200"
//           >
//             <CheckIcon className="w-5 h-5 mr-2" />
//             Post
//           </button>
//         </div>
//       </div>

//       {/* Feed Section */}
//       <div>
//         {posts.map((post) => (
//           <div
//             key={post.id}
//             className="mb-6 p-4 bg-gray-50 rounded-lg shadow-md hover:shadow-xl transition-all"
//           >
//             {/* Post Header: Avatar, Username, Time */}
//             <div className="flex items-center mb-4">
//               <img
//                 src={typeof user?.publicMetadata?.profileImageUrl === 'string' ? user.publicMetadata.profileImageUrl : "/default-avatar.png"}
//                 alt="Profile"
//                 className="w-10 h-10 rounded-full mr-4"
//               />
//               <div className="flex-1">
//                 <p className="font-semibold text-gray-700">
//                   {user?.username || "Anonymous"}
//                 </p>
//                 <p className="text-sm text-gray-500">
//                   {formatDistanceToNow(new Date(post.created_at))} ago
//                 </p>
//               </div>
//             </div>

//             {/* Post Content */}
//             <p className="text-gray-800">{post.content}</p>

//             {/* Post Actions (Like, Comment, Share) */}
//             <div className="flex justify-start space-x-4 mt-4">
//               <button
//                 onClick={() => handleLikePost(post.id)}
//                 className="flex items-center text-gray-600 hover:text-red-600 transition-all"
//               >
//                 <HeartIcon className="w-5 h-5 mr-2" />
//                 {post.likes_count || 0} Likes
//               </button>
//               <button
//                 onClick={() => handleCommentPost(post.id)}
//                 className="flex items-center text-gray-600 hover:text-blue-600 transition-all"
//               >
//                 <ChatBubbleLeftEllipsisIcon className="w-5 h-5 mr-2" />
//                 Comment
//               </button>
//               <button
//                 onClick={() => handleSharePost(post.id)}
//                 className="flex items-center text-gray-600 hover:text-green-600 transition-all"
//               >
//                 <ShareIcon className="w-5 h-5 mr-2" />
//                 Share
//               </button>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function Feed() {
  const [content, setContent] = useState("");
  const [posts, setPosts] = useState<any[]>([]);
  const { user, isLoaded } = useUser();

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from("posts")
        .select(
          `
          id,
          content,
          created_at,
          user_id,
          comments (
            id,
            content,
            user_id,
            created_at
          ),
          likes (
            id,
            user_id
          )
        `
        )
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching posts:", error.message);
        return;
      }

      setPosts(data); 
    } catch (error) {
      console.error("An error occurred while fetching posts:", error);
    }
  };

  useEffect(() => {
    if (isLoaded && user) {
      fetchPosts();
    }
  }, [isLoaded, user]);

  const handlePostSubmit = async () => {
    if (!user) {
      alert("Please log in to post.");
      return;
    }

    try {
      const { data: userData, error } = await supabase
        .from("users")
        .select("id")
        .eq("clerk_id", user.id)
        .single();

      if (error || !userData) {
        console.error("Error fetching user data from Supabase:", error.message);
        return;
      }

      const userId = userData.id;
      const { error: postError } = await supabase.from("posts").insert({
        content,
        user_id: userId,
      });

      if (postError) {
        console.error("Error submitting post:", postError.message);
        return;
      }

      setContent(""); 
      fetchPosts(); 
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  const handleLike = async (postId: string) => {
    if (!user) return alert("Please log in to like posts.");

    try {
      const { data: userData, error } = await supabase
        .from("users")
        .select("id")
        .eq("clerk_id", user.id)
        .single();

      if (error || !userData) {
        console.error("Error fetching user data from Supabase:", error.message);
        return;
      }

      const userId = userData.id;
      const { error: likeError } = await supabase
        .from("likes")
        .upsert([{ post_id: postId, user_id: userId }]);

      if (likeError) {
        console.error("Error liking post:", likeError.message);
      } else {
        fetchPosts();
      }
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  const handleComment = async (postId: string, commentContent: string) => {
    if (!user) return alert("Please log in to comment.");

    try {
      const { data: userData, error } = await supabase
        .from("users")
        .select("id")
        .eq("clerk_id", user.id)
        .single();

      if (error || !userData) {
        console.error("Error fetching user data from Supabase:", error.message);
        return;
      }

      const userId = userData.id;
      const { error: commentError } = await supabase.from("comments").insert({
        content: commentContent,
        post_id: postId,
        user_id: userId,
      });

      if (commentError) {
        console.error("Error commenting on post:", commentError.message);
      } else {
        fetchPosts(); 
      }
    } catch (error) {
      console.error("Error commenting on post:", error);
    }
  };

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Type your message..."
      />
      <button onClick={handlePostSubmit}>Post</button>

      {posts.map((post) => (
        <div key={post.id}>
          <p>{post.content}</p>
          <button onClick={() => handleLike(post.id)}>
            Like ({post.likes.length})
          </button>

          <div>
            {post.comments.map((comment: { id: string; content: string }) => (
              <div key={comment.id}>
                <p>{comment.content}</p>
              </div>
            ))}

            <textarea
              placeholder="Add a comment..."
              onBlur={(e) => handleComment(post.id, e.target.value)}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
