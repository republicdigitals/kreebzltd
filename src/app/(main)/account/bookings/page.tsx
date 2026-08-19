import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { ArrowLeft, ExternalLink } from "lucide-react";

export default async function AccountBookingsPage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect("/login?callbackUrl=/account/bookings");
  }

  const bookings = await prisma.jetBooking.findMany({
    where: { userId: session.user.id },
    include: { jet: true },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="container mx-auto px-6 py-24 md:py-32">
      <div className="mb-12">
        <Link href="/account" className="inline-flex items-center text-sm text-gold hover:text-gold-light transition-colors mb-6 uppercase tracking-[0.1em]">
          <ArrowLeft size={16} className="mr-2" />
          Back to Dashboard
        </Link>
        <h1 className="font-serif text-4xl md:text-5xl text-off-white font-light mb-4">
          Your Jet Bookings
        </h1>
        <p className="text-muted font-sans text-lg">
          Manage your private charter itineraries and payments.
        </p>
      </div>

      <div className="space-y-6">
        {bookings.length === 0 ? (
          <div className="text-center py-16 bg-obsidian-light border border-border/30 rounded-sm">
            <h3 className="font-serif text-2xl text-off-white mb-2">No active bookings</h3>
            <p className="text-muted mb-6">You don&apos;t have any private jet charter bookings yet.</p>
            <Link 
              href="/services/private-jet"
              className="inline-block bg-gold text-obsidian px-8 py-3 uppercase tracking-wider text-sm font-semibold hover:bg-gold-light transition-colors"
            >
              Explore Fleet
            </Link>
          </div>
        ) : (
          bookings.map((booking) => (
            <div key={booking.id} className="bg-obsidian border border-border/30 p-6 md:p-8 flex flex-col md:flex-row gap-8 justify-between items-start md:items-center hover:border-gold/30 transition-colors">
              <div className="flex-1 space-y-4">
                <div className="flex items-center gap-4">
                  <h3 className="font-serif text-2xl text-off-white">{booking.route}</h3>
                  <span className={`px-3 py-1 text-xs uppercase tracking-wider ${
                    booking.status === 'Confirmed' ? 'bg-green-500/10 text-green-400' :
                    booking.status === 'Pending' ? 'bg-yellow-500/10 text-yellow-400' :
                    'bg-white/10 text-white'
                  }`}>
                    {booking.status}
                  </span>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm font-sans">
                  <div>
                    <div className="text-muted/60 uppercase tracking-widest text-[10px] mb-1">Aircraft</div>
                    <div className="text-off-white">{booking.jet.name}</div>
                  </div>
                  <div>
                    <div className="text-muted/60 uppercase tracking-widest text-[10px] mb-1">Date</div>
                    <div className="text-off-white">{new Date(booking.startDate).toLocaleDateString()}</div>
                  </div>
                  <div>
                    <div className="text-muted/60 uppercase tracking-widest text-[10px] mb-1">Passengers</div>
                    <div className="text-off-white">{booking.passengers} pax</div>
                  </div>
                  <div>
                    <div className="text-muted/60 uppercase tracking-widest text-[10px] mb-1">Amount</div>
                    <div className="text-gold">₦{(Number(booking.totalAmount) / 100).toLocaleString()}</div>
                  </div>
                </div>
              </div>

              {booking.paymentStatus === 'Unpaid' && booking.status === 'Pending' && (
                <Link
                  href={`/services/private-jet/mock-checkout?bookingId=${booking.id}`}
                  className="bg-gold text-obsidian px-6 py-3 uppercase tracking-wider text-xs font-semibold hover:bg-gold-light transition-colors whitespace-nowrap flex items-center gap-2"
                >
                  Pay Now <ExternalLink size={14} />
                </Link>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
