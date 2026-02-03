import { useEffect, useState } from "react";
import { useImageStore } from "../store/imageStore";
import { motion, AnimatePresence } from "framer-motion";
import { Plus } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import LocomotiveScroll from "locomotive-scroll";
import { Skiper41 } from "@/components/ui/skiper-ui/skiper41";
import { Skiper54 } from "@/components/ui/skiper-ui/skiper54";

export default function Gallery() {
  const { images, fetchApproved, loading, nextPage } = useImageStore();
  const [selectedImage, setSelectedImage] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const locomotiveScroll = new LocomotiveScroll();
  }, []);

  useEffect(() => {
    fetchApproved();
  }, []);
  const uniqueImages = Array.from(
    new Map(images.map(i => [i._id, i])).values()
  );

  

  return (
    <div className="min-h-screen bg-[#ff] px-4 py-6 relative flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold tracking-tight text-[#E8918B]">
          sugar<span className="text-[#A5CFC8]">degree</span>°
        </h1>
      </div>
      <div>
        <div className="flex items-center gap-3 mb-5">
          <span className="h-[1px] flex-1 bg-gradient-to-r from-[#E8918B]/40 to-transparent" />

          <h2 className="text-sm md:text-base font-semibold uppercase tracking-widest text-zinc-500">
            Our Picks
          </h2>

          <span className="h-[1px] flex-1 bg-gradient-to-l from-[#A5CFC8]/40 to-transparent" />
        </div>

        <Skiper54 />
      </div>

      {/* Bento Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 auto-rows-[180px] gap-4 flex-1">
        {uniqueImages.map((img, i) => (
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

      {/* FOOTER */}
      <footer className="mt-16 border-t border-gray-200 pt-8 pb-4 text-sm text-gray-600">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* About */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-2">SugarDegree</h3>
            <p className="text-gray-500 text-sm">
              A community gallery for sharing creative moments and visual
              stories. Built with love for design & simplicity.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-2">Quick Links</h3>
            <ul className="space-y-1">
              <li className="hover:text-black cursor-pointer">Home</li>
              <Link to="/upload">
                <li className="hover:text-black cursor-pointer">Upload</li>
              </Link>
              <li className="hover:text-black cursor-pointer">
                Privacy Policy
              </li>
              <li className="hover:text-black cursor-pointer">
                Terms of Service
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-2">Contact</h3>
            <p>Email: support@sugardegree.com</p>
            <p>Instagram: @sugardegree.in</p>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-6 flex flex-col md:flex-row justify-between items-center text-xs text-gray-400">
          <p>© {new Date().getFullYear()} SugarDegree. All rights reserved.</p>

          {/* Hidden admin link */}
          <button
            onClick={() => navigate("/admin/login")}
            className="mt-2 md:mt-0 text-gray-400 hover:text-black transition"
          >
            Are you an admin?
          </button>
        </div>
      </footer>
    </div>
  );
}
