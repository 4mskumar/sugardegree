import { useEffect, useState } from "react";
import { useImageStore } from "../store/imageStore";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Lenis from "lenis";

export default function Gallery() {
  const { images, fetchApproved, loading, nextPage } = useImageStore();
  const [selectedImage, setSelectedImage] = useState<any>(null);
  const navigate = useNavigate();

  const getRandomSpan = () => {
    const layouts = [
      "col-span-1 row-span-1",
      "col-span-2 row-span-1",
      "col-span-1 row-span-2",
      "col-span-2 row-span-2",
    ];
    return layouts[Math.floor(Math.random() * layouts.length)];
  };
  

  const lenis = new Lenis({
    autoRaf: true,
  });

  useEffect(() => {
    fetchApproved();
  }, []);

  return (
    <div className="min-h-screen bg-[#ff] px-4 py-6 relative">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold tracking-tight text-[#E8918B]">
          sugar<span className="text-[#A5CFC8]">degree</span>°
        </h1>
      </div>

      {/* Bento Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 auto-rows-[180px] gap-4">
        {images.map((img, i) => (
          <motion.div
            key={img._id}
            onClick={() => setSelectedImage(img)}
            whileHover={{ scale: 1.02 }}
            className={`
              relative overflow-hidden rounded-3xl shadow-lg cursor-pointer group
              ${i % 6 === 0 ? "md:col-span-2 md:row-span-2" : ""}
              ${i % 5 === 0 ? "row-span-2" : ""}
            `}
          >
            <img
              src={img.imageUrl}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />

            {/* Overlay */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition" />

            
          </motion.div>
        ))}

        {/* Skeletons */}
        {loading &&
          Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-48 bg-gray-300/50 rounded-2xl animate-pulse"
            />
          ))}
      </div>

      {/* Load More */}
      <div className="flex justify-center mt-10">
        <Button
          onClick={() => {
            nextPage();
            fetchApproved();
          }}
          className="rounded-full bg-black text-white px-10 py-2 hover:bg-gray-800"
        >
          Load More
        </Button>
      </div>

      {/* Floating Upload Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => navigate("/upload")}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-red-500 text-white flex items-center justify-center shadow-xl hover:bg-red-600"
      >
        <Plus size={26} />
      </motion.button>

      {/* Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
          >
            <motion.img
              src={selectedImage.imageUrl}
              initial={{ scale: 0.7 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.7 }}
              className="max-w-[90%] max-h-[90%] rounded-3xl shadow-2xl border-4 border-white"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
