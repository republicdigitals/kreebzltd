export const metadata = {
  title: "Cookie Preferences - Kreebz Ltd",
  description: "Cookie preferences and policy for Kreebz Ltd.",
};

export default function CookiePreferencesPage() {
  return (
    <main className="bg-obsidian min-h-screen text-off-white pt-32 pb-24 px-6 md:px-12">
      <div className="max-w-[800px] mx-auto">
        <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-light mb-8 text-white">
          Cookie Policy
        </h1>
        
        <div className="prose prose-lg prose-invert text-neutral-300">
          <p className="lead text-xl text-neutral-400 mb-12">
            This Cookie Policy explains what cookies are and how we use them. You should read this policy to understand what cookies are, how we use them, the types of cookies we use, the information we collect using cookies, and how that information is used.
          </p>

          <h2 className="font-serif text-2xl mt-12 mb-6 text-white border-b border-white/10 pb-4">1. What Are Cookies</h2>
          <p className="mb-4">
            Cookies are small text files that are used to store small pieces of information. They are stored on your device when the website is loaded on your browser. These cookies help us make the website function properly, make it more secure, provide better user experience, and understand how the website performs.
          </p>

          <h2 className="font-serif text-2xl mt-12 mb-6 text-white border-b border-white/10 pb-4">2. How We Use Cookies</h2>
          <p className="mb-4">
            As most of the online services, our website uses first-party and third-party cookies for several purposes. First-party cookies are mostly necessary for the website to function the right way, and they do not collect any of your personally identifiable data.
          </p>
          <p className="mb-4">
            The third-party cookies used on our website are mainly for understanding how the website performs, how you interact with our website, keeping our services secure, and overall providing you with a better and improved user experience.
          </p>
          
          <h2 className="font-serif text-2xl mt-12 mb-6 text-white border-b border-white/10 pb-4">3. Types of Cookies We Use</h2>
          <ul className="list-disc pl-6 mb-4 space-y-2 text-neutral-400">
            <li><strong className="text-white">Essential:</strong> Some cookies are essential for you to be able to experience the full functionality of our site. They allow us to maintain user sessions and prevent any security threats.</li>
            <li><strong className="text-white">Statistics:</strong> These cookies store information like the number of visitors to the website, the number of unique visitors, which pages of the website have been visited, etc.</li>
            <li><strong className="text-white">Functional:</strong> These are the cookies that help certain non-essential functionalities on our website, like embedding content like videos.</li>
          </ul>

          <h2 className="font-serif text-2xl mt-12 mb-6 text-white border-b border-white/10 pb-4">4. Manage Your Preferences</h2>
          <p className="mb-4">
            You can manage your cookies preferences by changing your browser settings to block or delete cookies. To find out more about cookies, including how to see what cookies have been set and how to manage and delete them, visit wikipedia.org, www.allaboutcookies.org, or your browser&apos;s help pages.
          </p>
        </div>
      </div>
    </main>
  );
}
