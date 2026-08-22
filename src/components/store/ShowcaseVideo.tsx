type Clip = { title: string; description: string; src: string; poster?: string };

/** Showcase card with a muted looping video as the cover. */
export function ShowcaseVideo({ clip }: { clip: Clip }) {
  return (
    <div className="card-hover group overflow-hidden rounded-xl border bg-white">
      <div className="relative aspect-video overflow-hidden bg-gray-900">
        <video
          src={clip.src}
          poster={clip.poster}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          aria-label={clip.title}
        />
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-gray-900">{clip.title}</h3>
        <p className="mt-1 text-sm text-gray-500">{clip.description}</p>
      </div>
    </div>
  );
}
