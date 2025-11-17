import HeroBanner from "@/components/hero-banner";
import ContentstackPage from "@/components/contentstack-page";
import { getHeroBanner } from "@/lib/contentstack";

export default async function AboutPage() {
  const heroBanner = await getHeroBanner();

  return (
    <>
      {heroBanner ? (
        <HeroBanner banner={heroBanner} />
      ) : (
        <section className="mx-auto max-w-(--breakpoint-md) px-4 py-12 text-center">
          <p className="text-lg text-slate-600">
            Hero banner content isn&apos;t available yet.
          </p>
        </section>
      )}

      <ContentstackPage url="/about" />
    </>
  );
}
