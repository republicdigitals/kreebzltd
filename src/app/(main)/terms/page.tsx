export default function TermsPage() {
  return (
    <main className="bg-obsidian min-h-screen text-off-white pt-32 pb-24 px-6 md:px-12">
      <div className="max-w-[800px] mx-auto">
        <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-light mb-8 text-white">
          Terms & Conditions
        </h1>
        
        <div className="prose prose-lg prose-invert text-neutral-300">
          <p className="lead text-xl text-neutral-400 mb-12">
            These terms and conditions outline the rules and regulations for the use of Kreebz Ltd&apos;s Website and Services. By accessing this website, we assume you accept these terms and conditions.
          </p>

          <h2 className="font-serif text-2xl mt-12 mb-6 text-white border-b border-white/10 pb-4">1. Introduction</h2>
          <p className="mb-4">
            These terms apply to your use of this website and any services offered through it. By continuing to use the site, you agree to comply with and be bound by these terms. If you disagree with any part of these terms, please do not use our website.
          </p>

          <h2 className="font-serif text-2xl mt-12 mb-6 text-white border-b border-white/10 pb-4">2. Intellectual Property Rights</h2>
          <p className="mb-4">
            Unless otherwise stated, Kreebz Ltd and/or its licensors own the intellectual property rights for all material on the website. All intellectual property rights are reserved. You may access this from Kreebz Ltd for your own personal use subjected to restrictions set in these terms and conditions.
          </p>

          <h2 className="font-serif text-2xl mt-12 mb-6 text-white border-b border-white/10 pb-4">3. Property Listings and Information</h2>
          <p className="mb-4">
            The property details provided on our website are intended for general information purposes only. While we endeavour to keep the information up to date and correct, we make no representations or warranties of any kind, express or implied, about the completeness, accuracy, reliability, suitability, or availability with respect to the website or the information, products, services, or related graphics.
          </p>
          <ul className="list-disc pl-6 mb-4 space-y-2 text-neutral-400">
            <li>Floor plans and measurements are approximate.</li>
            <li>Property availability and pricing are subject to change without notice.</li>
            <li>Images may include artists&apos; impressions or computer-generated renderings for off-plan properties.</li>
          </ul>

          <h2 className="font-serif text-2xl mt-12 mb-6 text-white border-b border-white/10 pb-4">4. Limitation of Liability</h2>
          <p className="mb-4">
            In no event will Kreebz Ltd be liable for any loss or damage including without limitation, indirect or consequential loss or damage, or any loss or damage whatsoever arising from loss of data or profits arising out of, or in connection with, the use of this website.
          </p>

          <h2 className="font-serif text-2xl mt-12 mb-6 text-white border-b border-white/10 pb-4">5. Governing Law</h2>
          <p className="mb-4">
            These Terms shall be governed and construed in accordance with the laws of the jurisdiction in which Kreebz Ltd operates, without regard to its conflict of law provisions. Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights.
          </p>
        </div>
      </div>
    </main>
  );
}
