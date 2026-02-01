import { useEffect, useState } from "react";
import { api } from "../api/axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";

interface CakeImage {
  _id: string;
  title: string;
  imageUrl: string;
  status: string;
}

const AdminDashboard = () => {
  const [images, setImages] = useState<CakeImage[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchPending = async () => {
    const res = await api.get("/images?status=pending");
    setImages(res.data);
  };

  const toggleSelect = (id: string) => {
    if (selected.includes(id)) {
      setSelected(selected.filter((i) => i !== id));
    } else {
      setSelected([...selected, id]);
    }
  };

  const bulkUpdate = async (status: "approved" | "rejected") => {
    if (selected.length === 0) return;
    try {
      setLoading(true);
      await Promise.all(
        selected.map((id) =>
          api.patch(`/images/${id}`, { status })
        )
      );
      setImages(images.filter((img) => !selected.includes(img._id)));
      setSelected([]);
    } catch (err) {
      console.error(err);
      alert("Bulk action failed");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.reload();
  };

  useEffect(() => {
    fetchPending();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Pending Cake Images</h1>
        <Button onClick={handleLogout} variant={"destructive"} className="bg-red-500">
          Logout
        </Button>
      </div>

      {images.length > 0 && (
        <div className="flex gap-2 mb-4">
          <Button
            onClick={() => bulkUpdate("approved")}
            disabled={selected.length === 0 || loading}
          >
            Bulk Approve
          </Button>
          <Button
            onClick={() => bulkUpdate("rejected")}
            disabled={selected.length === 0 || loading}
            variant="destructive"
            className="bg-red-500"
          >
            Bulk Reject
          </Button>
          <span className="ml-auto text-sm text-gray-500">
            Selected {selected.length} / {images.length}
          </span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {images.map((img) => (
          <motion.div
            key={img._id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative"
          >
            <Card className="overflow-hidden shadow-lg rounded-2xl">
              <img
                src={img.imageUrl}
                alt={img.title}
                className="w-full h-48 object-cover"
              />
              <CardContent className="flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg">{img.title}</CardTitle>
                  <input
                    type="checkbox"
                    checked={selected.includes(img._id)}
                    onChange={() => toggleSelect(img._id)}
                    className="w-4 h-4 accent-blue-500"
                  />
                </div>
                <div className="flex gap-2 mt-2">
                  <Button
                    onClick={() =>
                      api.patch(`/images/${img._id}`, { status: "approved" }).then(() =>
                        setImages(images.filter((i) => i._id !== img._id))
                      )
                    }
                    size="sm"
                  >
                    Approve
                  </Button>
                  <Button
                    onClick={() =>
                      api.patch(`/images/${img._id}`, { status: "rejected" }).then(() =>
                        setImages(images.filter((i) => i._id !== img._id))
                      )
                    }
                    size="sm"
                    variant="destructive"
                    className="bg-red-500"
                  >
                    Reject
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {images.length === 0 && (
        <p className="text-center text-gray-500 mt-12">No pending images</p>
      )}
    </div>
  );
};

export default AdminDashboard;
