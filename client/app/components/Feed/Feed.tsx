// "use client";

// import { useQueryClient, useQuery } from "@tanstack/react-query";
// import { useUser } from "@clerk/nextjs";
// import { useEffect, useState } from "react";
// import { supabase } from "../../lib/supabase";

// async function fetchPosts() {
//   const { data, error } = await supabase
//     .from("posts")
//     .select("*, profiles(username)")
//     .order("created_at", { ascending: false });

//   if (error) throw new Error(error.message);
//   return data;
// }

// export default function Feed() {
//   const queryClient = useQueryClient();
//   const { user, isLoaded } = useUser();
//   const [content, setContent] = useState("");
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const {
//     data: posts,
//     isLoading,
//     isError,
//     error,
//   } = useQuery({
//     queryKey: ["posts"],
//     queryFn: fetchPosts,
//     staleTime: 1000 * 60 * 5, 
//   }
//   );
//   useEffect(() => {
//     const subscription = supabase
//       .channel("public:posts")
//       .on(
//         "postgres_changes",
//         { event: "INSERT", schema: "public", table: "posts" },
//         (payload) => {
//           queryClient.setQueryData(["posts"], (oldPosts: any) => [
//             payload.new,
//             ...oldPosts,
//           ]);
//         }
//       )
//       .subscribe();

//     return () => {
//       subscription.unsubscribe();
//     };
//   }, [queryClient]);

//   const handlePostSubmit = async () => {
//     if (!content) return;
//     setIsSubmitting(true);
//     const { error } = await supabase.from("posts").insert([
//       {
//         content,
//         user_id: user?.id,
//         created_at: new Date().toISOString(),
//       },
//     ]);

//     if (!error) {
//       setContent("");
//       queryClient.invalidateQueries({ queryKey: ["posts"] });
//     }
//     setIsSubmitting(false);
//   };

//   if (isLoading) {
//     return (
//       <div className="space-y-4">
//         {[...Array(5)].map((_, i) => (
//           <div key={i} className="animate-pulse border p-4 rounded-lg shadow">
//             <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
//             <div className="h-6 bg-gray-200 rounded w-full"></div>
//           </div>
//         ))}
//       </div>
//     );
//   }

//   if (isError) {
//     return (
//       <div className="text-red-500 p-4">
//         Error loading posts: {error.message}
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-4">
//       {isLoaded && user ? (
//         <div className="border p-4 rounded-lg shadow">
//           <textarea
//             className="w-full p-2 text-black border rounded"
//             rows={3}
//             value={content}
//             onChange={(e) => setContent(e.target.value)}
//             placeholder="Share something..."
//           />
//           <button
//             className="bg-blue-500 text-white px-4 py-2 mt-2 rounded hover:bg-blue-600"
//             onClick={handlePostSubmit}
//             disabled={isSubmitting}
//           >
//             {isSubmitting ? "Posting..." : "Post"}
//           </button>
//         </div>
//       ) : (
//         <div className="p-4 text-center">
//           <a href="/sign-in" className="text-blue-500 underline">
//             Sign in to post
//           </a>
//         </div>
//       )}

//       {posts?.map((post) => (
//         <div key={post.id} className="border p-4 rounded-lg shadow">
//           <div className="font-bold">
//             {post.profiles?.username || "Anonymous"}
//           </div>
//           <p className="text-gray-700 mt-2">{post.content}</p>
//           <span className="text-sm text-gray-500">
//             {new Date(post.created_at).toLocaleString()}
//           </span>
//         </div>
//       ))}
//     </div>
//   );
// }
"use client";

import { useQueryClient, useQuery } from "@tanstack/react-query";
import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

// Function to fetch posts from the database
async function fetchPosts() {
  const { data, error } = await supabase
    .from("posts")
    .select("id, content, user_id, created_at, profiles(username)") // Ensure profiles table is joined correctly
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message); // Handle errors
  return data; // Return fetched data
}

export default function Feed() {
  const queryClient = useQueryClient();
  const { user, isLoaded } = useUser(); // Get user details from Clerk
  const [content, setContent] = useState(""); // State for post content
  const [isSubmitting, setIsSubmitting] = useState(false); // State for handling the submitting status

  // Fetch posts using react-query
  const {
    data: posts,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["posts"],
    queryFn: fetchPosts,
    staleTime: 1000 * 60 * 5, // Cache posts for 5 minutes
  });

  // Subscribe to real-time updates from the "posts" table
  useEffect(() => {
    const subscription = supabase
      .channel("public:posts")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "posts" },
        (payload) => {
          console.log("New post received:", payload); // Log real-time data
          queryClient.setQueryData(["posts"], (oldPosts: any) => [
            payload.new,
            ...oldPosts,
          ]);
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe(); // Unsubscribe on component unmount
    };
  }, [queryClient]);

  // Handle post submission
  const handlePostSubmit = async () => {
    if (!content.trim() || !user?.id) return; // Validate content and user ID
    setIsSubmitting(true); // Set submitting state to true

    // Insert new post into the database
    const { error } = await supabase.from("posts").insert([
      {
        content,
        user_id: user.id, // Use user ID from Clerk
        created_at: new Date().toISOString(), // Use current date/time for post creation
      },
    ]);

    if (!error) {
      setContent(""); // Clear content field after successful submission
      queryClient.invalidateQueries({ queryKey: ["posts"] }); // Invalidate the posts query to re-fetch the posts
    } else {
      console.error("Post submission error:", error.message); // Log any errors
    }

    setIsSubmitting(false); // Reset submitting state
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="animate-pulse border p-4 rounded-lg shadow">
            <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
            <div className="h-6 bg-gray-200 rounded w-full"></div>
          </div>
        ))}
      </div>
    );
  }

  // Error state
  if (isError) {
    console.error("Error loading posts:", error); // Log error details
    return (
      <div className="text-red-500 p-4">
        Error loading posts: {error.message}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {isLoaded && user ? (
        <div className="border p-4 rounded-lg shadow">
          <textarea
            className="w-full p-2 text-black border rounded"
            rows={3}
            value={content}
            onChange={(e) => setContent(e.target.value)} // Update content state on input change
            placeholder="Share something..."
          />
          <button
            className="bg-blue-500 text-white px-4 py-2 mt-2 rounded hover:bg-blue-600"
            onClick={handlePostSubmit}
            disabled={isSubmitting} // Disable the button while submitting
          >
            {isSubmitting ? "Posting..." : "Post"}
          </button>
        </div>
      ) : (
        <div className="p-4 text-center">
          <a href="/sign-in" className="text-blue-500 underline">
            Sign in to post
          </a>
        </div>
      )}

      {posts?.map((post) => (
        <div key={post.id} className="border p-4 rounded-lg shadow">
          <div className="font-bold">
            {Array.isArray(post.profiles) ? post.profiles[0]?.username || "Anonymous" : "Anonymous"}{" "}
            {/* Display username from the profiles table */}
          </div>
          <p className="text-gray-700 mt-2">{post.content}</p>
          <span className="text-sm text-gray-500">
            {new Date(post.created_at).toLocaleString()}{" "}
            {/* Format created_at */}
          </span>
        </div>
      ))}
    </div>
  );
}
