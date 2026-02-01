import { useState } from "react";
import { api } from "../api/axios";
import { uploadImageToCloudinary } from "../cloud";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { UploadCloud, X } from "lucide-react";

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

  // filter suggestions based on input
  const filteredSuggestions = TAG_SUGGESTIONS.filter(
    (tag) =>
      tag.toLowerCase().includes(tagInput.toLowerCase()) &&
      !tags.includes(tag)
  );

  const addTag = (tag: string) => {
    if (tags.length >= 5) {
      toast.error("Maximum 5 tags allowed");
      return;
    }
    setTags([...tags, tag]);
    setTagInput("");
  };

  const removeTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const handleUpload = async () => {
    if (!image) {
      toast.error("Please select an image");
      return;
    }
    try {
      setLoading(true);

      const imageUrl = await uploadImageToCloudinary(image);

      await api.post("/images", {
        title,
        tags,
        imageUrl,
      });

      toast.success("Uploaded! Waiting for admin approval");

      setTitle("");
      setTags([]);
      setTagInput("");
      setImage(null);
      setPreview(null);
    } catch (error) {
      toast.error("Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 40 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md"
      >
        <Card className="rounded-2xl shadow-2xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">
              🍰 Upload Cake Image
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Add your cake with title and tags (max 5)
            </p>
          </CardHeader>

          <CardContent className="space-y-4">
            <Input
              placeholder="Cake Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            {/* TAG INPUT */}
            <div className="relative">
              <Input
                placeholder="Type tag..."
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
              />

              {/* Suggestions dropdown */}
              {tagInput && filteredSuggestions.length > 0 && (
                <div className="absolute z-10 bg-white border rounded-md w-full mt-1 shadow">
                  {filteredSuggestions.map((tag) => (
                    <div
                      key={tag}
                      className="px-3 py-2 cursor-pointer hover:bg-slate-100"
                      onClick={() => addTag(tag)}
                    >
                      {tag}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* TAG CHIPS */}
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="flex items-center gap-1 bg-slate-200 px-3 py-1 rounded-full text-sm"
                >
                  {tag}
                  <X
                    className="w-4 h-4 cursor-pointer"
                    onClick={() => removeTag(tag)}
                  />
                </span>
              ))}
            </div>

            {/* Upload box */}
            <label className="flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-6 cursor-pointer hover:bg-slate-50 transition">
              <UploadCloud className="w-8 h-8 text-slate-500 mb-2" />
              <span className="text-sm text-slate-500">
                Click to upload image
              </span>
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

            {preview && (
              <motion.img
                src={preview}
                alt="preview"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full h-48 object-cover rounded-xl border"
              />
            )}

            <Button
              onClick={handleUpload}
              disabled={loading}
              className="w-full rounded-xl"
            >
              {loading ? "Uploading..." : "Upload Image"}
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
