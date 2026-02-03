import { useEffect, useState } from "react";
import { useImageStore } from "../store/imageStore";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { motion } from "framer-motion";

type ActionType = "approve" | "reject" | "delete";

export default function AdminDashboard() {
  const {
    images,
    fetchImages,
    updateStatus,
    toggleVisibility,
    deleteImage,
    loading,
  } = useImageStore();

  const [tab, setTab] = useState<"pending" | "approved" | "rejected">("pending");
  const [confirm, setConfirm] = useState<{ id: string; action: ActionType } | null>(null);
  const [selected, setSelected] = useState<string[]>([]);

  useEffect(() => {
    fetchImages(tab);
    setSelected([]);
  }, [tab]);

  const toggleSelect = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleBulk = (action: "approved" | "rejected") => {
    selected.forEach((id) => updateStatus(id, action));
    setSelected([]);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

      {/* Tabs */}
      <div className="flex gap-3 mb-4">
        {["pending", "approved", "rejected"].map((t) => (
          <Button
            key={t}
            variant={tab === t ? "default" : "outline"}
            onClick={() => setTab(t as any)}
          >
            {t.toUpperCase()}
          </Button>
        ))}
      </div>

      {/* Bulk Actions */}
      {selected.length > 0 && tab === "pending" && (
        <div className="flex gap-3 mb-4">
          <Button
            className="bg-green-500 text-white"
            onClick={() => handleBulk("approved")}
          >
            Bulk Approve ({selected.length})
          </Button>

          <Button
            className="bg-pink-500 text-white"
            onClick={() => handleBulk("rejected")}
          >
            Bulk Reject ({selected.length})
          </Button>
        </div>
      )}

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {images.map((img) => (
          <motion.div key={img._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Card className="overflow-hidden rounded-xl shadow relative">

              {/* Checkbox */}
              <input
                type="checkbox"
                checked={selected.includes(img._id)}
                onChange={() => toggleSelect(img._id)}
                className="absolute top-3 right-3 w-4 h-4 accent-black"
              />

              <img src={img.imageUrl} className="h-48 w-full object-cover" />

              <CardContent className="p-4 space-y-2">
                <h2 className="font-semibold">{img.title}</h2>
                <p className="text-sm text-gray-500">Status: {img.status}</p>

                <div className="flex gap-2 flex-wrap">
                  {tab === "pending" && (
                    <>
                      <Button
                        size="sm"
                        className="bg-green-400 text-black font-semibold"
                        onClick={() => setConfirm({ id: img._id, action: "approve" })}
                      >
                        Approve
                      </Button>

                      <Button
                        size="sm"
                        className="bg-pink-500 text-white font-semibold"
                        onClick={() => setConfirm({ id: img._id, action: "reject" })}
                      >
                        Reject
                      </Button>
                    </>
                  )}

                  {tab !== "pending" && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => toggleVisibility(img._id, !img.visible)}
                    >
                      {img.visible ? "Hide" : "Show"}
                    </Button>
                  )}

                  <Button
                    size="sm"
                    className="bg-red-500 text-white"
                    onClick={() => setConfirm({ id: img._id, action: "delete" })}
                  >
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {images.length === 0 && !loading && (
        <p className="text-center mt-12 text-gray-500">No images found</p>
      )}

      {/* Alert Dialog */}
      <AlertDialog open={!!confirm} onOpenChange={() => setConfirm(null)}>
        <AlertDialogContent className="bg-white text-black border shadow-xl rounded-lg">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-lg font-bold">
              Confirm Action
            </AlertDialogTitle>
          </AlertDialogHeader>

          <p className="text-gray-600">
            Are you sure you want to {confirm?.action} this image?
          </p>

          <AlertDialogFooter>
            <AlertDialogCancel className="border">Cancel</AlertDialogCancel>

            <AlertDialogAction
              className="bg-red-500 text-white hover:bg-red-600"
              onClick={() => {
                if (!confirm) return;

                if (confirm.action === "approve")
                  updateStatus(confirm.id, "approved");

                if (confirm.action === "reject")
                  updateStatus(confirm.id, "rejected");

                if (confirm.action === "delete")
                  deleteImage(confirm.id);

                setConfirm(null);
              }}
            >
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
