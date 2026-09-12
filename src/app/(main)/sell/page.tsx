import SellForm from "@/components/SellForm";

export const metadata = {
  title: "Sell Your Property | Kreebz Ltd",
  description: "Your property, shown to qualified buyers — not the whole internet.",
};

export default function SellPage() {
  return (
    <main className="bg-obsidian min-h-screen pt-32 pb-24 lg:pt-40 lg:pb-32">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <div className="max-w-3xl mx-auto text-center mb-16 lg:mb-24">
          <h1 className="font-serif text-off-white text-[clamp(40px,5vw,72px)] leading-[1.1] font-light mb-6">
            Sell without the noise
          </h1>

        </div>

        <div className="max-w-2xl mx-auto">
          <SellForm />
        </div>
      </div>
    </main>
  );
}
