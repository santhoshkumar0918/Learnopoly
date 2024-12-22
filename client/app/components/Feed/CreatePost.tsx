import { useState } from "react";
import { supabase } from "@/app/lib/supabase";
import { useUser } from "@clerk/nextjs";

export default function CreatePost() {
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useUser();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    setIsLoading(true);

    try {
      const { error } = await supabase.from("posts").insert([
        {
          content,
          user_id: user?.id,
          username: user?.username || user?.emailAddresses[0]?.emailAddress,
        },
      ]);

      if (error) throw error;
      setContent("");
    } catch (err) {
      console.error("Error creating post:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="border p-4 rounded-lg shadow space-y-4"
    >
      <textarea
        className="w-full p-2 border rounded"
        rows={3}
        placeholder="What's on your mind?"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        required
      />
      <button
        type="submit"
        disabled={isLoading}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {isLoading ? "Posting..." : "Post"}
      </button>
    </form>
  );
}
