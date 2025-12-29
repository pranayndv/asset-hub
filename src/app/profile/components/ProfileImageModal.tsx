"use client";

import { changeProfile } from "@/actions/userActions";
import FormButton from "@/components/ui/FormButton";
import { Session } from "next-auth";
import Image from "next/image";
import { useState} from "react";
import toast from "react-hot-toast";

export default function ProfileImageModal({
  children,
  session,
  currentImage,
}: {
  children: React.ReactNode;
  session:Session | null
  currentImage: string;
}) {
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);


  const handleUpload = async () => {
    if (!file) return toast.error("Please select an image");

    const formData = new FormData();
    formData.append("image", file);

    const json = await changeProfile(formData);

    if (!json.success) return toast.error(json.message || "Upload failed");

    toast.success("Profile Picture Updated!");

    setOpen(false);
  };

  return (
    <>

      <div onClick={() => setOpen(true)} className="cursor-pointer">
        
        
         {session?.user?.profileImage ? (
        <Image
          width={112}
          height={112}
          id="pf-img"
          src={currentImage}
          alt="Profile Pic"
          className="rounded-full border-4 border-blue-600 w-28 h-28 object-cover"
        />
        ) : (
          <div className="text-5xl font-bold text-gray-700 border-4 border-blue-600 w-28 h-28  rounded-full grid place-items-center">
            {session?.user?.name?.charAt(0).toUpperCase()}
          </div>
        )}

        {children}
      </div>

  
      {open && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl w-80 space-y-4 animate-fadeIn">
            <h3 className="text-lg font-bold text-gray-700">
              Update Profile Picture
            </h3>

            <input
              type="file"
              accept="image/*"
              className="border p-2 w-full rounded-md"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />

            {file && (
              <p className="text-sm text-gray-600 truncate">{file.name}</p>
            )}

            <div className="flex justify-end gap-3">
              <FormButton
                label="Cancel"                
                onClick={() => setOpen(false)}
                color="red"
              />
              <FormButton
                label="Upload"                
                onClick={handleUpload}
                color="green"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
