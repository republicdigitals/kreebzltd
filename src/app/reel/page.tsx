import { Suspense } from "react";
import type { Metadata } from "next";
import ReelFilm from "@/components/reel/ReelFilm";

export const metadata: Metadata = {
  title: "Kreebz — The Quiet Standard",
  robots: { index: false, follow: false },
};

export default function ReelPage() {
  return (
    <div data-theme="dark" className="fixed inset-0 bg-[#0c0b09] overflow-hidden">
      <Suspense fallback={null}>
        <ReelFilm />
      </Suspense>
    </div>
  );
}
