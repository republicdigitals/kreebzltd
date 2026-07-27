import type { Metadata } from "next";
import Contact from "@/components/Contact";

export const metadata: Metadata = {
  title: "Contact | Kreebz Limited",
  description: "Begin the conversation. Your property deserves a principal.",
};

export default function ContactPage() {
  return (
    <div className="dark-mode bg-obsidian pt-24 md:pt-28">
      <Contact />
    </div>
  );
}
