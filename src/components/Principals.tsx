import Link from "next/link";
import Image from "next/image";
import { ArrowRight, MessageCircle, Phone, Mail } from "lucide-react";
import { principals } from "@/data/principals";
import {
  PRINCIPAL_EMAIL_MAILTO,
  PRINCIPAL_PHONE_TEL,
  PRINCIPAL_WHATSAPP,
} from "@/lib/contact";

/**
 * The people behind the promise — named principals with direct lines.
 * Server component: static content, no client JS needed.
 */
export default function Principals() {
  return (
    <section className="relative py-28 lg:py-40 border-t border-border/10">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-[5fr_7fr] gap-12 lg:gap-20 items-start">
          <div>
            <div className="flex items-center gap-5 mb-8">
              <span className="gold-rule w-12" />
              <p className="eyebrow text-gold">Accountable, by name</p>
            </div>
            <h2 className="display-serif text-off-white mb-6">
              The <span className="accent-italic text-gold-light">principals.</span>
            </h2>
            <p className="text-lead text-muted max-w-md mb-10">
              Every mandate — a purchase, a build, a managed home — has a named
              principal answerable for it. When you call, you reach them directly.
            </p>
            <Link
              href="/contact"
              className="group inline-flex items-center gap-3 text-off-white hover:text-gold transition-colors"
            >
              <span className="eyebrow">Talk to a principal</span>
              <ArrowRight
                size={16}
                strokeWidth={1.5}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>
          </div>

          <div className="flex flex-col gap-4">
            {principals.map((person) => (
              <div
                key={person.name}
                className="bg-panel border border-border rounded-[var(--radius-lg)] p-8 lg:p-10 flex flex-col sm:flex-row sm:items-center gap-7"
              >
                <div className="relative w-20 h-20 shrink-0 rounded-full overflow-hidden border border-gold/30 bg-surface-2 flex items-center justify-center">
                  {person.photo ? (
                    <Image
                      src={person.photo}
                      alt={person.name}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  ) : (
                    <span className="font-serif text-2xl text-gold-light">
                      {person.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </span>
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-serif text-2xl text-off-white">{person.name}</p>
                  <p className="eyebrow text-gold mt-1 mb-3">{person.title}</p>
                  <p className="text-muted text-sm leading-relaxed">{person.credential}</p>
                </div>
                <div className="flex sm:flex-col gap-2 shrink-0">
                  <a
                    href={`${PRINCIPAL_WHATSAPP}?text=${encodeURIComponent(
                      `Hello ${person.name.split(" ")[0]} — I'd like to talk about a property.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`WhatsApp ${person.name}`}
                    className="w-11 h-11 flex items-center justify-center rounded-full border border-border text-off-white/70 hover:border-gold hover:text-gold transition-colors"
                  >
                    <MessageCircle size={17} strokeWidth={1.5} />
                  </a>
                  <a
                    href={PRINCIPAL_PHONE_TEL}
                    aria-label={`Call ${person.name}`}
                    className="w-11 h-11 flex items-center justify-center rounded-full border border-border text-off-white/70 hover:border-gold hover:text-gold transition-colors"
                  >
                    <Phone size={17} strokeWidth={1.5} />
                  </a>
                  <a
                    href={PRINCIPAL_EMAIL_MAILTO}
                    aria-label={`Email ${person.name}`}
                    className="w-11 h-11 flex items-center justify-center rounded-full border border-border text-off-white/70 hover:border-gold hover:text-gold transition-colors"
                  >
                    <Mail size={17} strokeWidth={1.5} />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
