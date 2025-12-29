import TabsContent from "./TabsContent"
async function getAssets() {
  const res = await fetch(
    process.env.NEXTAUTH_URL + "/api/asset-types",
    { cache: "no-store" }
  );
  const data = await res.json();
  return data;
}

interface AssetType {
  typeId: string;
  name: string;
  description: string;
}



export default async function AdminDashboard({
  searchParams,
}: {
  searchParams: { tab?: string, action?:string };
}) {

  const result = await getAssets();
  const assetTypes: AssetType[] = result?.data ?? result ?? [];


return (
<>
<TabsContent assetTypes={assetTypes} searchParams={searchParams}/>
</>
);
}
