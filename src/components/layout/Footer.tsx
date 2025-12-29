import Link from "next/link";

export default function Footer() {
  const sections = [
    {
      title: "Product",
      links: ["Features", "Security", "Pricing", "Roadmap"],
    },
    {
      title: "Company",
      links: ["About", "Careers", "Blog", "Press"],
    },
    {
      title: "Resources",
      links: ["Documentation", "API Reference", "Support", "Status"],
    },
  ];

  return (
    <footer className="relative mt-32 bg-black/40 backdrop-blur-xl border-t border-white/10 bottom-0">


      <div className="absolute inset-x-0 -top-24 h-24 bg-linear-to-t from-indigo-600/20 to-transparent blur-2xl" />

      <div className="max-w-7xl mx-auto px-6 py-20 grid gap-12 md:grid-cols-5">
        

        <div className="md:col-span-2">
          <h2 className="text-2xl font-bold tracking-wide">
            Asset<span className="text-indigo-400">Hub</span>
          </h2>
          <p className="mt-4 text-white/60 max-w-sm leading-relaxed">
            A modern platform to organize, secure, and scale your digital assets
            with confidence.
          </p>
        </div>

        {sections.map((section) => (
          <div key={section.title}>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-widest text-white/70">
              {section.title}
            </h3>
            <ul className="space-y-3">
              {section.links.map((link) => (
                <li key={link}>
                  <Link
                    href="#"
                    className="group inline-flex items-center gap-2 text-white/60 hover:text-white transition"
                  >
                    <span className="relative">
                      {link}
                      <span className="absolute left-0 -bottom-0.5 h-px w-0 bg-indigo-400 transition-all group-hover:w-full" />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

   
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-white/50">
          <span>
            © {new Date().getFullYear()} AssetHub. All rights reserved.
          </span>

          <div className="flex gap-6">
            {["Privacy", "Terms", "Cookies"].map((item) => (
              <Link
                key={item}
                href="#"
                className="hover:text-white transition"
              >
                {item}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
