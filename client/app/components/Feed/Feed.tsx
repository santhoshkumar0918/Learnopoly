

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { createClient } from "@supabase/supabase-js";


const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function Feed() {
  const [content, setContent] = useState("");
  const { user, isLoaded } = useUser(); 

  useEffect(() => {
    if (isLoaded) {
      console.log("User from Clerk:", user); 
    }
  }, [isLoaded, user]);

  const handlePostSubmit = async () => {
    if (!user) {
      alert("Please log in to post.");
      return;
    }

    console.log("Fetching user data from Supabase using Clerk ID:", user.id);

    try {
      
      const { data: userData, error } = await supabase
        .from("users")
        .select("id")
        .eq("clerk_id", user.id);

      
      console.log("Fetched userData from Supabase:", userData);

      if (error) {
        console.error("Error fetching user from Supabase:", error.message);
        alert("There was an error fetching your user data from Supabase.");
        return;
      }

      if (!userData || userData.length === 0) {
        console.error("User not found in Supabase.");
        alert("User not linked in Supabase.");
        
        const { error: insertError } = await supabase.from("users").insert([
          {
            clerk_id: user.id,
            username: user.username || "Anonymous", 
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

      const { data: reFetchedUserData } = await supabase
        .from("users")
        .select("id")
        .eq("clerk_id", user.id);

      if (!reFetchedUserData || reFetchedUserData.length === 0) {
        console.error("Failed to link user to Supabase.");
        alert("Failed to link your user to Supabase.");
        return;
      }

      const userId = reFetchedUserData[0].id;
      console.log("User ID from Supabase:", userId);

      const { error: postError } = await supabase.from("posts").insert({
        content,
        user_id: userId,
      });

      if (postError) {
        console.error("Error submitting post:", postError.message);
        alert("Failed to submit post.");
      } else {
        console.log("Post submitted successfully!");
        alert("Post submitted!");
        setContent(""); 
      }
    } catch (error) {
      console.error("An unexpected error occurred:", error);
      alert("Something went wrong. Please try again later.");
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
    </div>
  );
}
