import { useState, useRef, useEffect } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { useAuthStore, useTaskStore } from "../store";
import {
  LayoutDashboard,
  Kanban,
  Calendar,
  Users,
  Settings,
  HelpCircle,
  LogOut,
  Search,
  Bell,
  Plus,
} from "lucide-react";

export default function AppLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [search, setSearch] = useState("");
  const [showUserMenu, setShowUserMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node))
        setShowUserMenu(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const navItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
    { icon: Kanban, label: "My Tasks", path: "/tasks" },
    { icon: Calendar, label: "Calendar", path: "/calendar" },
    { icon: Users, label: "Team", path: "/team" },
    { icon: Settings, label: "Settings", path: "/settings" },
  ];

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  const handleCreateTask = () => navigate("/tasks?new=1");

  // Page title for breadcrumb
  const pageLabel =
    navItems.find((n) => n.path === location.pathname)?.label || "";

  return (
    <div className="flex min-h-screen bg-[#131313] text-[#e5e2e1]">
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-[#131313] border-r border-[#262626]/20 py-8 px-4 sticky top-0 h-screen">
        <div className="mb-10 px-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#adc6ff] to-[#ddb7ff] flex items-center justify-center">
              <span className="text-[#002e6a] text-sm font-black tracking-widest">
                TF
              </span>
            </div>
            <div>
              <h1 className="text-[#e5e2e1] font-bold tracking-tight text-lg">
                TaskFlow
              </h1>
              <p className="text-[10px] text-[#e5e2e1]/40 uppercase tracking-[0.2em]">
                The Digital Architect
              </p>
            </div>
          </div>
        </div>

        {/* Workspace badge */}
        <div className="mx-2 mb-6 px-3 py-2 rounded-lg bg-[#1c1b1b] border border-[#424754]/10">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded bg-gradient-to-br from-[#adc6ff]/30 to-[#ddb7ff]/30 flex items-center justify-center text-[9px] font-black text-[#adc6ff]">
              W
            </div>
            <div>
              <p className="text-xs font-bold text-[#e5e2e1]">Workspace</p>
              <p className="text-[9px] text-[#adc6ff] uppercase tracking-wider">
                Personal workspace
              </p>
            </div>
          </div>
        </div>

        <nav className="flex-1 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 transition-all font-['Inter'] text-sm tracking-wide uppercase ${
                  isActive
                    ? "bg-gradient-to-r from-[#adc6ff]/10 to-[#ddb7ff]/10 text-[#adc6ff] border-r-2 border-[#adc6ff]"
                    : "text-[#e5e2e1]/50 hover:text-[#e5e2e1] hover:bg-[#201f1f]"
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto space-y-4">
          <button
            type="button"
            onClick={handleCreateTask}
            className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-[#adc6ff] to-[#ddb7ff] text-[#002e6a] rounded-lg text-sm font-bold hover:opacity-90 transition-opacity"
          >
            <Plus className="w-4 h-4" /> New Task
          </button>

          <div className="space-y-1">
            <Link
              to="/settings"
              className="flex items-center gap-3 px-4 py-2 text-[#e5e2e1]/40 hover:text-[#adc6ff] transition-colors font-['Inter'] text-xs font-light tracking-widest uppercase w-full"
            >
              <HelpCircle className="w-4 h-4" />
              <span>Help Center</span>
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-2 text-[#e5e2e1]/40 hover:text-[#adc6ff] transition-colors font-['Inter'] text-xs font-light tracking-widest uppercase w-full"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="bg-[#201f1f]/70 backdrop-blur-xl flex justify-between items-center px-6 h-14 w-full sticky top-0 z-50 border-b border-[#262626]/20">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-[#c2c6d6]">
            <span className="text-[#e5e2e1] font-bold">TaskFlow</span>
            {pageLabel && (
              <>
                <span className="text-[#424754]">/</span>
                <span>{pageLabel}</span>
              </>
            )}
          </div>

          {/* Search */}
          <form
            role="search"
            onSubmit={(e) => {
              e.preventDefault();
              navigate(`/tasks?q=${encodeURIComponent(search)}`);
            }}
            className="hidden lg:block relative w-64"
          >
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#c2c6d6] w-4 h-4" />
            <input
              className="w-full bg-[#0e0e0e] border-none rounded-md py-1.5 pl-9 pr-4 text-sm text-[#e5e2e1] placeholder-[#c2c6d6] focus:ring-1 focus:ring-[#adc6ff] outline-none"
              aria-label="Search all tasks"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search tasks..."
              type="text"
            />
          </form>

          {/* Right actions */}
          <div className="flex items-center gap-4">
            {/* User avatar + dropdown */}
            <div className="relative" ref={menuRef}>
              <button
                type="button"
                aria-label="Account menu"
                aria-expanded={showUserMenu}
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="w-8 h-8 rounded-full bg-[#2a2a2a] border border-[#424754]/20 flex items-center justify-center hover:border-[#adc6ff]/40 transition-colors"
              >
                <span className="text-[#adc6ff] font-bold text-sm">
                  {user?.name?.charAt(0).toUpperCase() || "U"}
                </span>
              </button>

              {showUserMenu && (
                <div className="absolute right-0 top-10 w-56 bg-[#1c1b1b] border border-[#424754]/20 rounded-xl shadow-2xl z-50 overflow-hidden">
                  <div className="px-4 py-3 border-b border-[#424754]/10">
                    <p className="text-sm font-bold text-[#e5e2e1]">
                      {user?.name}
                    </p>
                    <p className="text-xs text-[#c2c6d6]">{user?.email}</p>
                  </div>
                  <div className="py-1">
                    {[
                      { label: "View Profile", path: "/settings" },
                      { label: "Account Settings", path: "/settings" },
                    ].map(({ label, path }) => (
                      <Link
                        key={label}
                        to={path}
                        onClick={() => setShowUserMenu(false)}
                        className="flex items-center justify-between px-4 py-2.5 text-sm text-[#c2c6d6] hover:text-[#e5e2e1] hover:bg-[#2a2a2a] transition-colors"
                      >
                        {label}
                      </Link>
                    ))}
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-[#ffb4ab] hover:bg-[#2a2a2a] transition-colors"
                    >
                      <LogOut className="w-4 h-4" /> Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        <nav
          aria-label="Mobile navigation"
          className="md:hidden flex flex-wrap gap-2 p-3 border-b border-[#424754]"
        >
          {navItems.map((n) => (
            <Link
              key={n.path}
              to={n.path}
              aria-current={location.pathname === n.path ? "page" : undefined}
              className="p-3 text-sm text-[#adc6ff]"
            >
              {n.label}
            </Link>
          ))}
        </nav>
        <main className="flex-1 p-6 md:p-10 max-w-[1400px] mx-auto w-full">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
