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
// 

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { createClient } from "@supabase/supabase-js";

// Supabase Client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function Feed() {
  const [content, setContent] = useState("");
  const { user, isLoaded } = useUser(); // Destructure isLoaded to check if user is ready

  // Log the user data from Clerk once it's loaded
  useEffect(() => {
    if (isLoaded) {
      console.log("User from Clerk:", user); // This log should appear in your browser console
    }
  }, [isLoaded, user]);

  const handlePostSubmit = async () => {
    if (!user) {
      alert("Please log in to post.");
      return;
    }

    console.log("Fetching user data from Supabase using Clerk ID:", user.id);

    try {
      // Fetch user from Supabase using Clerk ID
      const { data: userData, error } = await supabase
        .from("users")
        .select("id")
        .eq("clerk_id", user.id);

      // Log the raw response from Supabase
      console.log("Fetched userData from Supabase:", userData);

      if (error) {
        console.error("Error fetching user from Supabase:", error.message);
        alert("There was an error fetching your user data from Supabase.");
        return;
      }

      if (!userData || userData.length === 0) {
        console.error("User not found in Supabase.");
        alert("User not linked in Supabase.");
        // If user doesn't exist, insert into Supabase
        const { error: insertError } = await supabase.from("users").insert([
          {
            clerk_id: user.id,
            username: user.username || "Anonymous", // Use the username from Clerk or default
          },
        ]);

        if (insertError) {
          console.error(
            "Error inserting user into Supabase:",
            insertError.message
          );
          alert("Failed to link your user to Supabase.");
          return;
        }

        console.log("User successfully inserted into Supabase!");
      }

      // Re-fetch the user data to get the proper user ID after insertion
      const { data: reFetchedUserData } = await supabase
        .from("users")
        .select("id")
        .eq("clerk_id", user.id);

      if (!reFetchedUserData || reFetchedUserData.length === 0) {
        console.error("Failed to link user to Supabase.");
        alert("Failed to link your user to Supabase.");
        return;
      }

      // Get user id (ensure we have exactly one result)
      const userId = reFetchedUserData[0].id;
      console.log("User ID from Supabase:", userId);

      // Insert Post into Supabase
      const { error: postError } = await supabase.from("posts").insert({
        content,
        user_id: userId,
      });

      // Log any post submission errors
      if (postError) {
        console.error("Error submitting post:", postError.message);
        alert("Failed to submit post.");
      } else {
        console.log("Post submitted successfully!");
        alert("Post submitted!");
        setContent(""); // Reset form
      }
    } catch (error) {
      console.error("An unexpected error occurred:", error);
      alert("Something went wrong. Please try again later.");
    }
  };

  // If the user is not loaded yet, return a loading state
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
    </div>
  );
}
