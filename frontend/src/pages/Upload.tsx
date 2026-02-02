import { ArrowBigLeft } from "lucide-react";
import UploadForm from "../components/UploadForm";
import { Link } from "react-router-dom";

export default function Upload() {
  return (
    <div className="p-6 flex flex-col justify-center items-center bg-[#f7f2ea] overflow-hidden">
        <Link to={'/'}>
          <ArrowBigLeft fill="#ef4444" stroke="0" className="absolute top-3 left-3"/>
        </Link>
      <div className="flex items-center gap-2 justify-start">
      <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          do the<span className="text-red-500"> deed</span>
        </h1>
      </div>
      <UploadForm />
    </div>
  );
}
