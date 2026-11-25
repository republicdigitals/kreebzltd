"use client";

import { useState, useEffect } from "react";
import { X, Mail, Phone, Calendar, Trash2, Loader2, Check } from "lucide-react";

export type LeadDetail = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  interest: string;
  message: string | null;
  propertyId: string | null;
  status: string;
  createdAt: string;
  project: string | null;
  nextStep: string | null;
  timeframe: string | null;
  preferredContact: string | null;
  utmSource: string | null;
  utmMedium: string | null;
  utmCampaign: string | null;
  referrer: string | null;
  landingPage: string | null;
  assignedTo: string | null;
  firstResponseAt: string | null;
  notes?: string | null;
};

const STATUS_OPTIONS = [
  "New",
  "Contacted",
  "Qualified",
  "Consultation booked",
  "Viewing booked",
  "Nurture",
  "Closed",
  "Not suitable",
  "Lost",
] as const;

function Row({ label, value }: { label: string; value?: string | null }) {
  if (!value) return null;
  return (
    <div className="flex justify-between gap-4 py-2 border-b border-border/30 last:border-0">
      <span className="text-xs uppercase tracking-[0.15em] text-muted shrink-0">{label}</span>
      <span className="text-sm text-off-white text-right capitalize">{value.replace(/-/g, " ")}</span>
    </div>
  );
}

export default function LeadDetailSheet({
  lead,
  onClose,
  onUpdated,
  onDelete,
}: {
  lead: LeadDetail;
  onClose: () => void;
  onUpdated: (updated: LeadDetail) => void;
  onDelete: (id: string) => void;
}) {
  const [notes, setNotes] = useState(lead.notes ?? "");
  const [savingNotes, setSavingNotes] = useState(false);
  const [notesSaved, setNotesSaved] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const saveNotes = async () => {
    setSavingNotes(true);
    setError(null);
    try {
      const res = await fetch(`/api/leads/${lead.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({ notes }),
      });
      if (!res.ok) throw new Error();
      onUpdated({ ...lead, notes });
      setNotesSaved(true);
      setTimeout(() => setNotesSaved(false), 2000);
    } catch {
      setError("Failed to save notes.");
    } finally {
      setSavingNotes(false);
    }
  };

  const changeStatus = async (status: string) => {
    setUpdatingStatus(true);
    setError(null);
    try {
      const res = await fetch(`/api/leads/${lead.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error();
      onUpdated({ ...lead, status });
    } catch {
      setError("Failed to update status.");
    } finally {
      setUpdatingStatus(false);
    }
  };

  const source = [lead.utmSource, lead.utmMedium, lead.utmCampaign].filter(Boolean).join(" / ");

  return (
    <div className="fixed inset-0 z-50 flex justify-end" role="dialog" aria-modal="true">
      <button
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm cursor-default"
      />
      <div className="relative w-full max-w-md h-full bg-obsidian-light border-l border-border overflow-y-auto">
        <div className="sticky top-0 bg-obsidian-light border-b border-border px-6 py-4 flex items-center justify-between z-10">
          <div>
            <h2 className="font-accent text-xl text-off-white">{lead.name}</h2>
            <p className="text-[10px] text-muted font-mono mt-0.5">{lead.id}</p>
          </div>
          <button onClick={onClose} className="p-2 text-muted hover:text-off-white transition-colors" aria-label="Close panel">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-6 py-5 space-y-6">
          {error && (
            <div className="px-3 py-2 bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{error}</div>
          )}

          {/* Contact */}
          <div className="space-y-2">
            <a href={`mailto:${lead.email}`} className="flex items-center gap-2 text-sm text-muted hover:text-off-white transition-colors">
              <Mail className="w-4 h-4 shrink-0" /> {lead.email}
            </a>
            {lead.phone && (
              <a href={`tel:${lead.phone}`} className="flex items-center gap-2 text-sm text-muted hover:text-off-white transition-colors">
                <Phone className="w-4 h-4 shrink-0" /> {lead.phone}
              </a>
            )}
            <p className="flex items-center gap-2 text-sm text-muted">
              <Calendar className="w-4 h-4 shrink-0" />
              {new Date(lead.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
            </p>
          </div>

          {/* Status */}
          <div>
            <label className="text-xs uppercase tracking-[0.15em] text-muted block mb-2">Pipeline status</label>
            <select
              value={lead.status}
              disabled={updatingStatus}
              onChange={(e) => changeStatus(e.target.value)}
              className="w-full bg-obsidian border border-border px-3 py-2 text-sm text-off-white focus:outline-none focus:border-gold transition-colors disabled:opacity-50"
            >
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          {/* Enquiry details */}
          <div>
            <p className="text-xs uppercase tracking-[0.15em] text-muted mb-2">Enquiry</p>
            <div className="bg-obsidian border border-border px-4 py-2">
              <Row label="Interest" value={lead.interest} />
              <Row label="Project" value={lead.project} />
              <Row label="Next step" value={lead.nextStep} />
              <Row label="Timeframe" value={lead.timeframe} />
              <Row label="Prefers" value={lead.preferredContact} />
              <Row label="Property ref" value={lead.propertyId} />
              <Row label="Source" value={source || null} />
              <Row label="Referrer" value={lead.referrer} />
              <Row label="Landing page" value={lead.landingPage} />
            </div>
          </div>

          {/* Full message */}
          {lead.message && (
            <div>
              <p className="text-xs uppercase tracking-[0.15em] text-muted mb-2">Message</p>
              <div className="bg-obsidian border border-border px-4 py-3 text-sm text-off-white/85 leading-relaxed whitespace-pre-wrap">
                {lead.message}
              </div>
            </div>
          )}

          {/* Notes */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="lead-notes" className="text-xs uppercase tracking-[0.15em] text-muted">
                Internal notes
              </label>
              {notesSaved && (
                <span className="flex items-center gap-1 text-xs text-emerald-400">
                  <Check className="w-3 h-3" /> Saved
                </span>
              )}
            </div>
            <textarea
              id="lead-notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={5}
              placeholder="Conversation history, follow-ups, context — only your team sees this."
              className="w-full bg-obsidian border border-border px-3 py-2 text-sm text-off-white focus:outline-none focus:border-gold transition-colors placeholder:text-muted/50 resize-y"
            />
            <button
              onClick={saveNotes}
              disabled={savingNotes || notes === (lead.notes ?? "")}
              className="mt-2 inline-flex items-center gap-2 px-4 py-2 text-xs uppercase tracking-[0.15em] bg-gold text-background font-medium hover:bg-gold-light transition-colors disabled:opacity-40"
            >
              {savingNotes && <Loader2 className="w-3 h-3 animate-spin" />}
              {savingNotes ? "Saving…" : "Save notes"}
            </button>
          </div>

          {/* Danger */}
          <div className="pt-4 border-t border-border/30">
            <button
              onClick={() => {
                if (confirm("Permanently delete this lead?")) {
                  onDelete(lead.id);
                  onClose();
                }
              }}
              className="flex items-center gap-2 text-sm text-muted hover:text-red-400 transition-colors"
            >
              <Trash2 className="w-4 h-4" /> Delete lead
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
