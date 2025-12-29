import Footer from "@/components/layout/Footer";
import { ArrowRight, Boxes, Lock, Sparkles } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <main className="relative ">

  
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-[-200px] left-[-200px] w-[500px] h-[500px] bg-indigo-600/30 rounded-full blur-[120px] animate-float" />
        <div className="absolute bottom-[-200px] right-[-200px] w-[500px] h-[500px] bg-cyan-500/20 rounded-full blur-[120px] animate-float delay-2000" />
      </div>



      {/* Hero */}
      <section className="pt-24 pb-20 text-center px-6">
        <div className="max-w-5xl mx-auto animate-fadeUp">
          <span className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-white/5 md:bg-gray-200 border border-white/10 text-sm text-white/70 md:text-white mb-6">
            <Sparkles size={14} /> Digital Asset Platform
          </span>

          <h1 className="text-5xl md:text-7xl font-extrabold leading-tight bg-linear-to-r from-indigo-400 via-cyan-400 to-indigo-400 bg-clip-text text-transparent animate-glow">
            Control Every Asset.
            <br />
            Scale Without Limits.
          </h1>

          <p className="mt-6 text-lg text-gray-400 max-w-2xl mx-auto">
            AssetHub centralizes, secures, and accelerates your digital asset
            management built for modern teams.
          </p>

          <div className="mt-12 flex justify-center gap-4">
             <Link href="asset-types" className="group px-8 py-4 rounded-xl text-white bg-indigo-600 hover:bg-indigo-500 transition flex items-center font-bold gap-2 shadow-2xl">
              View Assets
              <ArrowRight className="group-hover:translate-x-1 transition" />
            </Link>
           
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-28 max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-3 gap-8">
          <Card
            icon={<Boxes />}
            title="Unified Asset Hub"
            desc="All assets organized, searchable, and accessible in one intelligent platform."
          />
          <Card
            icon={<Lock />}
            title="Enterprise Security"
            desc="Role-based access, encryption, and audit-ready controls."
          />
          <Card
            icon={<Sparkles />}
            title="Blazing Performance"
            desc="Optimized for speed, scale, and modern workflows."
          />
        </div>
      </section>

      {/* CTA */}
      <section className="py-32 text-center px-6">
        <div className="max-w-4xl mx-auto rounded-3xl bg-linear-to-br from-indigo-600/20 to-cyan-600/10 border border-white/10 p-16 backdrop-blur-xl">
          <h2 className="text-4xl font-bold mb-6">
            Build Faster. Manage Smarter.
          </h2>
          <p className="text-indigo-600 mb-10">
            Join teams using AssetHub to eliminate chaos and scale confidently.
          </p>
          <button className="px-10 py-4 text-white font-bold rounded-2xl bg-indigo-600 hover:bg-indigo-500 transition shadow-xl">
            Start Free
          </button>
        </div>
      </section>

      {/* Footer */}
      <Footer/>
    </main>
  );
}

function Card({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <div className="group p-8 rounded-2xl bg-white border border-gray-200 backdrop-blur-xl hover:border-indigo-500/40 hover:-translate-y-2 transition-all duration-300">
      <div className="text-indigo-400 mb-4 group-hover:scale-110 transition">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-3 ">{title}</h3>
      <p className="text-gray-400 text-sm">{desc}</p>
    </div>
  );
}
