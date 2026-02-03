import { create } from "zustand";
import { CakeImage } from "../types/image";
import { api } from "../api/axios";

interface ImageStore {
  images: CakeImage[];
  page: number;
  loading: boolean;
  currentStatus: "pending" | "approved" | "rejected";

  fetchImages: (status: "pending" | "approved" | "rejected") => Promise<void>;
  fetchApproved: () => Promise<void>;

  updateStatus: (id: string, status: "approved" | "rejected") => Promise<void>;
  toggleVisibility: (id: string, visible: boolean) => Promise<void>;
  deleteImage: (id: string) => Promise<void>;

  nextPage: () => void;
}

export const useImageStore = create<ImageStore>((set, get) => ({
  images: [],
  page: 1,
  loading: false,
  currentStatus: "pending",

  fetchImages: async (status) => {
    set({ loading: true, currentStatus: status });
    const res = await api.get(`/images?status=${status}`);
    set({ images: res.data, loading: false });
  },

  fetchApproved: async () => {
    const { page } = get();
    set({ loading: true });

    const res = await api.get(`/images/public?page=${page}&limit=6`);

    set((state) => ({
      images: [...state.images, ...res.data],
      loading: false,
    }));
  },

  updateStatus: async (id, status) => {
    const res = await api.patch(`/images/${id}`, { status });
  
    set((state) => ({
      images: state.images.map((img) =>
        img._id === id ? res.data : img
      ),
    }));
  },
  

  toggleVisibility: async (id, visible) => {
    await api.patch(`/images/${id}/visibility`, { visible });

    set((state) => ({
      images: state.images.map((img) =>
        img._id === id ? { ...img, visible } : img
      ),
    }));
  },

  deleteImage: async (id) => {
    await api.delete(`/images/${id}`);

    set((state) => ({
      images: state.images.filter((img) => img._id !== id),
    }));
  },

  nextPage: () => set((state) => ({ page: state.page + 1 })),
}));
