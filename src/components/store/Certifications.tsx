import Image from "next/image";

const certifications = [
  {
    src: "/certifications/pure-copper.png",
    alt: "100% Genuine Customer Satisfaction. Pure Copper",
    label: "Pure Copper",
  },
  {
    src: "/certifications/ppemma.png",
    alt: "Member of Pakistan Pumps & Electric Motors Manufacturers Association",
    label: "PPEMMA Member",
  },
  {
    src: "/certifications/iso-9001.png",
    alt: "ISO 9001 Certified",
    label: "ISO 9001 Certified",
  },
] as const;

export function Certifications({ className }: { className?: string }) {
  return (
    <section className={className}>
      <div className="container">
        <div className="mb-6 text-center">
          <h2 className="text-2xl font-bold text-gray-900">Quality & Certifications</h2>
          <p className="mt-1 text-gray-500">Trusted standards behind every product we supply</p>
        </div>
        <div className="grid grid-cols-1 items-center gap-6 sm:grid-cols-3">
          {certifications.map((c) => (
            <div key={c.src} className="flex flex-col items-center gap-3 rounded-xl border bg-white p-5">
              <div className="relative h-36 w-full max-w-[200px]">
                <Image src={c.src} alt={c.alt} fill sizes="200px" className="object-contain" />
              </div>
              <p className="text-center text-sm font-semibold text-gray-800">{c.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
