"use client";

import Image from "next/image";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { postFetch } from "@/hooks/postFetch";
import Button from "@/components/ui/Button";
import toast from "react-hot-toast";
import Input from "@/components/ui/Input";
import FormError from "@/components/ui/FormError";
import { Select } from "@/components/ui/Select";
interface AssetType {
  typeId: string;
  name: string;
}

interface Props {
  assetTypes: AssetType[];
}

const AssetTypeSchema = z.object({
  name: z.string().min(2, "Type name must be at least 2 characters"),
  description: z.string().min(5, "Description must be at least 5 characters"),
});
type AssetTypeForm = z.infer<typeof AssetTypeSchema>;

const AssetSchema = z.object({
  label: z.string().min(2, "Label must be at least 2 characters"),
  typeId: z.string().min(1, "Please select a type"),
  status: z.string().min(1, "Status required"),
  quantity: z.string().min(1, "Quantity required"),
  image: z.any().optional(),
});
type AssetForm = z.infer<typeof AssetSchema>;

export default function AssetForms({ assetTypes }: Props) {
  const {
    register: registerType,
    handleSubmit: handleSubmitType,
    reset: resetType,
    formState: { errors: typeErrors, isSubmitting: typeSubmitting },
  } = useForm<AssetTypeForm>({
    mode:"onChange",
    resolver: zodResolver(AssetTypeSchema),
  });

  const {
    register: registerAsset,
    handleSubmit: handleSubmitAsset,
    watch,
    reset: resetAsset,
    formState: { errors: assetErrors, isSubmitting: assetSubmitting },
  } = useForm<AssetForm>({
    mode:"onChange",
    resolver: zodResolver(AssetSchema),
    defaultValues: {
      status: "AVAILABLE",
      typeId: assetTypes[0]?.typeId || "",
      quantity: "1",
    },
  });

  // eslint-disable-next-line react-hooks/incompatible-library
  const imageFile = watch("image");

  const onAddType = async (data: AssetTypeForm) => {
    const res = await postFetch("/admin/add-type",data);
    if (res.success) {
      toast.success("Asset Type Added");
      resetType();
    }
  };

  const onAddAsset = async (data: AssetForm) => {
    const formData = new FormData();
    formData.append("label", data.label);
    formData.append("typeId", data.typeId);
    formData.append("status", data.status);
    formData.append("quantity", data.quantity);
    if (data.image?.[0]) formData.append("image", data.image[0]);

    const json = await postFetch("/admin/add-assets",formData);

    if (json.success) {
      toast.success("Asset Added Successfully!");
      resetAsset();
    } else {
      toast.error(json.message);
    }
  };

  return (
    <div className="grid md:grid-cols-2 gap-10 p-6">
      <div className= " relative bg-white border border-gray-400 rounded-2xl shadow-lg p-6 hover:shadow-xl transition">
        <h3 className="text-2xl font-semibold text-gray-800 mb-6">
          Add Asset Type
        </h3>

        <form onSubmit={handleSubmitType(onAddType)} className="space-y-5">
          <div>
            <Input
              placeholder="Type Name"
              register={registerType("name")}
            />
            <FormError message={typeErrors.name?.message}/>
            
          </div>

          <div>
            <textarea
              className="w-full 
               p-3 rounded-lg border border-gray-300 bg-gray-50 h-62 focus:ring-1 focus:ring-gray-300 outline-none transition"
              placeholder="Description"
              {...registerType("description")}
            />
            <FormError message={typeErrors.description?.message}/>
            
          </div>
          
          <div className="flex justify-center items-center ">
          <Button
          idleLabel="Add Asset Type"
          type="submit"
          pendingLabel="ADDING"
          color="blue"
          disabled={typeSubmitting}
          className=" bottom-0"
        />
      </div>
      
        </form>
      </div>

      <div className="bg-white border border-gray-400 rounded-2xl shadow-lg p-6 hover:shadow-xl transition">
        <h3 className="text-2xl font-semibold text-gray-800 mb-6">
          Add Asset
        </h3>

        <form onSubmit={handleSubmitAsset(onAddAsset)} className="space-y-5">
          <div>
            <Input
              placeholder="Asset Label"
              register={registerAsset("label")}
            />
            <FormError message={assetErrors.label?.message}/>
          </div>

          <Select
            register={registerAsset("typeId")}
            placeholder="Select asset type"
            options={assetTypes.map((t) => ({
              value: t.typeId,
              label: t.name,
            }))}
          />

          <FormError message={assetErrors.typeId?.message}/>
         
          <div>
            <Input
              type="number"
              min="1"
              placeholder="Quantity"
              register={registerAsset("quantity")}
            />
            <FormError message={assetErrors.quantity?.message}/>
            
          </div>

          <Input
            type="file"
            accept="image/*"
            placeholder="Asset Image"
            register={registerAsset("image")}
          />

          {imageFile?.[0] && (
            <Image
              src={URL.createObjectURL(imageFile[0])}
              alt="preview"
              width={100}
              height={100}
              className="w-28 h-28 rounded-xl object-cover border shadow-md"
            />
          )}

          <Select
          register={registerAsset("status")}
          options={[
            { value: "AVAILABLE", label: "AVAILABLE" },
          ]}
        />


<div className="flex justify-center items-center ">
          <Button
        idleLabel="Add Asset"
        type="submit"
        pendingLabel="ADDING"
        color="green"
        disabled={assetSubmitting}
        className=" bottom-0"
      />
      </div>
        </form>
      </div>
    </div>
  );
}
