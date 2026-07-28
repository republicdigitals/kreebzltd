import { Search, Mail, Phone, Calendar, MoreHorizontal, User } from "lucide-react";

const DUMMY_LEADS = [
  { id: "L-1029", name: "Sarah Jenkins", email: "sarah.j@example.com", phone: "+234 800 000 0001", property: "ikoyi-villa-1", date: "2026-07-27", status: "New" },
  { id: "L-1028", name: "Michael Okoye", email: "m.okoye@example.com", phone: "+234 800 000 0002", property: "banana-house-ibj", date: "2026-07-26", status: "Contacted" },
  { id: "L-1027", name: "David Chen", email: "d.chen@example.org", phone: "+44 7000 000000", property: "banana-villa-d10a", date: "2026-07-25", status: "Qualified" },
  { id: "L-1026", name: "Amira Hassan", email: "a.hassan@example.com", phone: "+971 50 000 0000", property: "townhouse-ibj", date: "2026-07-22", status: "Lost" },
];

export default function LeadsPage() {
  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Leads</h1>
          <p className="text-neutral-400 mt-1">Manage incoming inquiries and prospects</p>
        </div>
      </div>

      <div className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden flex flex-col">
        <div className="p-4 border-b border-neutral-800 flex justify-between items-center">
          <div className="relative w-64">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
            <input 
              type="text" 
              placeholder="Search leads..." 
              className="w-full bg-neutral-950 border border-neutral-800 rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-neutral-600 transition-colors"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-neutral-400">
            <thead className="bg-neutral-950/50 border-b border-neutral-800 text-xs uppercase text-neutral-500 font-semibold">
              <tr>
                <th className="px-6 py-4">Lead</th>
                <th className="px-6 py-4">Contact</th>
                <th className="px-6 py-4">Property Interest</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800">
              {DUMMY_LEADS.map((lead) => (
                <tr key={lead.id} className="hover:bg-neutral-800/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-white flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-neutral-800 flex items-center justify-center text-neutral-400">
                      <User className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-semibold">{lead.name}</div>
                      <div className="text-xs text-neutral-500">{lead.id}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1 text-xs">
                      <div className="flex items-center gap-2"><Mail className="w-3 h-3 text-neutral-500" /> {lead.email}</div>
                      <div className="flex items-center gap-2"><Phone className="w-3 h-3 text-neutral-500" /> {lead.phone}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-neutral-300 font-medium">{lead.property}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3 h-3 text-neutral-500" />
                      {lead.date}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      lead.status === 'New' ? 'bg-blue-500/10 text-blue-400' :
                      lead.status === 'Contacted' ? 'bg-yellow-500/10 text-yellow-400' :
                      lead.status === 'Qualified' ? 'bg-emerald-500/10 text-emerald-400' :
                      'bg-red-500/10 text-red-400'
                    }`}>
                      {lead.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
