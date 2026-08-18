import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const metadata = {
  title: "Profile | Kreebz",
};

export default async function AccountPage() {
  const session = await getServerSession(authOptions);

  return (
    <div className="space-y-12">
      <div>
        <h2 className="font-serif text-3xl text-off-white font-light mb-2">Your Profile</h2>
        <p className="text-muted text-sm tracking-wide">
          Manage your account details and access your private collection.
        </p>
      </div>

      <div className="bg-surface/50 border border-border/20 rounded-2xl p-8 sm:p-12 space-y-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-muted mb-2">Registered Name</p>
            <p className="text-off-white font-sans text-lg">{session?.user?.name || "Client"}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-muted mb-2">Email Address</p>
            <p className="text-off-white font-sans text-lg">{session?.user?.email || "No Email Provided"}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-muted mb-2">Account Role</p>
            <p className="text-gold-light font-sans text-lg capitalize">{session?.user?.role?.toLowerCase() || "Client"}</p>
          </div>
        </div>

        <div className="pt-8 border-t border-white/5">
          <p className="text-sm text-muted font-sans leading-relaxed">
            Your information is handled with absolute discretion. If you need to update your details or require concierge support, please reach out directly to your assigned principal.
          </p>
        </div>
      </div>
    </div>
  );
}
