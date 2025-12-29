import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "AssetHub - Request your asset here",
  description: "Manage your organisation assets esaily and efficiently",
};


async function getAssets() {
  const res = await fetch(
    process.env.NEXTAUTH_URL + "/api/asset-types",
    { cache: "no-store" }
  );
  return res.json();
}

interface AssetType {
  typeId: string;
  name: string;
  description: string;
}

export default async function Page() {
  const result = await getAssets();
  const assetTypes: AssetType[] = result?.data ?? result ?? [];

  return (
    <div className="max-w-7xl mx-auto px-6 pb-20 pt-10">
      <div className="mb-14">
        <h1 className="text-4xl font-semibold tracking-tight text-gray-900">
          Asset Types
        </h1>
        <p className="mt-2 text-gray-500">
          Browse and manage different categories of assets
        </p>
      </div>


      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {assetTypes.map((type) => (
          <Link
            key={type.typeId}
            href={`/asset-types/${type.typeId}`}
            className="
              group relative rounded-2xl p-6
              border border-gray-200/50
              bg-white/70 backdrop-blur-xl
              transition-all duration-300 ease-out
              hover:-translate-y-2 hover:shadow-xl
            "
          >
        
            <div className="pointer-events-none absolute inset-0 rounded-2xl bg-linear-to-br from-indigo-50/0 to-indigo-100/40 opacity-0 group-hover:opacity-100 transition-opacity" />

         
            <div className="
              relative z-10 mb-5
              flex h-14 w-14 items-center justify-center
              rounded-xl bg-gray-100
              text-lg font-semibold text-gray-800
              transition-all
              group-hover:bg-gray-600
              group-hover:text-white
            ">
              {type.name.charAt(0)}
            </div>

     
            <h2 className="relative z-10 text-lg font-semibold text-gray-900 mb-1">
              {type.name}
            </h2>

        
            <p className="relative z-10 text-sm text-gray-600 leading-relaxed line-clamp-3">
              {type.description}
            </p>

       
            <span className="
              absolute bottom-5 right-5
              text-gray-400 text-sm
              opacity-0 translate-x-2
              group-hover:opacity-100 group-hover:translate-x-0
              transition-all
            ">
              →
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
