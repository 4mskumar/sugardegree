import UploadForm from "../components/UploadForm";

export default function Upload() {
  return (
    <div className="p-6 flex flex-col justify-center items-center bg-gradient-to-br from-slate-50 to-slate-100 overflow-hidden">
      <h1 className="inter font-semibold tracking-tight text-2xl">Upload Cake Image</h1>
      <UploadForm />
    </div>
  );
}
