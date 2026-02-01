import { useEffect, useState } from "react";
import { useImageStore } from "../store/imageStore";
import ImageCard from "../components/ImageCard";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export default function Gallery() {
  const { images, fetchApproved, loading, nextPage } = useImageStore();
  const [selectedImage, setSelectedImage] = useState<any>(null);

  useEffect(() => {
    fetchApproved();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6">
      <h1 className="text-2xl text-gray-800 text-center mb-6">
        sugardegree
      </h1>

      {/* Masonry Grid */}
      <div className="columns-1 sm:columns-2 md:columns-3 gap-4 space-y-4">
        {images.map((img) => (
          <ImageCard
            key={img._id}
            image={img}
            onClick={() => setSelectedImage(img)}
          />
        ))}

        {/* Skeleton Loader */}
        {loading &&
          Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-60 bg-gray-200 rounded-xl animate-pulse mb-4"
            />
          ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-8">
        <Button onClick={nextPage} onMouseUp={fetchApproved}>
          Load More
        </Button>
      </div>

      {/* Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={() => setSelectedImage(null)}
        >
          <motion.img
            src={selectedImage.imageUrl}
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="max-w-[90%] max-h-[90%] rounded-xl"
          />
        </div>
      )}
    </div>
  );
}
