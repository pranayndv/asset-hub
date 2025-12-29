"use client";

import { checkoutRquest } from "@/actions/checkoutActions";
import { useState } from "react";
import toast from "react-hot-toast";

export default function CheckoutButton({
  assetId,
  quantityAvailable,
  styleType = "minimal",
}: {
  assetId: string;
  quantityAvailable: number | undefined;
  styleType?: "minimal" | "glass" | "gradient";
}) {
  const [loading, setLoading] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const handleCheckout = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (loading) return;

    setLoading(true);
    toast.dismiss();

    try {
      const res = await checkoutRquest(assetId, quantity);

      if (res?.success || res?.status === 200) {
        toast.success("Checkout request created successfully!");
      } else {
        toast.error(res?.message || "Failed to checkout");
      }
    } catch (err) {
      console.error("Checkout Error:", err);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const buttonStyles = {
    minimal:
      "w-full py-3 rounded-lg font-medium text-white bg-gray-800 hover:bg-gray-900 disabled:opacity-50 transition-all shadow-md hover:shadow-lg",
    glass:
      "w-full py-3 rounded-xl font-semibold text-white backdrop-blur-md bg-blue-600/70 hover:bg-blue-600/90 disabled:opacity-40 transition-all shadow-lg hover:shadow-blue-300/40",
    gradient:
      "relative w-full py-3 rounded-xl overflow-hidden text-white font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-xl disabled:opacity-40 transition-all",
  };

  return (
    <div className="space-y-4">

      {quantityAvailable && quantityAvailable > 1 && (
        <div className="flex flex-col space-y-1">
          <label className="text-sm text-gray-600 font-medium">
            Select Quantity
          </label>

          <select
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            className="border border-gray-300 rounded-lg p-2 w-full text-gray-700 
                       shadow-sm focus:ring-2 focus:outline-none
                       hover:border-gray-400 transition"
          >
            {Array.from({ length: quantityAvailable }, (_, i) => (
              <option key={i + 1} value={i + 1}>
                {i + 1}
              </option>
            ))}
          </select>
        </div>
      )}
      <button
        onClick={handleCheckout}
        disabled={loading}
        className={buttonStyles[styleType]}
      >
        {loading ? "Processing..." : "Checkout Asset"}
      </button>
    </div>
  );
}
