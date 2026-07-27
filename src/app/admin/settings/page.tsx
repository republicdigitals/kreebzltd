"use client";

import { useState } from "react";
import { Save, User, Building2, Bell, Shield } from "lucide-react";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");

  return (
    <div className="p-8 max-w-4xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight">Settings</h1>
        <p className="text-neutral-400 mt-1">Manage your account and platform preferences</p>
      </div>

      <div className="flex gap-8">
        <aside className="w-64 flex-shrink-0">
          <nav className="space-y-1">
            <button 
              onClick={() => setActiveTab("profile")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === "profile" ? "bg-white text-black" : "text-neutral-400 hover:text-white hover:bg-neutral-900"}`}
            >
              <User className="w-4 h-4" />
              My Profile
            </button>
            <button 
              onClick={() => setActiveTab("agency")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === "agency" ? "bg-white text-black" : "text-neutral-400 hover:text-white hover:bg-neutral-900"}`}
            >
              <Building2 className="w-4 h-4" />
              Agency Details
            </button>
            <button 
              onClick={() => setActiveTab("notifications")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === "notifications" ? "bg-white text-black" : "text-neutral-400 hover:text-white hover:bg-neutral-900"}`}
            >
              <Bell className="w-4 h-4" />
              Notifications
            </button>
            <button 
              onClick={() => setActiveTab("security")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === "security" ? "bg-white text-black" : "text-neutral-400 hover:text-white hover:bg-neutral-900"}`}
            >
              <Shield className="w-4 h-4" />
              Security
            </button>
          </nav>
        </aside>

        <div className="flex-1 bg-neutral-900 border border-neutral-800 rounded-xl p-8">
          {activeTab === "profile" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-white">Profile Information</h2>
                <p className="text-sm text-neutral-400 mt-1">Update your personal details.</p>
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-neutral-300">First Name</label>
                    <input type="text" defaultValue="Admin" className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-2 text-white" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-neutral-300">Last Name</label>
                    <input type="text" defaultValue="User" className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-2 text-white" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-neutral-300">Email Address</label>
                  <input type="email" defaultValue="admin@kreebz.com" className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-2 text-white" />
                </div>
              </div>
            </div>
          )}

          {activeTab === "agency" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-white">Agency Details</h2>
                <p className="text-sm text-neutral-400 mt-1">Manage public facing company info.</p>
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-neutral-300">Company Name</label>
                  <input type="text" defaultValue="Kreebz Ltd" className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-2 text-white" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-neutral-300">Support Email</label>
                  <input type="email" defaultValue="hello@kreebz.com" className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-2 text-white" />
                </div>
              </div>
            </div>
          )}

          {(activeTab === "notifications" || activeTab === "security") && (
            <div className="py-12 flex flex-col items-center justify-center text-center">
              <div className="w-12 h-12 bg-neutral-800 rounded-full flex items-center justify-center mb-4">
                {activeTab === "notifications" ? <Bell className="w-6 h-6 text-neutral-400" /> : <Shield className="w-6 h-6 text-neutral-400" />}
              </div>
              <h3 className="text-lg font-medium text-white mb-2">Coming Soon</h3>
              <p className="text-sm text-neutral-400 max-w-sm">
                This feature is currently under development. Check back later for updates!
              </p>
            </div>
          )}

          {(activeTab === "profile" || activeTab === "agency") && (
            <div className="mt-8 pt-6 border-t border-neutral-800 flex justify-end">
              <button className="bg-white text-black px-6 py-2 rounded-lg font-medium hover:bg-neutral-200 transition-colors flex items-center gap-2">
                <Save className="w-4 h-4" />
                Save Changes
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
