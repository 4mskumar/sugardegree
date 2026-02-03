export interface CakeImage {
  _id: string;
  title: string;
  tags: string[];
  imageUrl: string;
  status: "pending" | "approved" | "rejected";
  visible: boolean;
  createdAt: string;
  likes: number;
}
