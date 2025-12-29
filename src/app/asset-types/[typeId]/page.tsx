import { getServerSession } from "next-auth";
import RequestButton from "./RequestButton";
import Image from "next/image";
import { authOptions } from "@/lib/auth/auth";
import { Session } from "next-auth";


async function getAssets(id: string) {
  const res = await fetch(
    process.env.NEXTAUTH_URL + "/api/asset-types/by-type/" + id,
    { cache: "no-store" }
  );


  const data = await res.json();
  return data;
}

export interface AssetType {
  typeId: string;
  name: string;
  description: string;
}

export interface Asset {
  assetId: string;
  label: string;
  status: "AVAILABLE" | "ASSIGNED" | "MAINTENANCE" | "RETIRED" | "PENDING";
  typeId: string;
  type: AssetType;
  imageUrl?: string | null;
  quantity?: number;        
  availableQuantity?: number; 
}

export default async function Page({ params }: { params: { typeId: string } }) {
  const { typeId } = await params;
  const result = await getAssets(typeId);

  const assets: Asset[] = result?.data ?? [];

  const session = await getServerSession(authOptions);

  const filterAssets = assets.filter(
    (ass) => ass.status === "AVAILABLE" && (ass.availableQuantity ?? 1) > 0
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-10 text-gray-900 tracking-tight">
        Available Assets
      </h1>

      {filterAssets.length === 0 && (
        <p className="text-gray-500 text-sm">No assets available.</p>
      )}

      <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {filterAssets.map((item) => (
          <AssetCard key={item.assetId} session={session} item={item} />
        ))}
      </div>
    </div>
  );
}

function AssetCard({ item, session }: { item: Asset, session:Session | null }) {

  return (
    <div
      className="
        group relative flex flex-col justify-between p-5 rounded-3xl 
        border border-gray-400 
        bg-white/60 backdrop-blur-lg 
        shadow-[0_8px_30px_rgb(0,0,0,0.06)]
        hover:shadow-[0_15px_40px_rgb(0,0,0,0.10)]
        hover:border-black/40
        transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]
        hover:-translate-y-3 hover:scale-[1.01] f
      "
    >
      <div>
      <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-20 bg-linear-to-br from-white to-gray-300 transition-opacity duration-500 pointer-events-none" />


      <div className="relative w-full h-48 mb-5 rounded-2xl overflow-hidden bg-gray-100 shadow-inner transition-all duration-500 group-hover:shadow-lg">
        {item.imageUrl ? (
          <Image
            width={600}
            height={400}
            src={item.imageUrl}
            alt={item.label}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400 text-sm">
            No Image
          </div>
        )}

        <div className="absolute inset-0 bg-linear-to-b from-black/10 to-transparent" />
      </div>


      <h2 className="text-xl font-semibold text-gray-900 mb-1 tracking-tight group-hover:text-black transition-all duration-500">
        {item.label}
      </h2>

      <p className="text-gray-600 text-sm mb-2">{item.type?.name}</p>


      <span className="inline-block px-3 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700">
        {item.status}
      </span>

      

      
      <div className="absolute top-0 left-0 w-10 h-10 bg-white/60 blur-lg rounded-full opacity-0 group-hover:opacity-40 transition-all duration-700"></div>
      <div className="absolute bottom-0 right-0 w-10 h-10 bg-gray-300/40 blur-xl rounded-full opacity-0 group-hover:opacity-40 transition-all duration-700"></div>
      </div>
      
      <div className="pt-5 ">
        {!session?.user || session?.user.role == "ADMIN" ? 
      '':  
      <RequestButton assetId={item.assetId} quantityAvailable={item.availableQuantity}  />
      }
        
      </div>
    </div>
  );
}
