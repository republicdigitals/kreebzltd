"use client";

import { useState, useEffect, useCallback } from "react";
import { Save, User, Building2, Bell, Shield, Loader2, Check } from "lucide-react";

type AgencySettings = {
  id: string;
  agencyName: string;
  agencyEmail: string;
  agencyPhone: string;
  agencyAddress: string;
  principalName: string;
  principalTitle: string;
  notifyNewLeads: boolean;
  notifyEmail: string;
  updatedAt: string;
};

const INPUT_CLASS =
  "w-full bg-obsidian border border-border rounded-none px-4 py-2 text-off-white focus:outline-none focus:border-gold transition-colors";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("agency");
  const [settings, setSettings] = useState<AgencySettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  // Local form state mirrors the settings record
  const [form, setForm] = useState<Omit<AgencySettings, "id" | "updatedAt">>({
    agencyName: "",
    agencyEmail: "",
    agencyPhone: "",
    agencyAddress: "",
    principalName: "",
    principalTitle: "",
    notifyNewLeads: true,
    notifyEmail: "",
  });

  const loadSettings = useCallback(async () => {
    try {
      const res = await fetch("/api/settings", { credentials: "same-origin" });
      if (!res.ok) throw new Error(`${res.status}`);
      const data: AgencySettings = await res.json();
      return data;
    } catch (err) {
      throw err;
    }
  }, []);

  useEffect(() => {
    loadSettings()
      .then(data => {
        setSettings(data);
        setForm({
          agencyName: data.agencyName,
          agencyEmail: data.agencyEmail,
          agencyPhone: data.agencyPhone,
          agencyAddress: data.agencyAddress,
          principalName: data.principalName,
          principalTitle: data.principalTitle,
          notifyNewLeads: data.notifyNewLeads,
          notifyEmail: data.notifyEmail,
        });
        setLoading(false);
      })
      .catch(err => {
        setError(`Failed to load settings. ${err}`);
        setLoading(false);
      });
  }, [loadSettings]);

  const handleSave = async () => {
    setSaveState("saving");
    setError(null);
    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error(`${res.status}`);
      const data = await res.json();
      setSettings(data);
      setSaveState("saved");
      setTimeout(() => setSaveState("idle"), 2500);
    } catch (err) {
      setError(`Save failed. ${err}`);
      setSaveState("error");
      setTimeout(() => setSaveState("idle"), 3000);
    }
  };

  const set = (key: keyof typeof form, value: string | boolean) =>
    setForm((f) => ({ ...f, [key]: value }));

  const tabs = [
    { id: "agency",        label: "Agency Details",  Icon: Building2 },
    { id: "notifications", label: "Notifications",   Icon: Bell },
    { id: "principal",     label: "Principal Info",  Icon: User },
    { id: "security",      label: "Security",        Icon: Shield },
  ];

  return (
    <div className="p-4 md:p-8 max-w-4xl space-y-6 mx-auto">
      <div>
        <h1 className="font-accent text-3xl font-medium text-off-white tracking-tight">Settings</h1>
        <p className="text-muted mt-1">Manage your account and platform preferences</p>
      </div>

      {error && (
        <div className="px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
          {error}
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-6 md:gap-8">
        <aside className="w-full md:w-64 flex-shrink-0">
          <nav className="flex flex-row md:flex-col overflow-x-auto md:overflow-x-visible space-x-2 md:space-x-0 md:space-y-1 pb-2 md:pb-0 scrollbar-hide">
            {tabs.map(({ id, label, Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex-shrink-0 flex items-center gap-2 md:gap-3 px-4 py-2 md:py-3 rounded-none text-sm font-medium transition-colors ${
                  activeTab === id
                    ? "bg-gold/10 text-gold"
                    : "text-muted hover:text-off-white hover:bg-obsidian-light"
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </nav>
        </aside>

        <div className="flex-1 bg-obsidian-light border border-border rounded-none p-4 md:p-8 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-16 text-neutral-500">
              <Loader2 className="w-6 h-6 animate-spin" />
            </div>
          ) : (
            <>
              {/* Agency Details */}
              {activeTab === "agency" && (
                <div className="space-y-6">
                  <div>
                    <h2 className="font-accent text-xl font-medium text-off-white">Agency Details</h2>
                    <p className="text-sm text-muted mt-1">Public-facing company information.</p>
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-off-white">Company Name</label>
                      <input
                        type="text"
                        value={form.agencyName}
                        onChange={(e) => set("agencyName", e.target.value)}
                        className={INPUT_CLASS}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-off-white">Support Email</label>
                      <input
                        type="email"
                        value={form.agencyEmail}
                        onChange={(e) => set("agencyEmail", e.target.value)}
                        className={INPUT_CLASS}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-off-white">Phone</label>
                      <input
                        type="tel"
                        value={form.agencyPhone}
                        onChange={(e) => set("agencyPhone", e.target.value)}
                        placeholder="+234 806 994 9948"
                        className={INPUT_CLASS}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-off-white">Office Address</label>
                      <input
                        type="text"
                        value={form.agencyAddress}
                        onChange={(e) => set("agencyAddress", e.target.value)}
                        placeholder="Lagos, Nigeria"
                        className={INPUT_CLASS}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Principal Info */}
              {activeTab === "principal" && (
                <div className="space-y-6">
                  <div>
                    <h2 className="font-accent text-xl font-medium text-off-white">Principal Information</h2>
                    <p className="text-sm text-muted mt-1">Displayed on property listings and the contact page.</p>
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-off-white">Principal Name</label>
                      <input
                        type="text"
                        value={form.principalName}
                        onChange={(e) => set("principalName", e.target.value)}
                        placeholder="Full Name"
                        className={INPUT_CLASS}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-off-white">Title / Role</label>
                      <input
                        type="text"
                        value={form.principalTitle}
                        onChange={(e) => set("principalTitle", e.target.value)}
                        placeholder="e.g. Key Principal"
                        className={INPUT_CLASS}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Notifications */}
              {activeTab === "notifications" && (
                <div className="space-y-6">
                  <div>
                    <h2 className="font-accent text-xl font-medium text-off-white">Notifications</h2>
                    <p className="text-sm text-muted mt-1">Configure how you receive lead alerts.</p>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between py-4 border-b border-border">
                      <div>
                        <p className="text-sm font-medium text-off-white">New Lead Alerts</p>
                        <p className="text-xs text-muted mt-0.5">
                          Receive an email when a new inquiry is submitted
                        </p>
                      </div>
                      <button
                        onClick={() => set("notifyNewLeads", !form.notifyNewLeads)}
                        className={`w-11 h-6 rounded-full transition-colors relative ${
                          form.notifyNewLeads ? "bg-gold" : "bg-obsidian"
                        }`}
                        role="switch"
                        aria-checked={form.notifyNewLeads}
                        aria-label="Toggle new lead notifications"
                      >
                        <span
                          className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${
                            form.notifyNewLeads ? "translate-x-5" : "translate-x-0.5"
                          }`}
                        />
                      </button>
                    </div>
                    {form.notifyNewLeads && (
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-off-white">Notification Email</label>
                        <input
                          type="email"
                          value={form.notifyEmail}
                          onChange={(e) => set("notifyEmail", e.target.value)}
                          placeholder="alerts@example.com"
                          className={INPUT_CLASS}
                        />
                        <p className="text-xs text-muted">
                          Leave blank to use the agency support email.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Security */}
              {activeTab === "security" && (
                <div className="py-12 flex flex-col items-center justify-center text-center">
                  <div className="w-12 h-12 bg-obsidian rounded-full flex items-center justify-center mb-4">
                    <Shield className="w-6 h-6 text-muted" />
                  </div>
                  <h3 className="font-accent text-lg font-medium text-off-white mb-2">Security Settings</h3>
                  <p className="text-sm text-muted max-w-sm">
                    Admin access is controlled via the <code className="text-muted bg-obsidian px-1 py-0.5 rounded text-xs">ADMIN_API_KEY</code> environment variable.
                    Update it in your hosting environment to rotate credentials.
                  </p>
                </div>
              )}

              {/* Save Button */}
              {activeTab !== "security" && (
                <div className="mt-8 pt-6 border-t border-border flex justify-between items-center">
                  {settings?.updatedAt && (
                    <p className="text-xs text-muted">
                      Last saved:{" "}
                      {new Date(settings.updatedAt).toLocaleString("en-GB", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  )}
                  <button
                    onClick={handleSave}
                    disabled={saveState === "saving"}
                    className="ml-auto bg-gold text-obsidian px-6 py-2 rounded-none font-medium uppercase tracking-wider text-xs hover:bg-gold-hover transition-colors flex items-center gap-2 disabled:opacity-60"
                  >
                    {saveState === "saving" ? (
                      <><Loader2 className="w-4 h-4 animate-spin" /> Saving…</>
                    ) : saveState === "saved" ? (
                      <><Check className="w-4 h-4 text-obsidian" /> Saved</>
                    ) : (
                      <><Save className="w-4 h-4" /> Save Changes</>
                    )}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
