"use client";

import { useState } from "react";
import { AssetStatus } from "@prisma/client";
import { deleteAsset, deleteAssetType, updateAsset } from "@/actions/adminActions";
import Image from "next/image";
import fetchData from "@/hooks/getFetch";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { postFetch } from "@/hooks/postFetch";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import FormError from "@/components/ui/FormError";
import { Select } from "@/components/ui/Select";
import Modal from "@/components/ui/Modal";
import PageHeader from "@/components/common/PageHeader";

interface AssetType {
  typeId: string;
  name: string;
}

interface Asset {
  assetId: string;
  label: string;
  status: AssetStatus;
  imageUrl?: string;
  quantity: number;
  availableQuantity: number;
}

interface Props {
  assetTypes: AssetType[];
}

const EditAssetSchema = z.object({
  label: z.string().min(2, "Label must be at least 2 characters"),
  status: z.nativeEnum(AssetStatus),
  quantity: z.number().min(1, "Min quantity is 1"),
  availableQuantity: z.number().min(0, "Cannot be negative"),
  image: z.any().optional(),
});

type EditAssetForm = z.infer<typeof EditAssetSchema>;

export default function ManageAssetsSection({ assetTypes }: Props) {
  const [selectedType, setSelectedType] = useState("");
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentAsset, setCurrentAsset] = useState<Asset | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<EditAssetForm>({
    resolver: zodResolver(EditAssetSchema),
  });

  // eslint-disable-next-line react-hooks/incompatible-library
  const newImage = watch("image");

  const fetchAssets = async (typeId: string) => {
    setLoading(true);
    const { data } = await fetchData<Asset[]>(`/api/asset-types/by-type/${typeId}`);
    setAssets(data ?? []);
    setLoading(false);
  };

  const openEditModal = (asset: Asset) => {
    setCurrentAsset(asset);
    reset({
      label: asset.label,
      status: asset.status,
      quantity: asset.quantity,
      availableQuantity: asset.availableQuantity,
      image: undefined,
    });
    setModalOpen(true);
  };

  const onSubmitEdit = async (formData: EditAssetForm) => {
    if (!currentAsset) return;

    let imageUrl = currentAsset.imageUrl;

    if (formData.image?.[0]) {
      const uploadData = new FormData();
      uploadData.append("file", formData.image[0]);

      const res = await postFetch("/api/upload", uploadData);
      const json = await res.json();

      if (!json.success) return toast.error("Image upload failed");
      imageUrl = json.url;
    }

    if (formData.availableQuantity > formData.quantity) {
      return toast.error("Available quantity cannot exceed total");
    }

    const res = await updateAsset(currentAsset.assetId, {
      label: formData.label,
      status: formData.status,
      imageUrl,
      quantity: formData.quantity,
      availableQuantity: formData.availableQuantity,
    });

    if (!res.success) return toast.error("Update failed");

    toast.success("Asset updated");
    setModalOpen(false);
    if (selectedType) fetchAssets(selectedType);
  };

  const handleDelete = async (assetId: string) => {
    await deleteAsset(assetId);
    if (selectedType) fetchAssets(selectedType);
  };

  return (
    <div className="p-6 bg-white/80 backdrop-blur-xl border border-gray-200 rounded-2xl shadow-lg space-y-6">

       <PageHeader text={`Manage Assets`} />


      <div className="flex flex-wrap gap-3 items-center">
        <label className="font-medium text-gray-700">Select Type:</label>

        <select
          className="p-3 border w-full border-gray-300 rounded-xl bg-gray-50 shadow-sm 
                     focus:ring-2 focus:ring-blue-500 outline-none transition"
          value={selectedType}
          onChange={(e) => {
            setSelectedType(e.target.value);
            fetchAssets(e.target.value);
          }}
        >
          <option value="">-- Select Type --</option>
          {assetTypes.map((t) => (
            <option key={t.typeId} value={t.typeId}>{t.name}</option>
          ))}
        </select>

        {assets.length === 0 && selectedType && (
          
          <Button idleLabel="Delete Type" pendingLabel="Deleting" color="red" action={async () =>{
             return await deleteAssetType(selectedType);
          }} />
        )}
      </div>

    
      {loading && (
        <div className="flex items-center justify-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600" />
        </div>
      )}

 
      {!loading && assets.length > 0 && (
        <ul className="space-y-5">
          {assets.map((asset) => (
            <li
              key={asset.assetId}
              className="bg-gray-50 border border-gray-200 rounded-xl shadow-sm p-5 
                         flex justify-between gap-5 items-start
                         hover:shadow-md hover:bg-gray-100 transition"
            >
         
              <div className="space-y-1">
                <p className="font-semibold text-lg text-gray-900">{asset.label}</p>
                <p className="text-sm text-gray-600">Status: {asset.status}</p>
                <p className="text-sm text-gray-600">
                  Qty: {asset.quantity} • Available: {asset.availableQuantity}
                </p>

                {asset.imageUrl && (
                  <Image
                    src={asset.imageUrl}
                    width={120}
                    height={120}
                    alt="Asset"
                    className="w-28 h-28 mt-3 rounded-xl object-cover shadow-md"
                  />
                )}
              </div>

            
              <div className="flex flex-col gap-3">
              
                <Button idleLabel="Edit" pendingLabel="Editing" color="blue" action={async () =>{
                    return await openEditModal(asset);
                  }} />

                <Button idleLabel="Delete" pendingLabel="Deleting" color="red" action={async () =>{
                  return await handleDelete(asset.assetId);
                }} />

              </div>
            </li>
          ))}
        </ul>
      )}

    
      {modalOpen && currentAsset && (
       <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Edit Asset"
      >
        <form onSubmit={handleSubmit(onSubmitEdit)} className="space-y-4">
          
          <div>
            <label className="text-sm font-semibold block mb-1">Label</label>
            <Input placeholder="Label" register={register("label")} />
            <FormError message={errors.label?.message} />
          </div>

          <div>
            <label className="text-sm font-semibold block mb-1">Status</label>
            <Select
              register={register("status")}
              options={Object.values(AssetStatus).map((status) => ({
                value: status,
                label: status,
              }))}
            />
          </div>

          <div>
            <label className="text-sm font-semibold block mb-1">Quantity</label>
            <Input
              type="number"
              placeholder="Quantity"
              register={register("quantity", { valueAsNumber: true })}
            />
          </div>

          <div>
            <label className="text-sm font-semibold block mb-1">
              Available Quantity
            </label>
            <Input
              type="number"
              placeholder="Available Quantity"
              register={register("availableQuantity", { valueAsNumber: true })}
            />
          </div>

          <div>
            <label className="text-sm font-semibold block mb-1">
              Replace Image
            </label>
            <Input type="file" accept="image/*" register={register("image")} />

            {newImage?.[0] && (
              <Image
                src={URL.createObjectURL(newImage[0])}
                width={120}
                height={120}
                className="mt-3 rounded-xl shadow-md object-cover w-28 h-28"
                alt="Preview"
              />
            )}
          </div>


          <div className="flex justify-end gap-3 pt-2">
            <Button
              idleLabel="Cancel"
              color="red"
              action={async () => setModalOpen(false)}
            />

            <Button
              idleLabel="Save"
              type="submit"
              pendingLabel="Saving"
              disabled={isSubmitting}
              color="green"
            />
          </div>
        </form>
      </Modal>

      )}
    </div>
  );
}
