import mongoose from "mongoose";

export interface IAdmin {
  email: string;
  password: string;
}

const adminSchema = new mongoose.Schema<IAdmin>({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

export const Admin = mongoose.model<IAdmin>("Admin", adminSchema);
