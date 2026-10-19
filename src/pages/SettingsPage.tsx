import { useState } from "react";
import { useAuthStore } from "../store";
import {
  User,
  Settings,
  Bell,
  Palette,
  Shield,
  ChevronRight,
} from "lucide-react";

type Tab = "profile" | "account" | "notifications" | "appearance";

const TABS: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: "profile", label: "Profile", icon: User },
  { id: "account", label: "Account", icon: Settings },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "appearance", label: "Appearance", icon: Palette },
];

const ACCENT_COLORS = [
  "#adc6ff",
  "#ddb7ff",
  "#4ade80",
  "#ffb4ab",
  "#fde68a",
  "#67e8f9",
];

export default function SettingsPage() {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState<Tab>("profile");
  const [displayName, setDisplayName] = useState(user?.name || "");
  const [email] = useState(user?.email || "");
  const [bio, setBio] = useState(
    "Product Designer & Tech Enthusiast based in San Francisco. Focusing on building seamless task management systems for high-performance teams.",
  );
  const [notifPush, setNotifPush] = useState(true);
  const [notifEmail, setNotifEmail] = useState(false);
  const [notifDeadlines, setNotifDeadlines] = useState(true);
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [accentColor, setAccentColor] = useState("#adc6ff");
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const Toggle = ({
    value,
    onChange,
  }: {
    value: boolean;
    onChange: () => void;
  }) => (
    <button
      type="button"
      disabled
      onClick={onChange}
      className={`relative w-11 h-6 rounded-full transition-colors ${value ? "bg-[#adc6ff]" : "bg-[#353534]"}`}
    >
      <span
        className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${value ? "translate-x-6" : "translate-x-1"}`}
      />
    </button>
  );

  return (
    <div className="space-y-8">
      <p className="task-card mb-6">
        Design preview: account editing, notifications, security, and billing
        are not connected. No changes are saved.
      </p>
      <div>
        <h2 className="text-4xl font-black tracking-tight text-[#e5e2e1] mb-1">
          Settings
        </h2>
        <p className="text-[#c2c6d6]">
          Manage your workspace preferences and personal identity.
        </p>
      </div>

      <div className="flex gap-8">
        {/* Sidebar */}
        <aside className="w-52 flex-shrink-0">
          <nav className="space-y-1">
            {TABS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                type="button"
                onClick={() => setActiveTab(id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                  activeTab === id
                    ? "bg-[#adc6ff]/10 text-[#adc6ff] border-l-2 border-[#adc6ff]"
                    : "text-[#c2c6d6] hover:text-[#e5e2e1] hover:bg-[#1c1b1b]"
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </nav>
        </aside>

        {/* Content */}
        <div className="flex-1 max-w-2xl">
          {activeTab === "profile" && (
            <div className="bg-[#201f1f] rounded-xl border border-[#424754]/10 p-8">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-lg font-bold text-[#e5e2e1]">
                    Profile Information
                  </h3>
                  <p className="text-xs text-[#c2c6d6]">
                    Update your photo and personal details.
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    disabled
                    className="px-4 py-2 text-sm text-[#c2c6d6] hover:text-[#e5e2e1] transition-colors"
                  >
                    Discard
                  </button>
                  <button
                    type="button"
                    disabled
                    onClick={handleSave}
                    className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#adc6ff] to-[#ddb7ff] text-[#002e6a] text-sm font-bold hover:opacity-90 transition-opacity"
                  >
                    {saved ? "Saved!" : "Save Changes"}
                  </button>
                </div>
              </div>

              {/* Avatar */}
              <div className="flex items-center gap-5 mb-6 pb-6 border-b border-[#424754]/10">
                <div className="relative">
                  <div className="w-20 h-20 rounded-full bg-[#2a2a2a] border border-[#424754]/20 flex items-center justify-center">
                    <span className="text-2xl font-black text-[#adc6ff]">
                      {user?.name?.charAt(0).toUpperCase() || "U"}
                    </span>
                  </div>
                  <button
                    type="button"
                    disabled
                    className="absolute bottom-0 right-0 w-6 h-6 bg-[#adc6ff] rounded-full flex items-center justify-center"
                  >
                    <svg
                      className="w-3 h-3 text-[#002e6a]"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                      />
                    </svg>
                  </button>
                </div>
                <div>
                  <p className="text-sm font-bold text-[#e5e2e1] mb-1">
                    Profile Picture
                  </p>
                  <p className="text-xs text-[#c2c6d6] mb-2">
                    PNG or JPG. Max 10MB.
                    <br />
                    Recommended 400×400px.
                  </p>
                  <div className="flex gap-3 text-xs">
                    <button
                      type="button"
                      disabled
                      className="text-[#adc6ff] hover:underline"
                    >
                      Upload new
                    </button>
                    <span className="text-[#424754]">•</span>
                    <button
                      type="button"
                      disabled
                      className="text-[#ffb4ab] hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-[#c2c6d6] mb-2">
                      Display Name
                    </label>
                    <input
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      className="w-full bg-[#1c1b1b] border border-[#424754]/20 rounded-lg px-4 py-3 text-[#e5e2e1] text-sm focus:outline-none focus:border-[#adc6ff]/50"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-[#c2c6d6] mb-2">
                      Email Address
                    </label>
                    <input
                      value={email}
                      readOnly
                      className="w-full bg-[#1c1b1b] border border-[#424754]/20 rounded-lg px-4 py-3 text-[#c2c6d6] text-sm opacity-60 cursor-not-allowed"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-[#c2c6d6] mb-2">
                    Short Bio
                  </label>
                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    rows={3}
                    className="w-full bg-[#1c1b1b] border border-[#424754]/20 rounded-lg px-4 py-3 text-[#e5e2e1] text-sm focus:outline-none focus:border-[#adc6ff]/50 resize-none"
                  />
                </div>
              </div>

              {/* Appearance preview */}
              <div className="mt-8 pt-6 border-t border-[#424754]/10">
                <h4 className="text-base font-bold text-[#e5e2e1] mb-1">
                  Appearance
                </h4>
                <p className="text-xs text-[#c2c6d6] mb-4">
                  Customize the visual rhythm of your workspace.
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-[#c2c6d6] mb-2">
                      Theme Mode
                    </label>
                    <div className="flex gap-2">
                      {(["dark", "light"] as const).map((t) => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => setTheme(t)}
                          className={`flex-1 py-2 rounded-lg text-xs font-bold uppercase border transition-colors ${theme === t ? "bg-[#adc6ff]/10 text-[#adc6ff] border-[#adc6ff]/40" : "bg-[#1c1b1b] text-[#c2c6d6] border-[#424754]/20"}`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-[#c2c6d6] mb-2">
                      Accent Color
                    </label>
                    <div className="flex gap-2">
                      {ACCENT_COLORS.map((c) => (
                        <button
                          key={c}
                          type="button"
                          onClick={() => setAccentColor(c)}
                          className={`w-6 h-6 rounded-full border-2 transition-all ${accentColor === c ? "border-white scale-110" : "border-transparent"}`}
                          style={{ backgroundColor: c }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "notifications" && (
            <div className="bg-[#201f1f] rounded-xl border border-[#424754]/10 p-8">
              <h3 className="text-lg font-bold text-[#e5e2e1] mb-1">
                Notifications
              </h3>
              <p className="text-xs text-[#c2c6d6] mb-6">
                Control how and when you get notified.
              </p>
              <div className="space-y-4">
                {[
                  {
                    label: "Push notifications",
                    sub: "Get notified about task updates in real time",
                    value: notifPush,
                    set: setNotifPush,
                  },
                  {
                    label: "Email updates",
                    sub: "Receive weekly digest and summary emails",
                    value: notifEmail,
                    set: setNotifEmail,
                  },
                  {
                    label: "Deadline reminders",
                    sub: "Get alerted 24h before task deadlines",
                    value: notifDeadlines,
                    set: setNotifDeadlines,
                  },
                ].map(({ label, sub, value, set }) => (
                  <div
                    key={label}
                    className="flex items-center justify-between py-4 border-b border-[#424754]/10 last:border-0"
                  >
                    <div>
                      <p className="text-sm font-medium text-[#e5e2e1]">
                        {label}
                      </p>
                      <p className="text-xs text-[#c2c6d6]">{sub}</p>
                    </div>
                    <Toggle value={value} onChange={() => set(!value)} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {(activeTab === "account" || activeTab === "appearance") && (
            <div className="bg-[#201f1f] rounded-xl border border-[#424754]/10 p-8 flex flex-col items-center justify-center min-h-[300px] gap-3">
              <div className="w-12 h-12 rounded-full bg-[#adc6ff]/10 flex items-center justify-center">
                {activeTab === "account" ? (
                  <Shield className="w-6 h-6 text-[#adc6ff]" />
                ) : (
                  <Palette className="w-6 h-6 text-[#adc6ff]" />
                )}
              </div>
              <p className="text-[#e5e2e1] font-bold">
                {activeTab === "account" ? "Account Security" : "Appearance"}
              </p>
              <p className="text-xs text-[#c2c6d6]">
                Coming soon — full settings panel in the next release.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
