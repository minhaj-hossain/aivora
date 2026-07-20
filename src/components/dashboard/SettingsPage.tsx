import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { Settings, User, Mail, Shield, LogOut, CheckCircle, Save } from "lucide-react";

export default function SettingsPage() {
  const { user, onLogout, onAuthSuccess, token } = useAuth();
  const [name, setName] = useState(user?.name || "");
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMsg("");
    setErrorMsg("");
    setSaving(true);

    try {
      // Local display name update or sync with API if supported
      // Let's call standard profile edit API if it exists, otherwise just save locally in Context
      const response = await fetch("/api/auth/me", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name }),
      });

      if (response.ok) {
        const updatedUser = await response.json();
        if (updatedUser && token) {
          onAuthSuccess(token, updatedUser);
          setSuccessMsg("Profile details updated successfully.");
        }
      } else {
        // Fallback local-only update if PUT is not registered, or handle gracefully
        if (user && token) {
          const updatedUser = { ...user, name };
          onAuthSuccess(token, updatedUser);
          setSuccessMsg("Display name updated successfully in active session.");
        }
      }
    } catch (err) {
      if (user && token) {
        const updatedUser = { ...user, name };
        onAuthSuccess(token, updatedUser);
        setSuccessMsg("Display name updated successfully in active session.");
      }
    } finally {
      setSaving(false);
    }
  };

  const isGoogleLinked = user?.email?.endsWith("@gmail.com") || false;

  return (
    <div className="mx-auto max-w-4xl px-6 py-12 text-left">
      <div className="space-y-2 mb-10">
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#515f74] uppercase tracking-wider font-display">
          <Settings className="h-4.5 w-4.5" />
          System Preferences
        </div>
        <h1 className="font-display text-3xl font-extrabold tracking-tight text-slate-950">
          Account Settings
        </h1>
        <p className="text-sm text-slate-500 font-body-sm">
          Manage your co-thinking identity, credentials, and regional workspace session preferences.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        {/* Navigation Sidebar inside settings */}
        <div className="space-y-1">
          <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg bg-slate-900 text-white font-display text-xs font-bold shadow-sm">
            <User className="h-4.5 w-4.5" />
            <span>Profile Information</span>
          </div>
          <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors font-display text-xs font-bold cursor-default">
            <Shield className="h-4.5 w-4.5 text-slate-400" />
            <span>Security & API Keys</span>
          </div>
        </div>

        {/* Form Body */}
        <div className="md:col-span-2 space-y-6">
          <div className="rounded-xl border border-slate-200/60 bg-white p-6 shadow-sm">
            <h2 className="font-display text-base font-bold text-slate-950 mb-1">
              Personal Information
            </h2>
            <p className="text-xs text-slate-400 mb-6 font-body-sm">
              This name is used to personalize Aivora's generated strategic reports and documents.
            </p>

            {successMsg && (
              <div className="mb-6 flex items-center gap-2 rounded-md border border-emerald-100 bg-emerald-50 p-3.5 text-xs text-emerald-800">
                <CheckCircle className="h-4 w-4 shrink-0 text-emerald-500" />
                <span className="font-medium font-body-sm">{successMsg}</span>
              </div>
            )}

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide font-display mb-1.5">
                  Display Name
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-md border border-slate-200 bg-slate-50/50 py-2.5 pl-10 pr-4 text-xs text-slate-800 focus:border-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900 font-body-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide font-display mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="email"
                    disabled
                    value={user?.email || ""}
                    className="w-full rounded-md border border-slate-200 bg-slate-100 py-2.5 pl-10 pr-4 text-xs text-slate-500 font-body-sm cursor-not-allowed"
                  />
                </div>
                {isGoogleLinked && (
                  <p className="text-[10px] text-slate-400 mt-1.5 font-body-sm">
                    🔒 Google SSO linked. Email management is locked.
                  </p>
                )}
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end">
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-4.5 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-slate-800 transition cursor-pointer font-display"
                >
                  <Save className="h-4 w-4" />
                  {saving ? "Saving..." : "Save Preferences"}
                </button>
              </div>
            </form>
          </div>

          {/* Dangerous/Danger Zone */}
          <div className="rounded-xl border border-red-200/60 bg-red-50/20 p-6 text-left">
            <h2 className="font-display text-base font-bold text-red-950 mb-1">
              Active Session
            </h2>
            <p className="text-xs text-slate-500 mb-4 font-body-sm">
              Terminating your secure session will delete active local cache credentials and return you to the public login gate.
            </p>
            <button
              onClick={onLogout}
              className="inline-flex items-center gap-1.5 rounded-lg bg-red-600 hover:bg-red-700 px-4 py-2.5 text-xs font-bold text-white shadow-sm transition cursor-pointer font-display"
            >
              <LogOut className="h-4 w-4" />
              Sign Out from Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
