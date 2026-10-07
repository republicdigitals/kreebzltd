import SellContent from "@/components/SellContent";

export const metadata = {
  title: "Sell Your Property | Kreebz Ltd",
  description: "Your property, shown to qualified buyers — not the whole internet.",
};

export default function SellPage() {
  return (
    <main className="bg-obsidian min-h-screen">
      <SellContent />
    </main>
  );
}
