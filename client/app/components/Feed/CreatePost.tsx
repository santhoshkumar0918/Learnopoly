// CreatePost.tsx
import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { PhotoIcon, XMarkIcon } from "@heroicons/react/24/outline";

interface CreatePostProps {
  onSuccess: () => void;
}

export function CreatePost({ onSuccess }: CreatePostProps) {
  const [content, setContent] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (!content.trim()) return;

    setIsLoading(true);
    const formData = new FormData();
    formData.append("content", content);
    if (image) formData.append("image", image);

    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        body: formData
      });
      
      if (!res.ok) throw new Error("Failed to create post");
      
      setContent("");
      setImage(null);
      setPreview(null);
      onSuccess();
      toast({ title: "Success", description: "Post created" });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create post",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gray-800 rounded-xl p-6 shadow-lg space-y-4">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="w-full bg-gray-700 rounded-lg p-4 text-white resize-none min-h-[100px]"
        placeholder="What's on your mind?"
      />

      <AnimatePresence>
        {preview && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="relative mt-4"
          >
            <img
              src={preview}
              alt="Preview"
              className="rounded-lg max-h-96 w-full object-cover"
            />
            <button
              onClick={() => {
                setImage(null);
                setPreview(null);
              }}
              className="absolute top-2 right-2 p-2 bg-gray-900/80 rounded-full hover:bg-gray-800"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex justify-between items-center">
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="hidden"
        />
        <Button
          variant="ghost"
          onClick={() => fileRef.current?.click()}
          className="text-gray-300 hover:text-blue-400"
        >
          <PhotoIcon className="w-5 h-5 mr-2" />
          Add Image
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={!content.trim() || isLoading}
          className="bg-blue-500 hover:bg-blue-600"
        >
          {isLoading ? "Posting..." : "Post"}
        </Button>
      </div>
    </div>
  );
}
