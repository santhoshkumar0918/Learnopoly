import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface Post {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  comments: Comment[];
  likes: Like[];
}

interface Comment {
  id: string;
  content: string;
  user_id: string;
  created_at: string;
}

interface Like {
  id: string;
  user_id: string;
}

export default function Feed() {
  const [content, setContent] = useState("");
  const [commentContent, setCommentContent] = useState<Record<string, string>>(
    {}
  );
  const { user, isLoaded } = useUser();
  const queryClient = useQueryClient();

  const { data: posts, isLoading } = useQuery({
    queryKey: ["posts"],
    queryFn: async () => {
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

      if (error) throw error;
      return data as Post[];
    },
    enabled: isLoaded && !!user,
  });

  const createPost = useMutation({
    mutationFn: async () => {
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("id")
        .eq("clerk_id", user!.id)
        .single();

      if (userError) throw userError;

      const { error: postError } = await supabase
        .from("posts")
        .insert({ content, user_id: userData.id });

      if (postError) throw postError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      setContent("");
    },
  });

  const createComment = useMutation({
    mutationFn: async ({
      postId,
      content,
    }: {
      postId: string;
      content: string;
    }) => {
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("id")
        .eq("clerk_id", user!.id)
        .single();

      if (userError) throw userError;

      const { error: commentError } = await supabase
        .from("comments")
        .insert({ content, post_id: postId, user_id: userData.id });

      if (commentError) throw commentError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      setCommentContent({});
    },
  });

  const toggleLike = useMutation({
    mutationFn: async (postId: string) => {
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("id")
        .eq("clerk_id", user!.id)
        .single();

      if (userError) throw userError;

      const { error: likeError } = await supabase
        .from("likes")
        .upsert([{ post_id: postId, user_id: userData.id }]);

      if (likeError) throw likeError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });

  if (!isLoaded) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto p-4 space-y-6">
        {/* Create Post Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-start space-x-4">
            <img
              src={user?.imageUrl || "/api/placeholder/32/32"}
              alt="Profile"
              className="w-10 h-10 rounded-full"
            />
            <div className="flex-1">
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="What's on your mind?"
                className="w-full p-3 border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px] bg-gray-50"
              />
              <div className="mt-3 flex justify-end">
                <button
                  onClick={() => createPost.mutate()}
                  disabled={!content.trim() || createPost.isPending}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {createPost.isPending ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                  ) : (
                    <svg
                      className="h-4 w-4 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                      />
                    </svg>
                  )}
                  Post
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Posts Feed */}
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 animate-pulse"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-6">
            {posts?.map((post) => (
              <div
                key={post.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
              >
                {/* Post Header */}
                <div className="p-4 border-b border-gray-100">
                  <div className="flex items-center space-x-3">
                    <img
                      src="/api/placeholder/32/32"
                      alt="User"
                      className="w-10 h-10 rounded-full bg-gray-200"
                    />
                    <div>
                      <p className="font-medium text-gray-900">User</p>
                      <p className="text-sm text-gray-500">
                        {new Date(post.created_at).toLocaleDateString(
                          undefined,
                          {
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          }
                        )}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Post Content */}
                <div className="p-4">
                  <p className="text-gray-900 whitespace-pre-wrap">
                    {post.content}
                  </p>
                </div>

                {/* Post Actions */}
                <div className="flex items-center px-4 py-3 border-t border-gray-100">
                  <button
                    onClick={() => toggleLike.mutate(post.id)}
                    className={`flex items-center space-x-2 ${
                      post.likes.some((like) => like.user_id === user?.id)
                        ? "text-red-500"
                        : "text-gray-500 hover:text-red-500"
                    } transition-colors`}
                  >
                    <svg
                      className={`h-6 w-6 ${
                        post.likes.some((like) => like.user_id === user?.id)
                          ? "fill-current"
                          : "stroke-2"
                      }`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                      />
                    </svg>
                    <span>{post.likes.length}</span>
                  </button>

                  <div className="flex items-center space-x-2 ml-6 text-gray-500">
                    <svg
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                      />
                    </svg>
                    <span>{post.comments.length}</span>
                  </div>
                </div>

                {/* Comments Section */}
                <div className="bg-gray-50 p-4 space-y-4">
                  {post.comments.map((comment) => (
                    <div
                      key={comment.id}
                      className="flex items-start space-x-3"
                    >
                      <img
                        src="/api/placeholder/24/24"
                        alt="Commenter"
                        className="w-8 h-8 rounded-full bg-gray-200"
                      />
                      <div className="flex-1 bg-white rounded-lg p-3 shadow-sm">
                        <p className="text-sm text-gray-900">
                          {comment.content}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(comment.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}

                  {/* Add Comment */}
                  <div className="flex items-start space-x-3 mt-4">
                    <img
                      src={user?.imageUrl || "/api/placeholder/24/24"}
                      alt="Profile"
                      className="w-8 h-8 rounded-full"
                    />
                    <div className="flex-1 relative">
                      <input
                        type="text"
                        value={commentContent[post.id] || ""}
                        onChange={(e) =>
                          setCommentContent((prev) => ({
                            ...prev,
                            [post.id]: e.target.value,
                          }))
                        }
                        placeholder="Write a comment..."
                        className="w-full px-4 py-2 border border-gray-200 rounded-full bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 pr-12"
                      />
                      <button
                        onClick={() => {
                          if (commentContent[post.id]?.trim()) {
                            createComment.mutate({
                              postId: post.id,
                              content: commentContent[post.id],
                            });
                          }
                        }}
                        disabled={
                          !commentContent[post.id]?.trim() ||
                          createComment.isPending
                        }
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-blue-500 hover:text-blue-600 disabled:opacity-50"
                      >
                        <svg
                          className="h-6 w-6"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}