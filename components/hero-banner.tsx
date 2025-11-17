import Image from "next/image";
import { HeroBanner } from "@/lib/types";

type HeroBannerProps = {
  banner: HeroBanner;
};

export default function HeroBannerSection({ banner }: HeroBannerProps) {
  if (!banner) {
    return null;
  }

  const backgroundColor = banner.background_color || "#0f172a";
  const textColor = banner.text_color || "#ffffff";
  const bannerImage = banner.banner_image;

  return (
    <section
      className="mx-auto max-w-(--breakpoint-xl) px-4 py-12 md:py-16"
      style={{ backgroundColor, color: textColor }}
    >
      <div className="grid gap-8 md:grid-cols-2 md:items-center">
        <div className="space-y-4">
          {banner.banner_title ? (
            <h1
              className="text-4xl font-bold md:text-5xl"
              {...(banner?.$?.banner_title || {})}
            >
              {banner.banner_title}
            </h1>
          ) : null}

          {banner.banner_description ? (
            <p
              className="text-lg leading-relaxed"
              style={{ color: textColor }}
              {...(banner?.$?.banner_description || {})}
            >
              {banner.banner_description}
            </p>
          ) : null}
        </div>

        {bannerImage?.url ? (
          <div className="flex justify-center md:justify-end">
            <Image
              src={bannerImage.url}
              alt={bannerImage.title || "Hero banner image"}
              width={480}
              height={320}
              className="h-auto w-full max-w-md rounded-lg shadow-lg"
              {...(bannerImage.$?.url || {})}
            />
          </div>
        ) : null}
      </div>
    </section>
  );
}
