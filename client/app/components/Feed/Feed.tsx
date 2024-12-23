
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
