import type { Metadata } from "next";
import Contact from "@/components/Contact";

export const metadata: Metadata = {
  title: "Contact | Kreebz Limited",
  description: "Say hello — a real person replies within one business day.",
};

export default function ContactPage() {
  return (
    <div className="bg-obsidian pt-24 md:pt-28">
      <Contact />
    </div>
  );
}
