import { useState } from "react";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { useImageStore } from "../store/imageStore";

interface Props {
  image: any;
  onClick: () => void;
}

export default function ImageCard({ image, onClick }: Props) {

  const [liked, setLiked] = useState(false);
  let tapTimer: any = null;

  const handleDoubleTap = () => {
    if (tapTimer) {
      clearTimeout(tapTimer);
      tapTimer = null;
      setLiked(true);

    } else {
      tapTimer = setTimeout(() => {
        tapTimer = null;
        onClick();
      }, 250);
    }
  };

  return (
    <motion.div
      className="bg-white rounded-xl shadow border border-gray-200 overflow-hidden mb-4 cursor-pointer"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="px-3 py-2 text-gray-700 font-medium">
        {image.title}
      </div>

      <div onClick={handleDoubleTap}>
        <motion.img
          src={image.imageUrl}
          whileHover={{ scale: 1.02 }}
          className="w-full object-cover"
        />
      </div>

      <div className="flex items-center gap-2 px-3 py-2">
        <motion.button whileTap={{ scale: 1.3 }}>
          <Heart
            className={`w-5 h-5 ${
              liked ? "fill-red-500 text-red-500" : "text-gray-500"
            }`}
          />
        </motion.button>
        <span className="text-sm text-gray-600">
          {image.likes} likes
        </span>
      </div>

      <div className="px-3 pb-3 flex flex-wrap gap-2">
        {image.tags.map((tag: string) => (
          <span
            key={tag}
            className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full"
          >
            #{tag}
          </span>
        ))}
      </div>
    </motion.div>
  );
}
