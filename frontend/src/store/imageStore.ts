import { create } from "zustand";
import { CakeImage } from "../types/image";
import { api } from "../api/axios";

interface ImageStore {
  images: CakeImage[];
  fetchApproved: () => Promise<void>;
  fetchPending: () => Promise<void>;
  approveImage: (id: string) => Promise<void>;
  page: number;
  loading : boolean;
}

export const useImageStore = create<ImageStore>((set, get) => ({
  images: [],
  page: 1,
  loading: false,

  fetchApproved: async () => {
    const { page } = get();
    set({ loading: true });

    const res = await api.get(`/images?status=approved&page=${page}&limit=6`);

    set((state) => ({
      images: [...state.images, ...res.data],
      loading: false,
    }));
  },
  fetchPending: async () => {
    const res = await api.get<CakeImage[]>("/images?status=pending");
    set({ images: res.data });
  },

  approveImage: async (id: string) => {
    await api.patch(`/images/${id}`, { status: "approved" });
    set((state) => ({
      images: state.images.filter((img) => img._id !== id)
    }));
  },
  
  likeImage: async (id: String) => {
    await api.post(`/images/${id}/like`);
    set((state) => ({
      images: state.images.map((img) =>
        img._id === id ? { ...img, likes: img.likes + 1 } : img
      ),
    }));
  },

  nextPage: () => set((state) => ({ page: state.page + 1 })),
}));
