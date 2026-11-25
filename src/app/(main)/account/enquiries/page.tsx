import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { MessageSquare } from "lucide-react";

export const metadata = { title: "My Enquiries | Kreebz" };

function statusStyle(status: string) {
  switch (status) {
    case "New":                 return "text-cyan-400 border-cyan-400/30 bg-cyan-400/10";
    case "Contacted":           return "text-gold border-gold/30 bg-gold/10";
    case "Qualified":           return "text-emerald-400 border-emerald-400/30 bg-emerald-400/10";
    case "Consultation booked": return "text-emerald-400 border-emerald-400/30 bg-emerald-400/10";
    case "Viewing booked":      return "text-emerald-400 border-emerald-400/30 bg-emerald-400/10";
    case "Nurture":             return "text-violet-400 border-violet-400/30 bg-violet-400/10";
    case "Closed":              return "text-muted border-border bg-white/5";
    default:                    return "text-muted border-border bg-white/5";
  }
}

export default async function AccountEnquiriesPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect("/login?callbackUrl=/account/enquiries");
  }

  const enquiries = await prisma.lead.findMany({
    where: { email: session.user.email.toLowerCase() },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      interest: true,
      message: true,
      status: true,
      project: true,
      nextStep: true,
      propertyId: true,
      createdAt: true,
    },
  });

  return (
    <div className="space-y-10">
      <div>
        <h2 className="font-serif text-3xl text-off-white font-light mb-2">Your Enquiries</h2>
        <p className="text-muted text-sm tracking-wide">
          Every request you&apos;ve sent us, and where it stands.
        </p>
      </div>

      {enquiries.length === 0 ? (
        <div className="bg-surface/50 border border-border/20 rounded-2xl p-12 text-center">
          <MessageSquare size={24} className="text-muted mx-auto mb-4" strokeWidth={1.5} />
          <p className="text-off-white font-sans mb-2">No enquiries yet</p>
          <p className="text-muted text-sm font-sans">
            When you request a viewing or message the concierge, it will appear here with its status.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {enquiries.map((e) => (
            <div key={e.id} className="bg-surface/50 border border-border/20 rounded-2xl p-6 sm:p-8">
              <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
                <div>
                  <p className="text-off-white font-sans capitalize">
                    {e.interest.replace(/-/g, " ")}
                    {e.project && (
                      <span className="text-gold text-sm ml-2 capitalize">{e.project.replace(/-/g, " ")}</span>
                    )}
                  </p>
                  <p className="text-muted text-xs font-sans mt-1">
                    {new Date(e.createdAt).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                </div>
                <span className={`text-[10px] uppercase tracking-[0.2em] px-3 py-1.5 rounded-full border font-sans ${statusStyle(e.status)}`}>
                  {e.status}
                </span>
              </div>
              {e.message && (
                <p className="text-muted text-sm font-sans leading-relaxed whitespace-pre-wrap border-t border-border/20 pt-4">
                  {e.message}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
