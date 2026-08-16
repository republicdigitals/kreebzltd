export const metadata = {
  title: "Privacy Policy - Kreebz Ltd",
  description: "Privacy policy for Kreebz Ltd.",
};

export default function PrivacyPage() {
  return (
    <main className="bg-obsidian min-h-screen text-off-white pt-32 pb-24 px-6 md:px-12">
      <div className="max-w-[800px] mx-auto">
        <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-light mb-8 text-white">
          Privacy Policy
        </h1>
        
        <div className="prose prose-lg prose-invert text-neutral-300">
          <p className="lead text-xl text-neutral-400 mb-12">
            At Kreebz Ltd, accessible from kreebzltd.com, one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by Kreebz Ltd and how we use it.
          </p>

          <h2 className="font-serif text-2xl mt-12 mb-6 text-white border-b border-white/10 pb-4">1. Data Collection</h2>
          <p className="mb-4">
            We collect personal information that you voluntarily provide to us when you register on the website, express an interest in obtaining information about us or our products and Services, when you participate in activities on the Website, or otherwise when you contact us. The personal information that we collect depends on the context of your interactions with us and the Website, the choices you make, and the products and features you use.
          </p>

          <h2 className="font-serif text-2xl mt-12 mb-6 text-white border-b border-white/10 pb-4">2. Use of Information</h2>
          <p className="mb-4">
            We use the information we collect or receive:
          </p>
          <ul className="list-disc pl-6 mb-4 space-y-2 text-neutral-400">
            <li>To facilitate account creation and logon process.</li>
            <li>To send administrative information to you.</li>
            <li>To fulfill and manage your property inquiries.</li>
            <li>To deliver targeted advertising to you.</li>
          </ul>

          <h2 className="font-serif text-2xl mt-12 mb-6 text-white border-b border-white/10 pb-4">3. Data Sharing and Protection</h2>
          <p className="mb-4">
            We only share information with your consent, to comply with laws, to provide you with services, to protect your rights, or to fulfill business obligations. We implement appropriate technical and organizational security measures designed to protect the security of any personal information we process.
          </p>

          <h2 className="font-serif text-2xl mt-12 mb-6 text-white border-b border-white/10 pb-4">4. Your Rights</h2>
          <p className="mb-4">
            Depending on your location, you may have certain rights regarding your personal information, such as the right to request access and obtain a copy of your personal information, to request rectification or erasure, to restrict the processing of your personal information, and, if applicable, to data portability.
          </p>
          <p className="mb-4">
            If you have any questions or require more information about our Privacy Policy, do not hesitate to contact us.
          </p>
        </div>
      </div>
    </main>
  );
}
