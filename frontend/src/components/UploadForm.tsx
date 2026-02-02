import { useState } from "react";
import { api } from "../api/axios";
import { uploadImageToCloudinary } from "../cloud";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { UploadCloud, X, Heart } from "lucide-react";

const TAG_SUGGESTIONS = [
  "chocolate",
  "vanilla",
  "strawberry",
  "birthday",
  "wedding",
  "cupcake",
  "kids",
  "anniversary",
  "custom",
  "photo cake",
];

export default function UploadForm() {
  const [title, setTitle] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const filteredSuggestions = TAG_SUGGESTIONS.filter(
    (tag) =>
      tag.toLowerCase().includes(tagInput.toLowerCase()) &&
      !tags.includes(tag)
  );

  const addTag = (tag: string) => {
    if (tags.length >= 5) {
      toast.error("Max 5 tags allowed");
      return;
    }
    setTags([...tags, tag]);
    setTagInput("");
  };

  const removeTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const handleUpload = async () => {
    if (!image) return toast.error("Please select an image");

    try {
      setLoading(true);
      const imageUrl = await uploadImageToCloudinary(image);

      await api.post("/images", { title, tags, imageUrl });

      toast.success("Uploaded! Waiting for approval 💖");

      setTitle("");
      setTags([]);
      setTagInput("");
      setImage(null);
      setPreview(null);
    } catch {
      toast.error("Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[91vh] bg-[#f7f2ea] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-3xl bg-white rounded-3xl shadow-2xl p-6"
      >
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">
            sugar<span className="text-red-500">degree</span>
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Upload your sweetest creation 🍰
          </p>
        </div>

        {/* Title */}
        <Input
          placeholder="Cake title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="rounded-xl"
        />

        {/* Tags */}
        <div className="mt-4 relative">
          <Input
            placeholder="Type a tag..."
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            className="rounded-xl"
          />

          {tagInput && filteredSuggestions.length > 0 && (
            <div className="absolute w-full bg-white shadow rounded-xl mt-1 z-10">
              {filteredSuggestions.map((tag) => (
                <div
                  key={tag}
                  onClick={() => addTag(tag)}
                  className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                >
                  #{tag}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Tag chips */}
        <div className="flex flex-wrap gap-2 mt-3">
          {tags.map((tag) => (
            <motion.span
              key={tag}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="flex items-center gap-1 bg-black text-white px-3 py-1 rounded-full text-xs"
            >
              #{tag}
              <X
                className="w-3 h-3 cursor-pointer"
                onClick={() => removeTag(tag)}
              />
            </motion.span>
          ))}
        </div>

        {/* Upload Box */}
        <label className="mt-5 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-2xl p-6 cursor-pointer hover:bg-gray-50 transition">
          <UploadCloud className="w-10 h-10 text-gray-500 mb-2" />
          <p className="text-gray-500 text-sm">Click to upload cake image</p>
          <Input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                setImage(file);
                setPreview(URL.createObjectURL(file));
              }
            }}
          />
        </label>

        {/* Preview */}
        {preview && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-4 relative"
          >
            <img
              src={preview}
              className="w-full h-52 object-cover rounded-2xl shadow"
            />
            <Heart className="absolute top-3 right-3 text-red-500 fill-red-500" />
          </motion.div>
        )}

        {/* Button */}
        <Button
          onClick={handleUpload}
          disabled={loading}
          className="w-full mt-6 rounded-full bg-black hover:bg-gray-800 text-white text-lg"
        >
          {loading ? "Uploading..." : "Upload Cake"}
        </Button>
      </motion.div>
    </div>
  );
}
