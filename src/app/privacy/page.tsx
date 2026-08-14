import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Kreebz",
  description: "Privacy policy and data handling practices for Kreebz real estate agency.",
};

export default function PrivacyPolicy() {
  return (
    <main className="min-h-screen bg-obsidian text-off-white pt-32 pb-24 px-6 lg:px-12">
      <div className="max-w-3xl mx-auto space-y-8">
        <header className="mb-12">
          <h1 className="text-4xl md:text-5xl font-serif mb-4">Privacy Policy</h1>
          <p className="text-muted tracking-wide text-sm uppercase">Last Updated: August 14, 2026</p>
        </header>

        <section className="space-y-4">
          <h2 className="text-2xl font-serif text-gold">1. Introduction</h2>
          <p className="text-white/70 leading-relaxed">
            At Kreebz Ltd, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our real estate services. Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not access the site.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-serif text-gold">2. Information We Collect</h2>
          <p className="text-white/70 leading-relaxed">
            We may collect information about you in a variety of ways. The information we may collect on the Site includes:
          </p>
          <ul className="list-disc list-inside text-white/70 leading-relaxed space-y-2 ml-4">
            <li><strong>Personal Data:</strong> Personally identifiable information, such as your name, shipping address, email address, and telephone number, that you voluntarily give to us when you register with the Site or when you choose to participate in various activities related to the Site.</li>
            <li><strong>Derivative Data:</strong> Information our servers automatically collect when you access the Site, such as your IP address, your browser type, your operating system, your access times, and the pages you have viewed directly before and after accessing the Site.</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-serif text-gold">3. Use of Your Information</h2>
          <p className="text-white/70 leading-relaxed">
            Having accurate information about you permits us to provide you with a smooth, efficient, and customized experience. Specifically, we may use information collected about you via the Site to:
          </p>
          <ul className="list-disc list-inside text-white/70 leading-relaxed space-y-2 ml-4">
            <li>Administer your account and facilitate transactions.</li>
            <li>Respond to your property inquiries and requests.</li>
            <li>Send you marketing and promotional communications.</li>
            <li>Improve our website and services.</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-serif text-gold">4. Disclosure of Your Information</h2>
          <p className="text-white/70 leading-relaxed">
            We may share information we have collected about you in certain situations. Your information may be disclosed as follows:
          </p>
          <ul className="list-disc list-inside text-white/70 leading-relaxed space-y-2 ml-4">
            <li><strong>By Law or to Protect Rights:</strong> If we believe the release of information about you is necessary to respond to legal process, to investigate or remedy potential violations of our policies, or to protect the rights, property, and safety of others.</li>
            <li><strong>Third-Party Service Providers:</strong> We may share your information with third parties that perform services for us or on our behalf, including payment processing, data analysis, email delivery, hosting services, customer service, and marketing assistance.</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-serif text-gold">5. Contact Us</h2>
          <p className="text-white/70 leading-relaxed">
            If you have questions or comments about this Privacy Policy, please contact us at:
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
