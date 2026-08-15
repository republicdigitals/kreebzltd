import SellForm from "@/components/SellForm";

export const metadata = {
  title: "Sell Your Property | Kreebz Ltd",
  description: "Discreetly market your premium asset to a qualified network of high-net-worth buyers.",
};

export default function SellPage() {
  return (
    <main className="bg-obsidian min-h-screen pt-32 pb-24 lg:pt-40 lg:pb-32">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <div className="max-w-3xl mx-auto text-center mb-16 lg:mb-24">
          <h1 className="font-serif text-off-white text-[clamp(40px,5vw,72px)] leading-[1.1] font-light mb-6">
            List Your Asset
          </h1>
          <p className="font-sans text-muted tracking-wide text-lg leading-relaxed">
            [Kreebz Content Placeholder: Describe your approach to property valuation, marketing strategy, and access to qualified buyers. Avoid making unverifiable performance guarantees here.]
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          <SellForm />
        </div>
      </div>
    </main>
  );
}
