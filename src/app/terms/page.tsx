import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | Kreebz",
  description: "Terms and conditions for using Kreebz real estate services.",
};

export default function TermsOfService() {
  return (
    <main className="min-h-screen bg-obsidian text-off-white pt-32 pb-24 px-6 lg:px-12">
      <div className="max-w-3xl mx-auto space-y-8">
        <header className="mb-12">
          <h1 className="text-4xl md:text-5xl font-serif mb-4">Terms of Service</h1>
          <p className="text-muted tracking-wide text-sm uppercase">Last Updated: August 14, 2026</p>
        </header>

        <section className="space-y-4">
          <h2 className="text-2xl font-serif text-gold">1. Agreement to Terms</h2>
          <p className="text-white/70 leading-relaxed">
            These Terms of Service constitute a legally binding agreement made between you, whether personally or on behalf of an entity, and Kreebz Ltd, concerning your access to and use of our website as well as any other media form, media channel, mobile website or mobile application related, linked, or otherwise connected thereto.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-serif text-gold">2. Intellectual Property Rights</h2>
          <p className="text-white/70 leading-relaxed">
            Unless otherwise indicated, the Site is our proprietary property and all source code, databases, functionality, software, website designs, audio, video, text, photographs, and graphics on the Site (collectively, the "Content") and the trademarks, service marks, and logos contained therein are owned or controlled by us or licensed to us.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-serif text-gold">3. User Representations</h2>
          <p className="text-white/70 leading-relaxed">
            By using the Site, you represent and warrant that: 
          </p>
          <ul className="list-disc list-inside text-white/70 leading-relaxed space-y-2 ml-4">
            <li>All registration and inquiry information you submit will be true, accurate, current, and complete.</li>
            <li>You will maintain the accuracy of such information and promptly update such registration information as necessary.</li>
            <li>You have the legal capacity and you agree to comply with these Terms of Service.</li>
            <li>You will not use the Site for any illegal or unauthorized purpose.</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-serif text-gold">4. Property Listings</h2>
          <p className="text-white/70 leading-relaxed">
            All property listings are subject to availability and we reserve the right to modify, update, or remove any listing at our sole discretion. While we strive to ensure that all information on the Site is accurate and current, we make no representations or warranties of any kind, express or implied, about the completeness, accuracy, reliability, suitability, or availability with respect to the website or the information, products, services, or related graphics contained on the website for any purpose.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-serif text-gold">5. Contact Information</h2>
          <p className="text-white/70 leading-relaxed">
            For any questions or concerns regarding these terms, please contact us at:
          </p>
          <address className="not-italic text-white/70 leading-relaxed">
            Kreebz Ltd<br />
            hello@kreebzltd.com<br />
            +234 806 994 9948
          </address>
        </section>
      </div>
    </main>
  );
}
