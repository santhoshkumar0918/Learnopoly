import { useQueryClient, useQuery } from "@tanstack/react-query";
import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";



async function fetchPosts() {
  const { data, error } = await supabase
    .from("posts")
    .select("*, profiles(username)")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return data;
}

export default function Feed() {
  const queryClient = useQueryClient();
  const { user, isLoaded } = useUser();
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);


  const {
    data: posts,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["posts"],
    queryFn: fetchPosts,
    staleTime: 1000 * 60 * 5,
  });

  
  useEffect(() => {
    const subscription = supabase
      .channel('public:posts')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'posts' }, (payload) => {
        queryClient.setQueryData(["posts"], (oldPosts: any) => [
          payload.new,
          ...oldPosts,
        ]);
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [queryClient]);

 
  const handlePostSubmit = async () => {
    if (!content) return;
    setIsSubmitting(true);
    const { error } = await supabase.from("posts").insert([
      {
        content,
        user_id: user?.id,
        created_at: new Date().toISOString(),
      },
    ]);

    if (!error) {
      setContent("");
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    }
    setIsSubmitting(false);
  };

  
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

  
  if (isError) {
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
            className="w-full p-2 border rounded"
            rows={3}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Share something..."
          />
          <button
            className="bg-blue-500 text-white px-4 py-2 mt-2 rounded hover:bg-blue-600"
            onClick={handlePostSubmit}
            disabled={isSubmitting}
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
            {post.profiles?.username || "Anonymous"}
          </div>
          <p className="text-gray-700 mt-2">{post.content}</p>
          <span className="text-sm text-gray-500">
            {new Date(post.created_at).toLocaleString()}
          </span>
        </div>
      ))}
    </div>
  );
}
