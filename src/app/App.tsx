import { useState, useEffect, useRef } from "react";
import {
  Search, Bell, Moon, Sun, Menu, X, ChevronRight, ChevronDown,
  MapPin, Clock, Tag, Upload, Filter, Grid, List, Eye, Check,
  AlertCircle, User, Settings, LogOut, Home, FileText, Package,
  BarChart2, Users, Shield, CheckCircle, XCircle, ChevronLeft,
  Plus, ArrowRight, Inbox, Star, Zap, Lock, Mail, Phone,
  Camera, Trash2, Edit3, Download, RefreshCw, TrendingUp,
  TrendingDown, Activity, Award, Calendar, MoreHorizontal,
  Send, Image as ImageIcon, Hash, Globe, Smartphone, Layers,
  AlertTriangle, Info, HelpCircle, MessageSquare, BookOpen
} from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend
} from "recharts";

// ─── Types ───────────────────────────────────────────────────────────────────
type Screen =
  | "landing" | "login" | "register" | "forgot"
  | "dashboard" | "report-lost" | "report-found" | "search"
  | "item-detail" | "claim" | "my-reports" | "claim-status"
  | "notifications" | "profile"
  | "admin-dashboard" | "admin-reports" | "admin-claims"
  | "admin-users" | "admin-analytics";

type Theme = "light" | "dark";

// ─── Status Chip ─────────────────────────────────────────────────────────────
const statusConfig: Record<string, { label: string; bg: string; text: string; dot: string }> = {
  open:     { label: "Open",     bg: "bg-blue-100 dark:bg-blue-900/40",     text: "text-blue-700 dark:text-blue-300",   dot: "bg-blue-500" },
  matched:  { label: "Matched",  bg: "bg-purple-100 dark:bg-purple-900/40", text: "text-purple-700 dark:text-purple-300", dot: "bg-purple-500" },
  claimed:  { label: "Claimed",  bg: "bg-green-100 dark:bg-green-900/40",   text: "text-green-700 dark:text-green-300",  dot: "bg-green-500" },
  closed:   { label: "Closed",   bg: "bg-slate-100 dark:bg-slate-700/40",   text: "text-slate-600 dark:text-slate-400",  dot: "bg-slate-400" },
  pending:  { label: "Pending",  bg: "bg-orange-100 dark:bg-orange-900/40", text: "text-orange-700 dark:text-orange-300", dot: "bg-orange-500" },
  rejected: { label: "Rejected", bg: "bg-red-100 dark:bg-red-900/40",       text: "text-red-700 dark:text-red-300",      dot: "bg-red-500" },
  approved: { label: "Approved", bg: "bg-green-100 dark:bg-green-900/40",   text: "text-green-700 dark:text-green-300",  dot: "bg-green-500" },
};

function StatusChip({ status }: { status: string }) {
  const c = statusConfig[status] ?? statusConfig.open;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${c.bg} ${c.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
      {c.label}
    </span>
  );
}

// ─── Button ───────────────────────────────────────────────────────────────────
function Btn({
  children, variant = "primary", size = "md", onClick, type = "button", className = "", disabled = false, fullWidth = false
}: {
  children: React.ReactNode; variant?: "primary"|"secondary"|"ghost"|"danger"|"outline";
  size?: "sm"|"md"|"lg"; onClick?: () => void; type?: "button"|"submit";
  className?: string; disabled?: boolean; fullWidth?: boolean;
}) {
  const sizes = { sm: "px-3 py-1.5 text-xs", md: "px-4 py-2 text-sm", lg: "px-6 py-3 text-base" };
  const variants = {
    primary:   "bg-primary text-primary-foreground hover:opacity-90 shadow-sm shadow-primary/20",
    secondary: "bg-secondary text-secondary-foreground hover:bg-accent",
    ghost:     "bg-transparent text-foreground hover:bg-muted",
    danger:    "bg-destructive text-destructive-foreground hover:opacity-90",
    outline:   "border border-border bg-transparent text-foreground hover:bg-muted",
  };
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-all duration-150 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed ${sizes[size]} ${variants[variant]} ${fullWidth ? "w-full" : ""} ${className}`}
    >
      {children}
    </button>
  );
}

// ─── Input ────────────────────────────────────────────────────────────────────
function Input({
  label, placeholder, type = "text", value, onChange, icon, error, hint, required
}: {
  label?: string; placeholder?: string; type?: string; value?: string;
  onChange?: (v: string) => void; icon?: React.ReactNode; error?: string; hint?: string; required?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && <label className="text-sm font-medium text-foreground">{label}{required && <span className="text-destructive ml-0.5">*</span>}</label>}
      <div className="relative">
        {icon && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">{icon}</span>}
        <input
          type={type}
          value={value}
          onChange={e => onChange?.(e.target.value)}
          placeholder={placeholder}
          className={`w-full bg-card border rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground outline-none transition-all duration-150 focus:ring-2 focus:ring-primary/30 focus:border-primary ${icon ? "pl-10" : ""} ${error ? "border-destructive" : "border-border"}`}
        />
      </div>
      {error && <p className="text-xs text-destructive flex items-center gap-1"><AlertCircle size={12} />{error}</p>}
      {hint && !error && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

// ─── Card ─────────────────────────────────────────────────────────────────────
function Card({ children, className = "", glass = false }: { children: React.ReactNode; className?: string; glass?: boolean }) {
  return (
    <div className={`bg-card border border-border rounded-2xl ${glass ? "backdrop-blur-md bg-card/80" : ""} ${className}`}>
      {children}
    </div>
  );
}

// ─── Loading Skeleton ─────────────────────────────────────────────────────────
function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse bg-muted rounded-lg ${className}`} />;
}

// ─── Toast ────────────────────────────────────────────────────────────────────
function Toast({ message, type = "success", onClose }: { message: string; type?: "success"|"error"|"info"; onClose: () => void }) {
  const colors = {
    success: "bg-green-500",
    error:   "bg-destructive",
    info:    "bg-primary",
  };
  return (
    <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl text-white text-sm font-medium shadow-xl ${colors[type]} animate-in slide-in-from-bottom-4 duration-300`}>
      {type === "success" && <CheckCircle size={16} />}
      {type === "error" && <XCircle size={16} />}
      {type === "info" && <Info size={16} />}
      {message}
      <button onClick={onClose} className="ml-2 opacity-70 hover:opacity-100"><X size={14} /></button>
    </div>
  );
}

// ─── Mock Data ────────────────────────────────────────────────────────────────
const mockItems = [
  { id: 1, title: "MacBook Pro 14\"", category: "Electronics", location: "Library Block B", date: "2025-01-14", status: "open", type: "lost", img: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=300&h=200&fit=crop&auto=format", desc: "Silver MacBook Pro with stickers on the lid. Lost near study area." },
  { id: 2, title: "Brown Leather Wallet", category: "Accessories", location: "Cafeteria", date: "2025-01-13", status: "matched", type: "found", img: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=300&h=200&fit=crop&auto=format", desc: "Brown leather bifold wallet found near the cafeteria entrance." },
  { id: 3, title: "AirPods Pro Case", category: "Electronics", location: "Science Block", date: "2025-01-12", status: "claimed", type: "lost", img: "https://images.unsplash.com/photo-1603351154351-5e2d0600bb77?w=300&h=200&fit=crop&auto=format", desc: "White AirPods Pro charging case, gen 2." },
  { id: 4, title: "Blue Hydroflask 32oz", category: "Personal Items", location: "Gym", date: "2025-01-11", status: "open", type: "found", img: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=300&h=200&fit=crop&auto=format", desc: "Blue Hydroflask with mountain sticker. Found in gym locker room." },
  { id: 5, title: "Student ID Card", category: "Documents", location: "Admin Block", date: "2025-01-10", status: "pending", type: "lost", img: "https://images.unsplash.com/photo-1633265486064-086b219458ec?w=300&h=200&fit=crop&auto=format", desc: "Student ID for semester 2025. Owner contact info visible." },
  { id: 6, title: "Canon Camera Lens", category: "Electronics", location: "Art Studio", date: "2025-01-09", status: "open", type: "lost", img: "https://images.unsplash.com/photo-1510127034890-ba27508e9f1c?w=300&h=200&fit=crop&auto=format", desc: "50mm f/1.8 Canon lens, missing UV filter. Very important for coursework." },
];

const analyticsData = [
  { month: "Aug", lost: 32, found: 18, resolved: 14 },
  { month: "Sep", lost: 48, found: 28, resolved: 22 },
  { month: "Oct", lost: 41, found: 35, resolved: 31 },
  { month: "Nov", lost: 55, found: 40, resolved: 38 },
  { month: "Dec", lost: 28, found: 22, resolved: 20 },
  { month: "Jan", lost: 62, found: 44, resolved: 39 },
];

const categoryData = [
  { name: "Electronics", value: 38 },
  { name: "Accessories", value: 22 },
  { name: "Documents", value: 16 },
  { name: "Clothing", value: 14 },
  { name: "Other", value: 10 },
];

const CHART_COLORS = ["#2563EB", "#7C3AED", "#10B981", "#F59E0B", "#EF4444"];

const mockNotifications = [
  { id: 1, type: "match", title: "Potential match found!", body: "Your lost MacBook report matches a found item.", time: "2 min ago", read: false },
  { id: 2, type: "claim", title: "Claim approved", body: "Your claim for the Brown Wallet has been approved.", time: "1 hr ago", read: false },
  { id: 3, type: "update", title: "Report updated", body: "Admin reviewed your item: AirPods Pro Case.", time: "3 hr ago", read: true },
  { id: 4, type: "reminder", title: "Unclaimed item reminder", body: "Your found item report expires in 3 days.", time: "1 day ago", read: true },
];

const mockUsers = [
  { id: 1, name: "Sofia Martinez", email: "sofia@campus.edu", role: "student", status: "active", reports: 3, joined: "Sep 2024" },
  { id: 2, name: "Aiden Chen", email: "aiden@campus.edu", role: "student", status: "active", reports: 7, joined: "Aug 2024" },
  { id: 3, name: "Priya Patel", email: "priya@campus.edu", role: "staff", status: "active", reports: 1, joined: "Jan 2023" },
  { id: 4, name: "James Okafor", email: "james@campus.edu", role: "student", status: "suspended", reports: 12, joined: "Sep 2023" },
];

// ─── Sidebar ──────────────────────────────────────────────────────────────────
const userNav = [
  { id: "dashboard", label: "Dashboard", icon: Home },
  { id: "search", label: "Browse Items", icon: Search },
  { id: "report-lost", label: "Report Lost", icon: AlertTriangle },
  { id: "report-found", label: "Report Found", icon: Package },
  { id: "my-reports", label: "My Reports", icon: FileText },
  { id: "claim-status", label: "Claim Status", icon: Activity },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "profile", label: "Profile", icon: User },
];

const adminNav = [
  { id: "admin-dashboard", label: "Dashboard", icon: Home },
  { id: "admin-reports", label: "Manage Reports", icon: FileText },
  { id: "admin-claims", label: "Claim Verification", icon: Shield },
  { id: "admin-users", label: "User Management", icon: Users },
  { id: "admin-analytics", label: "Analytics", icon: BarChart2 },
];

function Sidebar({ current, onNavigate, onLanding, isAdmin, mobile, onClose }: {
  current: Screen; onNavigate: (s: Screen) => void; onLanding: () => void;
  isAdmin: boolean; mobile?: boolean; onClose?: () => void;
}) {
  const nav = isAdmin ? adminNav : userNav;
  return (
    <aside className={`flex flex-col h-full bg-sidebar border-r border-sidebar-border ${mobile ? "w-72" : "w-64"}`}>
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-6 py-5 border-b border-sidebar-border">
        <div className="w-8 h-8 bg-primary rounded-xl flex items-center justify-center">
          <Package size={16} className="text-white" />
        </div>
        <span className="text-base font-bold text-sidebar-foreground tracking-tight">BACK_2U</span>
        {mobile && (
          <button onClick={onClose} className="ml-auto text-muted-foreground hover:text-foreground"><X size={18} /></button>
        )}
      </div>

      {isAdmin && (
        <div className="mx-4 mt-4 px-3 py-1.5 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
          <span className="text-xs font-semibold text-purple-700 dark:text-purple-300 uppercase tracking-wider">Admin Panel</span>
        </div>
      )}

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {nav.map(({ id, label, icon: Icon }) => {
          const active = current === id;
          return (
            <button
              key={id}
              onClick={() => { onNavigate(id as Screen); onClose?.(); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                active
                  ? "bg-sidebar-accent text-sidebar-primary"
                  : "text-sidebar-foreground hover:bg-muted/60"
              }`}
            >
              <Icon size={16} className={active ? "text-sidebar-primary" : "text-muted-foreground"} />
              {label}
              {id === "notifications" && <span className="ml-auto bg-primary text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">2</span>}
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-3 py-4 border-t border-sidebar-border space-y-0.5">
        {!isAdmin && (
          <button
            onClick={() => { onNavigate("admin-dashboard"); onClose?.(); }}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:bg-muted/60 transition-all"
          >
            <Shield size={16} />Admin View
          </button>
        )}
        <button
          onClick={onLanding}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:bg-muted/60 transition-all"
        >
          <LogOut size={16} />Sign Out
        </button>
      </div>
    </aside>
  );
}

// ─── Navbar ───────────────────────────────────────────────────────────────────
function Navbar({ theme, toggleTheme, onMenuClick, title, onNotifications }: {
  theme: Theme; toggleTheme: () => void; onMenuClick: () => void; title: string; onNotifications: () => void;
}) {
  return (
    <header className="h-14 border-b border-border bg-card/80 backdrop-blur-md sticky top-0 z-30 flex items-center px-4 gap-3">
      <button onClick={onMenuClick} className="lg:hidden text-muted-foreground hover:text-foreground p-1.5 rounded-lg hover:bg-muted transition-colors">
        <Menu size={18} />
      </button>
      <h1 className="text-sm font-semibold text-foreground flex-1">{title}</h1>
      <button onClick={onNotifications} className="relative p-2 rounded-xl hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
        <Bell size={18} />
        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full" />
      </button>
      <button onClick={toggleTheme} className="p-2 rounded-xl hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
        {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
      </button>
      <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-xs font-bold">AJ</div>
    </header>
  );
}

// ─── App Shell ────────────────────────────────────────────────────────────────
function AppShell({ children, screen, onNavigate, onLanding, theme, toggleTheme, isAdmin }: {
  children: React.ReactNode; screen: Screen; onNavigate: (s: Screen) => void;
  onLanding: () => void; theme: Theme; toggleTheme: () => void; isAdmin: boolean;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const titles: Partial<Record<Screen, string>> = {
    dashboard: "Dashboard", search: "Browse Items", "report-lost": "Report Lost Item",
    "report-found": "Report Found Item", "my-reports": "My Reports", "claim-status": "Claim Status",
    notifications: "Notifications", profile: "Profile", "item-detail": "Item Details", claim: "Claim Ownership",
    "admin-dashboard": "Admin Dashboard", "admin-reports": "Manage Reports",
    "admin-claims": "Claim Verification", "admin-users": "User Management", "admin-analytics": "Analytics",
  };
  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Desktop sidebar */}
      <div className="hidden lg:flex flex-col h-full">
        <Sidebar current={screen} onNavigate={onNavigate} onLanding={onLanding} isAdmin={isAdmin} />
      </div>
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 flex lg:hidden">
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
          <div className="relative z-50 h-full">
            <Sidebar current={screen} onNavigate={onNavigate} onLanding={onLanding} isAdmin={isAdmin} mobile onClose={() => setSidebarOpen(false)} />
          </div>
        </div>
      )}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar
          theme={theme}
          toggleTheme={toggleTheme}
          onMenuClick={() => setSidebarOpen(true)}
          title={titles[screen] ?? "BACK_2U"}
          onNotifications={() => onNavigate("notifications")}
        />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}

// ─── Stat Card ────────────────────────────────────────────────────────────────
function StatCard({ label, value, trend, icon: Icon, color }: {
  label: string; value: string; trend?: string; icon: React.ElementType; color: string;
}) {
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">{label}</p>
          <p className="text-2xl font-bold text-foreground">{value}</p>
          {trend && (
            <p className="text-xs text-green-600 dark:text-green-400 mt-1 flex items-center gap-1">
              <TrendingUp size={11} />{trend}
            </p>
          )}
        </div>
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
          <Icon size={18} className="text-white" />
        </div>
      </div>
    </Card>
  );
}

// ─── Item Card ────────────────────────────────────────────────────────────────
function ItemCard({ item, onClick, view = "grid" }: {
  item: typeof mockItems[0]; onClick: () => void; view?: "grid" | "list";
}) {
  if (view === "list") {
    return (
      <Card className="flex items-center gap-4 p-4 hover:shadow-md transition-shadow cursor-pointer" >
        <img src={item.img} alt={item.title} className="w-16 h-16 rounded-xl object-cover bg-muted flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <h3 className="text-sm font-semibold text-foreground truncate">{item.title}</h3>
            <StatusChip status={item.status} />
          </div>
          <p className="text-xs text-muted-foreground">{item.category} · {item.location}</p>
          <p className="text-xs text-muted-foreground mt-0.5">{item.date}</p>
        </div>
        <button onClick={onClick} className="text-primary hover:opacity-80 p-2 rounded-lg hover:bg-primary/10 transition-colors">
          <Eye size={16} />
        </button>
      </Card>
    );
  }
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-200 cursor-pointer group" >
      <div className="relative aspect-video overflow-hidden">
        <img src={item.img} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 bg-muted" />
        <div className="absolute top-2.5 left-2.5"><StatusChip status={item.status} /></div>
        <div className="absolute top-2.5 right-2.5">
          <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full ${item.type === "lost" ? "bg-red-500/90 text-white" : "bg-green-500/90 text-white"}`}>
            {item.type}
          </span>
        </div>
      </div>
      <div className="p-4">
        <h3 className="text-sm font-semibold text-foreground mb-1 truncate">{item.title}</h3>
        <p className="text-xs text-muted-foreground flex items-center gap-1 mb-0.5"><MapPin size={11} />{item.location}</p>
        <p className="text-xs text-muted-foreground flex items-center gap-1 mb-3"><Clock size={11} />{item.date}</p>
        <button onClick={onClick} className="w-full text-xs font-medium text-primary hover:text-primary/80 transition-colors flex items-center justify-center gap-1.5 py-1.5 rounded-lg hover:bg-primary/8">
          View Details <ChevronRight size={12} />
        </button>
      </div>
    </Card>
  );
}

// ──────────────────────────────────────────────────────────────────────────────
// SCREENS
// ──────────────────────────────────────────────────────────────────────────────

// ─── Landing ─────────────────────────────────────────────────────────────────
function Landing({ onNavigate, theme, toggleTheme }: {
  onNavigate: (s: Screen) => void; theme: Theme; toggleTheme: () => void;
}) {
  const features = [
    { icon: Search, title: "Smart Search", desc: "AI-powered matching connects lost items with found reports instantly." },
    { icon: Bell, title: "Real-time Alerts", desc: "Get notified the moment a potential match is found for your report." },
    { icon: Shield, title: "Verified Claims", desc: "Secure claim verification ensures items reach their rightful owners." },
    { icon: Activity, title: "Live Tracking", desc: "Follow your item's journey with detailed status updates and timeline." },
    { icon: Users, title: "Campus-wide Network", desc: "Every student and staff member is part of the recovery ecosystem." },
    { icon: Award, title: "Reward System", desc: "Earn recognition points for helping return found items to owners." },
  ];
  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center gap-6">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-primary rounded-xl flex items-center justify-center">
              <Package size={16} className="text-white" />
            </div>
            <span className="font-bold text-foreground tracking-tight">BACK_2U</span>
          </div>
          <div className="hidden md:flex items-center gap-6 ml-8 text-sm text-muted-foreground">
            <a href="#features" className="hover:text-foreground transition-colors">Features</a>
            <a href="#how" className="hover:text-foreground transition-colors">How it works</a>
            <a href="#stats" className="hover:text-foreground transition-colors">Stats</a>
          </div>
          <div className="ml-auto flex items-center gap-3">
            <button onClick={toggleTheme} className="p-2 rounded-xl hover:bg-muted text-muted-foreground transition-colors">
              {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <Btn variant="ghost" size="sm" onClick={() => onNavigate("login")}>Sign In</Btn>
            <Btn size="sm" onClick={() => onNavigate("register")}>Get Started</Btn>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-purple-500/5 pointer-events-none" />
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative max-w-6xl mx-auto px-6 pt-20 pb-24 text-center">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-xs font-semibold mb-6 border border-primary/20">
            <Zap size={12} />
            Smart Campus Lost & Found — Powered by AI
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-foreground leading-tight mb-6 tracking-tight">
            Never lose something<br />
            <span className="text-primary">permanently</span> again
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
            BACK_2U connects lost items with their owners across your campus using smart matching, real-time notifications, and verified claims.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Btn size="lg" onClick={() => onNavigate("register")}>
              Report a Lost Item <ArrowRight size={16} />
            </Btn>
            <Btn size="lg" variant="outline" onClick={() => onNavigate("search")}>
              Browse Found Items
            </Btn>
          </div>
          {/* Hero image */}
          <div className="mt-16 relative max-w-4xl mx-auto">
            <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent z-10 pointer-events-none" style={{ top: "60%" }} />
            <img
              src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1200&h=600&fit=crop&auto=format"
              alt="Campus environment"
              className="w-full rounded-2xl shadow-2xl object-cover h-80 bg-muted"
            />
            {/* Floating cards */}
            <div className="absolute -left-6 top-8 bg-card border border-border rounded-2xl p-3 shadow-xl z-20 hidden md:flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 dark:bg-green-900/40 rounded-xl flex items-center justify-center"><CheckCircle size={18} className="text-green-600" /></div>
              <div><p className="text-xs font-semibold text-foreground">Item Returned</p><p className="text-[10px] text-muted-foreground">MacBook Pro · 2 hrs ago</p></div>
            </div>
            <div className="absolute -right-6 top-16 bg-card border border-border rounded-2xl p-3 shadow-xl z-20 hidden md:flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/40 rounded-xl flex items-center justify-center"><Bell size={18} className="text-blue-600" /></div>
              <div><p className="text-xs font-semibold text-foreground">Match Found!</p><p className="text-[10px] text-muted-foreground">Wallet · Just now</p></div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section id="stats" className="py-12 bg-primary">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: "4,821", label: "Items Reported" },
              { value: "3,647", label: "Items Returned" },
              { value: "96%", label: "Recovery Rate" },
              { value: "2.4h", label: "Avg. Return Time" },
            ].map(s => (
              <div key={s.label}>
                <p className="text-3xl font-bold text-white mb-1">{s.value}</p>
                <p className="text-sm text-blue-200">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 max-w-6xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">Everything you need to recover your items</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">A complete system designed for campus communities, with tools for students, staff, and administrators.</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map(({ icon: Icon, title, desc }) => (
            <Card key={title} className="p-6 hover:shadow-lg transition-shadow">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                <Icon size={18} className="text-primary" />
              </div>
              <h3 className="text-sm font-semibold text-foreground mb-2">{title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="py-20 bg-muted/30">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Back in your hands in 4 steps</h2>
          </div>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { step: "01", title: "Report", desc: "Submit a lost or found report with photos and details." },
              { step: "02", title: "Match", desc: "Our system scans for matching reports automatically." },
              { step: "03", title: "Verify", desc: "Prove ownership with our secure claim process." },
              { step: "04", title: "Collect", desc: "Pick up your item from the designated campus point." },
            ].map((s, i) => (
              <div key={s.step} className="relative text-center">
                {i < 3 && <div className="hidden md:block absolute top-6 left-3/4 w-1/2 h-px bg-border" />}
                <div className="w-12 h-12 bg-primary text-white rounded-2xl flex items-center justify-center text-sm font-bold mx-auto mb-4">{s.step}</div>
                <h3 className="text-sm font-semibold text-foreground mb-2">{s.title}</h3>
                <p className="text-xs text-muted-foreground">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <div className="bg-primary rounded-3xl p-12">
            <h2 className="text-3xl font-bold text-white mb-4">Start recovering items today</h2>
            <p className="text-blue-200 mb-8">Join 12,000+ students and staff who use BACK_2U to keep their campus belongings safe.</p>
            <Btn size="lg" variant="secondary" onClick={() => onNavigate("register")}>
              Create Free Account <ArrowRight size={16} />
            </Btn>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 bg-primary rounded-lg flex items-center justify-center"><Package size={12} className="text-white" /></div>
            <span className="text-sm font-bold text-foreground">BACK_2U</span>
          </div>
          <p className="text-xs text-muted-foreground">© 2025 BACK_2U. Smart Campus Lost & Found Platform.</p>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <a href="#" className="hover:text-foreground">Privacy</a>
            <a href="#" className="hover:text-foreground">Terms</a>
            <a href="#" className="hover:text-foreground">Help</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

// ─── Auth Screens ─────────────────────────────────────────────────────────────
function AuthLayout({ children, title, subtitle }: { children: React.ReactNode; title: string; subtitle: string }) {
  return (
    <div className="min-h-screen bg-background flex">
      {/* Left panel */}
      <div className="hidden lg:flex flex-col w-2/5 bg-primary p-12 relative overflow-hidden">
        <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute top-20 -left-20 w-60 h-60 bg-white/10 rounded-full blur-3xl" />
        <div className="flex items-center gap-2.5 mb-16">
          <div className="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center"><Package size={16} className="text-white" /></div>
          <span className="font-bold text-white tracking-tight">BACK_2U</span>
        </div>
        <div className="flex-1 flex flex-col justify-center">
          <h2 className="text-3xl font-bold text-white mb-4">Your campus.<br />Your belongings.<br />Protected.</h2>
          <p className="text-blue-200 text-sm leading-relaxed mb-8">The smart lost & found platform that reunites people with their lost items across campus.</p>
          <div className="space-y-3">
            {["AI-powered item matching", "Real-time notifications", "Secure claim verification"].map(f => (
              <div key={f} className="flex items-center gap-2 text-sm text-blue-100">
                <CheckCircle size={14} className="text-green-400" />{f}
              </div>
            ))}
          </div>
        </div>
        <img src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=600&h=300&fit=crop&auto=format" alt="Campus" className="rounded-2xl opacity-20 mt-8 object-cover h-36 bg-primary/50" />
      </div>
      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-sm">
          <div className="mb-8">
            <div className="lg:hidden flex items-center gap-2 mb-6">
              <div className="w-7 h-7 bg-primary rounded-lg flex items-center justify-center"><Package size={14} className="text-white" /></div>
              <span className="font-bold text-foreground">BACK_2U</span>
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-1">{title}</h1>
            <p className="text-sm text-muted-foreground">{subtitle}</p>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}

function Login({ onNavigate }: { onNavigate: (s: Screen) => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  return (
    <AuthLayout title="Welcome back" subtitle="Sign in to your BACK_2U account">
      <form className="space-y-4" onSubmit={e => { e.preventDefault(); onNavigate("dashboard"); }}>
        <Input label="Email" type="email" placeholder="you@campus.edu" value={email} onChange={setEmail} icon={<Mail size={16} />} required />
        <Input label="Password" type="password" placeholder="••••••••" value={password} onChange={setPassword} icon={<Lock size={16} />} required />
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 text-xs text-muted-foreground cursor-pointer">
            <input type="checkbox" className="rounded" />Remember me
          </label>
          <button type="button" onClick={() => onNavigate("forgot")} className="text-xs text-primary hover:underline">Forgot password?</button>
        </div>
        <Btn type="submit" fullWidth>Sign In</Btn>
        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border" /></div>
          <div className="relative text-center"><span className="bg-background px-3 text-xs text-muted-foreground">or continue with</span></div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Btn variant="outline" size="sm"><Globe size={14} />Google</Btn>
          <Btn variant="outline" size="sm"><Smartphone size={14} />Campus SSO</Btn>
        </div>
        <p className="text-center text-xs text-muted-foreground mt-4">
          No account?{" "}
          <button type="button" onClick={() => onNavigate("register")} className="text-primary hover:underline font-medium">Create one</button>
        </p>
      </form>
    </AuthLayout>
  );
}

function Register({ onNavigate }: { onNavigate: (s: Screen) => void }) {
  const [step, setStep] = useState(1);
  const [name, setName] = useState(""); const [email, setEmail] = useState("");
  const [studentId, setStudentId] = useState(""); const [password, setPassword] = useState("");
  const [phone, setPhone] = useState(""); const [faculty, setFaculty] = useState("");
  return (
    <AuthLayout title={step === 1 ? "Create account" : "Almost done"} subtitle={`Step ${step} of 2 · Campus Lost & Found Platform`}>
      <div className="mb-6">
        <div className="flex gap-2 mb-1">
          <div className={`h-1 flex-1 rounded-full transition-colors ${step >= 1 ? "bg-primary" : "bg-border"}`} />
          <div className={`h-1 flex-1 rounded-full transition-colors ${step >= 2 ? "bg-primary" : "bg-border"}`} />
        </div>
      </div>
      {step === 1 ? (
        <form className="space-y-4" onSubmit={e => { e.preventDefault(); setStep(2); }}>
          <Input label="Full Name" placeholder="Sofia Martinez" value={name} onChange={setName} icon={<User size={16} />} required />
          <Input label="Campus Email" type="email" placeholder="you@campus.edu" value={email} onChange={setEmail} icon={<Mail size={16} />} required />
          <Input label="Student ID" placeholder="S2024-00123" value={studentId} onChange={setStudentId} icon={<Hash size={16} />} required />
          <Btn type="submit" fullWidth>Continue <ChevronRight size={16} /></Btn>
        </form>
      ) : (
        <form className="space-y-4" onSubmit={e => { e.preventDefault(); onNavigate("dashboard"); }}>
          <Input label="Phone (optional)" type="tel" placeholder="+1 555 0100" value={phone} onChange={setPhone} icon={<Phone size={16} />} />
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-foreground">Faculty / Department</label>
            <select value={faculty} onChange={e => setFaculty(e.target.value)} className="bg-card border border-border rounded-xl px-4 py-2.5 text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary">
              <option value="">Select faculty</option>
              <option>Engineering</option><option>Science</option><option>Arts & Humanities</option>
              <option>Business</option><option>Medicine</option><option>Law</option>
            </select>
          </div>
          <Input label="Password" type="password" placeholder="Min. 8 characters" value={password} onChange={setPassword} icon={<Lock size={16} />} required />
          <label className="flex items-start gap-2 text-xs text-muted-foreground cursor-pointer">
            <input type="checkbox" className="rounded mt-0.5" />
            I agree to the <span className="text-primary">Terms of Service</span> and <span className="text-primary">Privacy Policy</span>
          </label>
          <div className="flex gap-3">
            <Btn variant="outline" onClick={() => setStep(1)} className="flex-1"><ChevronLeft size={16} /></Btn>
            <Btn type="submit" className="flex-1">Create Account</Btn>
          </div>
        </form>
      )}
      <p className="text-center text-xs text-muted-foreground mt-4">
        Already have an account?{" "}
        <button onClick={() => onNavigate("login")} className="text-primary hover:underline font-medium">Sign in</button>
      </p>
    </AuthLayout>
  );
}

function ForgotPassword({ onNavigate }: { onNavigate: (s: Screen) => void }) {
  const [email, setEmail] = useState(""); const [sent, setSent] = useState(false);
  return (
    <AuthLayout title="Reset password" subtitle="We will send a reset link to your campus email">
      {!sent ? (
        <form className="space-y-4" onSubmit={e => { e.preventDefault(); setSent(true); }}>
          <Input label="Campus Email" type="email" placeholder="you@campus.edu" value={email} onChange={setEmail} icon={<Mail size={16} />} required />
          <Btn type="submit" fullWidth><Send size={16} />Send Reset Link</Btn>
          <Btn variant="ghost" fullWidth onClick={() => onNavigate("login")}><ChevronLeft size={16} />Back to Sign In</Btn>
        </form>
      ) : (
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-2xl flex items-center justify-center mx-auto">
            <CheckCircle size={28} className="text-green-600" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground mb-1">Check your email</h3>
            <p className="text-sm text-muted-foreground">We sent a reset link to <strong>{email}</strong></p>
          </div>
          <Btn variant="ghost" fullWidth onClick={() => onNavigate("login")}>Back to Sign In</Btn>
        </div>
      )}
    </AuthLayout>
  );
}

// ─── Dashboard ───────────────────────────────────────────────────────────────
function Dashboard({ onNavigate }: { onNavigate: (s: Screen) => void }) {
  return (
    <div className="space-y-6 max-w-6xl">
      {/* Welcome */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-foreground">Good morning, Sofia 👋</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Here is a summary of your lost & found activity.</p>
        </div>
        <div className="flex gap-3">
          <Btn size="sm" variant="outline" onClick={() => onNavigate("report-found")}><Package size={14} />Report Found</Btn>
          <Btn size="sm" onClick={() => onNavigate("report-lost")}><Plus size={14} />Report Lost</Btn>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="My Reports" value="7" trend="+2 this month" icon={FileText} color="bg-blue-500" />
        <StatCard label="Active Lost" value="3" icon={AlertTriangle} color="bg-orange-500" />
        <StatCard label="Items Returned" value="4" trend="All time" icon={CheckCircle} color="bg-green-500" />
        <StatCard label="Pending Claims" value="1" icon={Clock} color="bg-purple-500" />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Activity chart */}
        <Card className="lg:col-span-2 p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-sm font-semibold text-foreground">Campus Activity (Last 6 months)</h2>
            <span className="text-xs text-muted-foreground">Jan 2025</span>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={analyticsData}>
              <defs>
                <linearGradient id="lostGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563EB" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="foundGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: "12px", fontSize: "12px" }} />
              <Area type="monotone" dataKey="lost" stroke="#2563EB" strokeWidth={2} fill="url(#lostGrad)" name="Lost" />
              <Area type="monotone" dataKey="found" stroke="#10B981" strokeWidth={2} fill="url(#foundGrad)" name="Found" />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        {/* Notifications */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-foreground">Notifications</h2>
            <button onClick={() => onNavigate("notifications")} className="text-xs text-primary hover:underline">View all</button>
          </div>
          <div className="space-y-3">
            {mockNotifications.slice(0, 3).map(n => (
              <div key={n.id} className={`flex gap-3 p-3 rounded-xl transition-colors ${!n.read ? "bg-primary/5 border border-primary/10" : ""}`}>
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${n.type === "match" ? "bg-blue-100 dark:bg-blue-900/30" : n.type === "claim" ? "bg-green-100 dark:bg-green-900/30" : "bg-muted"}`}>
                  {n.type === "match" ? <Search size={14} className="text-blue-600" /> : n.type === "claim" ? <CheckCircle size={14} className="text-green-600" /> : <Bell size={14} className="text-muted-foreground" />}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-medium text-foreground truncate">{n.title}</p>
                  <p className="text-[11px] text-muted-foreground truncate">{n.body}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">{n.time}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Recent Items */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-sm font-semibold text-foreground">Recent Reports</h2>
          <button onClick={() => onNavigate("my-reports")} className="text-xs text-primary hover:underline">View all</button>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {mockItems.slice(0, 3).map(item => (
            <ItemCard key={item.id} item={item} onClick={() => onNavigate("item-detail")} />
          ))}
        </div>
      </Card>
    </div>
  );
}

// ─── Report Lost (Multi-step) ─────────────────────────────────────────────────
function ReportLost({ onNavigate }: { onNavigate: (s: Screen) => void }) {
  const [step, setStep] = useState(1);
  const [title, setTitle] = useState(""); const [category, setCategory] = useState("");
  const [location, setLocation] = useState(""); const [date, setDate] = useState("");
  const [desc, setDesc] = useState(""); const [color, setColor] = useState("");
  const [brand, setBrand] = useState(""); const [reward, setReward] = useState("");
  const [dragOver, setDragOver] = useState(false);

  const steps = ["Item Info", "Details", "Photos", "Contact", "Review"];
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Progress */}
      <Card className="p-5">
        <div className="flex items-center justify-between mb-3">
          {steps.map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${i + 1 < step ? "bg-green-500 text-white" : i + 1 === step ? "bg-primary text-white" : "bg-muted text-muted-foreground"}`}>
                {i + 1 < step ? <Check size={13} /> : i + 1}
              </div>
              <span className={`text-xs hidden sm:block ${i + 1 === step ? "text-foreground font-medium" : "text-muted-foreground"}`}>{s}</span>
              {i < steps.length - 1 && <ChevronRight size={14} className="text-border" />}
            </div>
          ))}
        </div>
        <div className="h-1.5 bg-muted rounded-full overflow-hidden">
          <div className="h-full bg-primary rounded-full transition-all duration-500" style={{ width: `${(step / steps.length) * 100}%` }} />
        </div>
      </Card>

      <Card className="p-6 space-y-5">
        {step === 1 && (
          <>
            <div>
              <h2 className="text-base font-semibold text-foreground mb-0.5">Basic information</h2>
              <p className="text-sm text-muted-foreground">Tell us what you lost</p>
            </div>
            <Input label="Item Name" placeholder="e.g. MacBook Pro 14-inch" value={title} onChange={setTitle} required />
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-foreground">Category <span className="text-destructive">*</span></label>
              <select value={category} onChange={e => setCategory(e.target.value)} className="bg-card border border-border rounded-xl px-4 py-2.5 text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary">
                <option value="">Select a category</option>
                <option>Electronics</option><option>Accessories</option><option>Documents</option>
                <option>Clothing</option><option>Books & Stationery</option><option>Keys</option><option>Other</option>
              </select>
            </div>
            <Input label="Where did you last see it?" placeholder="e.g. Library Block B, 3rd Floor" value={location} onChange={setLocation} icon={<MapPin size={16} />} required />
            <Input label="Date Lost" type="date" value={date} onChange={setDate} icon={<Calendar size={16} />} required />
          </>
        )}

        {step === 2 && (
          <>
            <div>
              <h2 className="text-base font-semibold text-foreground mb-0.5">Item details</h2>
              <p className="text-sm text-muted-foreground">Help people identify your item</p>
            </div>
            <Input label="Color" placeholder="e.g. Silver, Black" value={color} onChange={setColor} />
            <Input label="Brand / Make" placeholder="e.g. Apple, Samsung" value={brand} onChange={setBrand} />
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-foreground">Description</label>
              <textarea value={desc} onChange={e => setDesc(e.target.value)} rows={4} placeholder="Describe any distinguishing features, serial numbers, stickers, damage, etc." className="bg-card border border-border rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary resize-none" />
            </div>
            <Input label="Reward (optional)" placeholder="e.g. $20 Starbucks gift card" value={reward} onChange={setReward} icon={<Award size={16} />} hint="Offering a reward increases recovery chances by 40%" />
          </>
        )}

        {step === 3 && (
          <>
            <div>
              <h2 className="text-base font-semibold text-foreground mb-0.5">Upload photos</h2>
              <p className="text-sm text-muted-foreground">Photos help others identify your item faster</p>
            </div>
            <div
              onDragOver={e => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={e => { e.preventDefault(); setDragOver(false); }}
              className={`border-2 border-dashed rounded-2xl p-10 text-center transition-colors cursor-pointer ${dragOver ? "border-primary bg-primary/5" : "border-border hover:border-primary/50 hover:bg-muted/50"}`}
            >
              <div className="w-12 h-12 bg-muted rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Upload size={20} className="text-muted-foreground" />
              </div>
              <p className="text-sm font-medium text-foreground mb-1">Drag & drop photos here</p>
              <p className="text-xs text-muted-foreground mb-4">PNG, JPG up to 10MB each</p>
              <Btn size="sm" variant="outline"><Camera size={14} />Browse Files</Btn>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {mockItems.slice(0, 2).map(item => (
                <div key={item.id} className="relative aspect-square rounded-xl overflow-hidden group">
                  <img src={item.img} alt="" className="w-full h-full object-cover bg-muted" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button className="text-white"><Trash2 size={16} /></button>
                  </div>
                </div>
              ))}
              <div className="aspect-square rounded-xl border-2 border-dashed border-border flex items-center justify-center cursor-pointer hover:border-primary/50 transition-colors">
                <Plus size={20} className="text-muted-foreground" />
              </div>
            </div>
          </>
        )}

        {step === 4 && (
          <>
            <div>
              <h2 className="text-base font-semibold text-foreground mb-0.5">Contact preferences</h2>
              <p className="text-sm text-muted-foreground">How should people reach you?</p>
            </div>
            <div className="grid grid-cols-1 gap-3">
              {["Email notification", "SMS notification", "In-app only"].map(opt => (
                <label key={opt} className="flex items-center gap-3 p-3 rounded-xl border border-border cursor-pointer hover:bg-muted/50 transition-colors">
                  <input type="checkbox" defaultChecked={opt !== "SMS notification"} className="rounded" />
                  <span className="text-sm text-foreground">{opt}</span>
                </label>
              ))}
            </div>
            <Input label="Additional contact (optional)" placeholder="WhatsApp or phone number" icon={<Phone size={16} />} />
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800/30">
              <div className="flex gap-3">
                <Info size={16} className="text-primary flex-shrink-0 mt-0.5" />
                <p className="text-xs text-primary dark:text-blue-300">Your contact info is kept private and only shared with verified matches approved by campus admin.</p>
              </div>
            </div>
          </>
        )}

        {step === 5 && (
          <>
            <div>
              <h2 className="text-base font-semibold text-foreground mb-0.5">Review & Submit</h2>
              <p className="text-sm text-muted-foreground">Confirm your report before submitting</p>
            </div>
            <div className="space-y-3">
              {[
                { label: "Item", value: title || "MacBook Pro 14\"" },
                { label: "Category", value: category || "Electronics" },
                { label: "Location", value: location || "Library Block B" },
                { label: "Date Lost", value: date || "2025-01-14" },
                { label: "Description", value: desc || "Silver MacBook with stickers on lid" },
              ].map(row => (
                <div key={row.label} className="flex gap-4 py-2.5 border-b border-border last:border-0">
                  <span className="text-xs font-medium text-muted-foreground w-24 flex-shrink-0">{row.label}</span>
                  <span className="text-xs text-foreground flex-1">{row.value}</span>
                </div>
              ))}
            </div>
            <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-xl border border-orange-100 dark:border-orange-800/30">
              <div className="flex gap-3">
                <AlertCircle size={16} className="text-orange-600 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-orange-700 dark:text-orange-300">Filing false reports is a violation of campus policy and may result in account suspension.</p>
              </div>
            </div>
          </>
        )}

        {/* Navigation */}
        <div className="flex gap-3 pt-2">
          {step > 1 && <Btn variant="outline" onClick={() => setStep(s => s - 1)} className="flex-1"><ChevronLeft size={16} />Back</Btn>}
          {step < 5 ? (
            <Btn onClick={() => setStep(s => s + 1)} className={step === 1 ? "w-full" : "flex-1"}>
              Continue <ChevronRight size={16} />
            </Btn>
          ) : (
            <Btn onClick={() => onNavigate("my-reports")} className="flex-1">
              <CheckCircle size={16} />Submit Report
            </Btn>
          )}
        </div>
      </Card>
    </div>
  );
}

// ─── Report Found ─────────────────────────────────────────────────────────────
function ReportFound({ onNavigate }: { onNavigate: (s: Screen) => void }) {
  const [title, setTitle] = useState(""); const [category, setCategory] = useState("");
  const [location, setLocation] = useState(""); const [date, setDate] = useState("");
  const [desc, setDesc] = useState(""); const [storage, setStorage] = useState("");
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-6 pb-5 border-b border-border">
          <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
            <Package size={18} className="text-green-600" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-foreground">Report a Found Item</h2>
            <p className="text-xs text-muted-foreground">Help return this item to its owner</p>
          </div>
        </div>
        <div className="space-y-5">
          <Input label="Item Name" placeholder="e.g. Brown Leather Wallet" value={title} onChange={setTitle} required />
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-foreground">Category <span className="text-destructive">*</span></label>
            <select value={category} onChange={e => setCategory(e.target.value)} className="bg-card border border-border rounded-xl px-4 py-2.5 text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary">
              <option value="">Select a category</option>
              <option>Electronics</option><option>Accessories</option><option>Documents</option>
              <option>Clothing</option><option>Books & Stationery</option><option>Keys</option><option>Other</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Where found?" placeholder="Cafeteria entrance" value={location} onChange={setLocation} icon={<MapPin size={16} />} required />
            <Input label="Date Found" type="date" value={date} onChange={setDate} icon={<Calendar size={16} />} required />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-foreground">Description</label>
            <textarea value={desc} onChange={e => setDesc(e.target.value)} rows={3} placeholder="Describe the item — color, brand, contents if visible, any identifiers." className="bg-card border border-border rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary resize-none" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-foreground">Where is it now? <span className="text-destructive">*</span></label>
            <select value={storage} onChange={e => setStorage(e.target.value)} className="bg-card border border-border rounded-xl px-4 py-2.5 text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary">
              <option value="">Select storage location</option>
              <option>Admin Office (Main Block)</option>
              <option>Library Front Desk</option>
              <option>Security Office</option>
              <option>Student Affairs</option>
              <option>With me (will hand over)</option>
            </select>
          </div>
          <div className="border-2 border-dashed border-border rounded-2xl p-6 text-center hover:border-primary/50 hover:bg-muted/30 transition-colors cursor-pointer">
            <ImageIcon size={20} className="text-muted-foreground mx-auto mb-2" />
            <p className="text-xs text-muted-foreground">Upload photos of the item</p>
          </div>
          <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-100 dark:border-green-800/30">
            <div className="flex gap-3">
              <Award size={16} className="text-green-600 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-green-700 dark:text-green-300">Thank you for being a Good Samaritan! You will earn +50 campus karma points when this item is returned.</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Btn variant="outline" className="flex-1" onClick={() => onNavigate("dashboard")}>Cancel</Btn>
            <Btn className="flex-1" onClick={() => onNavigate("my-reports")}><CheckCircle size={16} />Submit Report</Btn>
          </div>
        </div>
      </Card>
    </div>
  );
}

// ─── Search Items ─────────────────────────────────────────────────────────────
function SearchItems({ onNavigate }: { onNavigate: (s: Screen) => void }) {
  const [query, setQuery] = useState("");
  const [view, setView] = useState<"grid"|"list">("grid");
  const [typeFilter, setTypeFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showFilters, setShowFilters] = useState(false);

  const filtered = mockItems.filter(item => {
    const q = query.toLowerCase();
    const matchQ = !q || item.title.toLowerCase().includes(q) || item.category.toLowerCase().includes(q) || item.location.toLowerCase().includes(q);
    const matchType = typeFilter === "all" || item.type === typeFilter;
    const matchCat = categoryFilter === "all" || item.category === categoryFilter;
    const matchStatus = statusFilter === "all" || item.status === statusFilter;
    return matchQ && matchType && matchCat && matchStatus;
  });

  return (
    <div className="space-y-5 max-w-6xl">
      {/* Search bar */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search items by name, category, location…"
            className="w-full bg-card border border-border rounded-xl pl-10 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
          />
        </div>
        <Btn variant="outline" size="md" onClick={() => setShowFilters(f => !f)}>
          <Filter size={15} />{showFilters ? "Hide" : "Filters"}
        </Btn>
        <div className="flex border border-border rounded-xl overflow-hidden">
          <button onClick={() => setView("grid")} className={`p-2.5 ${view === "grid" ? "bg-primary text-white" : "bg-card text-muted-foreground hover:bg-muted"} transition-colors`}><Grid size={16} /></button>
          <button onClick={() => setView("list")} className={`p-2.5 ${view === "list" ? "bg-primary text-white" : "bg-card text-muted-foreground hover:bg-muted"} transition-colors`}><List size={16} /></button>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <Card className="p-4">
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Type</label>
              <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)} className="bg-background border border-border rounded-xl px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/30">
                <option value="all">All Types</option>
                <option value="lost">Lost</option>
                <option value="found">Found</option>
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Category</label>
              <select value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)} className="bg-background border border-border rounded-xl px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/30">
                <option value="all">All Categories</option>
                <option value="Electronics">Electronics</option>
                <option value="Accessories">Accessories</option>
                <option value="Documents">Documents</option>
                <option value="Personal Items">Personal Items</option>
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</label>
              <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="bg-background border border-border rounded-xl px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/30">
                <option value="all">All Statuses</option>
                <option value="open">Open</option>
                <option value="matched">Matched</option>
                <option value="claimed">Claimed</option>
                <option value="pending">Pending</option>
              </select>
            </div>
          </div>
          <div className="flex gap-2 mt-3">
            <button onClick={() => { setTypeFilter("all"); setCategoryFilter("all"); setStatusFilter("all"); setQuery(""); }} className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"><RefreshCw size={11} />Clear all</button>
          </div>
        </Card>
      )}

      {/* Results */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{filtered.length} items found</p>
        <div className="flex gap-2">
          {["open", "matched", "found"].map(s => (
            <button key={s} onClick={() => setStatusFilter(s === statusFilter ? "all" : s)} className="text-xs px-3 py-1 rounded-full border border-border hover:border-primary hover:text-primary transition-colors">
              {s}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-16 h-16 bg-muted rounded-2xl flex items-center justify-center mx-auto mb-4"><Inbox size={24} className="text-muted-foreground" /></div>
          <h3 className="text-sm font-medium text-foreground mb-1">No items found</h3>
          <p className="text-xs text-muted-foreground">Try adjusting your search or filters</p>
        </div>
      ) : (
        <div className={view === "grid" ? "grid sm:grid-cols-2 lg:grid-cols-3 gap-5" : "flex flex-col gap-3"}>
          {filtered.map(item => <ItemCard key={item.id} item={item} onClick={() => onNavigate("item-detail")} view={view} />)}
        </div>
      )}

      {/* Pagination */}
      <div className="flex items-center justify-between pt-4 border-t border-border">
        <p className="text-xs text-muted-foreground">Page 1 of 3</p>
        <div className="flex gap-1">
          {[1,2,3].map(p => (
            <button key={p} className={`w-8 h-8 rounded-lg text-xs font-medium transition-colors ${p === 1 ? "bg-primary text-white" : "text-muted-foreground hover:bg-muted"}`}>{p}</button>
          ))}
          <button className="w-8 h-8 rounded-lg text-xs text-muted-foreground hover:bg-muted"><ChevronRight size={14} /></button>
        </div>
      </div>
    </div>
  );
}

// ─── Item Detail ──────────────────────────────────────────────────────────────
function ItemDetail({ onNavigate }: { onNavigate: (s: Screen) => void }) {
  const item = mockItems[0];
  return (
    <div className="max-w-4xl space-y-6">
      <button onClick={() => onNavigate("search")} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ChevronLeft size={16} />Back to Search
      </button>
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Images */}
        <Card className="overflow-hidden p-4 space-y-3">
          <img src={item.img} alt={item.title} className="w-full aspect-video object-cover rounded-xl bg-muted" />
          <div className="grid grid-cols-3 gap-2">
            {mockItems.slice(0,3).map(i => (
              <img key={i.id} src={i.img} alt="" className="aspect-square object-cover rounded-lg cursor-pointer opacity-70 hover:opacity-100 transition-opacity bg-muted" />
            ))}
          </div>
        </Card>

        {/* Info */}
        <div className="space-y-5">
          <Card className="p-6 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600">LOST</span>
                  <StatusChip status={item.status} />
                </div>
                <h1 className="text-xl font-bold text-foreground">{item.title}</h1>
              </div>
              <button className="p-2 rounded-xl hover:bg-muted text-muted-foreground transition-colors"><MoreHorizontal size={18} /></button>
            </div>
            <div className="space-y-2.5">
              <div className="flex items-center gap-2 text-sm text-muted-foreground"><Tag size={14} /><span>{item.category}</span></div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground"><MapPin size={14} /><span>{item.location}</span></div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground"><Clock size={14} /><span>Reported {item.date}</span></div>
            </div>
            <div className="pt-2 border-t border-border">
              <p className="text-sm text-foreground leading-relaxed">{item.desc}</p>
            </div>
          </Card>

          <Card className="p-5">
            <h3 className="text-sm font-semibold text-foreground mb-3">Reported by</h3>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white text-sm font-bold">SM</div>
              <div>
                <p className="text-sm font-medium text-foreground">Sofia Martinez</p>
                <p className="text-xs text-muted-foreground">Engineering · Student</p>
              </div>
              <div className="ml-auto">
                <Btn size="sm" variant="outline"><MessageSquare size={14} />Message</Btn>
              </div>
            </div>
          </Card>

          <div className="grid grid-cols-2 gap-3">
            <Btn variant="outline" fullWidth onClick={() => onNavigate("claim")}><Shield size={16} />Claim Ownership</Btn>
            <Btn fullWidth><Check size={16} />I Found This!</Btn>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Claim Ownership ──────────────────────────────────────────────────────────
function ClaimOwnership({ onNavigate }: { onNavigate: (s: Screen) => void }) {
  const [desc, setDesc] = useState(""); const [submitted, setSubmitted] = useState(false);
  if (submitted) {
    return (
      <div className="max-w-lg mx-auto">
        <Card className="p-8 text-center space-y-4">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-2xl flex items-center justify-center mx-auto">
            <CheckCircle size={28} className="text-green-600" />
          </div>
          <h2 className="text-lg font-bold text-foreground">Claim Submitted!</h2>
          <p className="text-sm text-muted-foreground">Your ownership claim has been submitted for admin review. You will be notified within 24 hours.</p>
          <Btn onClick={() => onNavigate("claim-status")} fullWidth>Track Claim Status <ArrowRight size={16} /></Btn>
          <Btn variant="ghost" onClick={() => onNavigate("search")} fullWidth>Browse More Items</Btn>
        </Card>
      </div>
    );
  }
  return (
    <div className="max-w-lg mx-auto space-y-5">
      <button onClick={() => onNavigate("item-detail")} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"><ChevronLeft size={16} />Back to Item</button>
      <Card className="p-6 space-y-5">
        <div>
          <h2 className="text-base font-semibold text-foreground mb-0.5">Claim Ownership</h2>
          <p className="text-sm text-muted-foreground">Provide evidence that you are the rightful owner</p>
        </div>
        <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-xl">
          <img src={mockItems[0].img} alt="" className="w-12 h-12 rounded-lg object-cover bg-muted" />
          <div>
            <p className="text-sm font-medium text-foreground">{mockItems[0].title}</p>
            <p className="text-xs text-muted-foreground">{mockItems[0].category} · {mockItems[0].location}</p>
          </div>
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-foreground">Proof of Ownership <span className="text-destructive">*</span></label>
          <textarea value={desc} onChange={e => setDesc(e.target.value)} rows={4} placeholder="Describe unique identifying features only the owner would know: serial number, engraving, specific stickers, files/apps, passcode pattern, etc." className="bg-card border border-border rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary resize-none" />
        </div>
        <div>
          <label className="text-sm font-medium text-foreground mb-2 block">Supporting Documents</label>
          <div className="border-2 border-dashed border-border rounded-xl p-5 text-center hover:border-primary/50 transition-colors cursor-pointer">
            <Upload size={16} className="text-muted-foreground mx-auto mb-2" />
            <p className="text-xs text-muted-foreground">Receipt, registration, photo proof</p>
          </div>
        </div>
        <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-xl border border-orange-100 dark:border-orange-800/30">
          <div className="flex gap-3">
            <AlertTriangle size={16} className="text-orange-600 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-orange-700 dark:text-orange-300">False claims may result in permanent account suspension and disciplinary action.</p>
          </div>
        </div>
        <div className="flex gap-3">
          <Btn variant="outline" onClick={() => onNavigate("item-detail")} className="flex-1">Cancel</Btn>
          <Btn onClick={() => setSubmitted(true)} className="flex-1" disabled={!desc.trim()}><Send size={16} />Submit Claim</Btn>
        </div>
      </Card>
    </div>
  );
}

// ─── My Reports ───────────────────────────────────────────────────────────────
function MyReports({ onNavigate }: { onNavigate: (s: Screen) => void }) {
  const [activeTab, setActiveTab] = useState<"lost"|"found">("lost");
  const items = mockItems.filter(i => i.type === activeTab);
  return (
    <div className="max-w-4xl space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex bg-muted rounded-xl p-1 gap-1">
          {(["lost","found"] as const).map(t => (
            <button key={t} onClick={() => setActiveTab(t)} className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all capitalize ${activeTab === t ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}>{t} Items</button>
          ))}
        </div>
        <Btn size="sm" onClick={() => onNavigate(activeTab === "lost" ? "report-lost" : "report-found")}><Plus size={14} />New Report</Btn>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-16 h-16 bg-muted rounded-2xl flex items-center justify-center mx-auto mb-4"><Inbox size={24} className="text-muted-foreground" /></div>
          <h3 className="text-sm font-medium text-foreground mb-1">No {activeTab} reports</h3>
          <p className="text-xs text-muted-foreground mb-4">Your {activeTab} item reports will appear here</p>
          <Btn size="sm" onClick={() => onNavigate(activeTab === "lost" ? "report-lost" : "report-found")}>Report {activeTab} item</Btn>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map(item => (
            <Card key={item.id} className="p-4">
              <div className="flex items-center gap-4">
                <img src={item.img} alt={item.title} className="w-16 h-16 rounded-xl object-cover bg-muted flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-sm font-semibold text-foreground truncate">{item.title}</h3>
                    <StatusChip status={item.status} />
                  </div>
                  <p className="text-xs text-muted-foreground">{item.category} · {item.location}</p>
                  <p className="text-xs text-muted-foreground">{item.date}</p>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button onClick={() => onNavigate("item-detail")} className="p-2 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/8 transition-colors"><Eye size={15} /></button>
                  <button className="p-2 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/8 transition-colors"><Edit3 size={15} /></button>
                  <button className="p-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/8 transition-colors"><Trash2 size={15} /></button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Claim Status Timeline ────────────────────────────────────────────────────
function ClaimStatus() {
  const steps = [
    { label: "Claim Submitted", desc: "Your claim was received by the system", time: "Jan 14, 2025 · 10:32 AM", done: true },
    { label: "Under Admin Review", desc: "Campus admin is reviewing your evidence", time: "Jan 14, 2025 · 11:15 AM", done: true },
    { label: "Verification Required", desc: "Please visit Admin Block with your student ID", time: "Jan 14, 2025 · 2:00 PM", done: true, active: true },
    { label: "Claim Approved", desc: "Ownership confirmed by admin", time: "Pending", done: false },
    { label: "Item Collected", desc: "Item picked up from Admin Block", time: "Pending", done: false },
  ];
  return (
    <div className="max-w-lg mx-auto space-y-5">
      <Card className="p-5">
        <div className="flex items-center gap-3 mb-4">
          <img src={mockItems[0].img} alt="" className="w-14 h-14 rounded-xl object-cover bg-muted" />
          <div>
            <h2 className="text-base font-semibold text-foreground">{mockItems[0].title}</h2>
            <StatusChip status="pending" />
          </div>
        </div>
        <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-xl text-xs text-orange-700 dark:text-orange-300 flex items-center gap-2">
          <AlertCircle size={14} />Action required: visit Admin Block with Student ID
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="text-sm font-semibold text-foreground mb-6">Claim Timeline</h2>
        <div className="relative">
          <div className="absolute left-3.5 top-0 bottom-0 w-px bg-border" />
          <div className="space-y-8">
            {steps.map((s, i) => (
              <div key={i} className="relative flex gap-4 pl-2">
                <div className={`relative z-10 w-7 h-7 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${s.done ? s.active ? "border-primary bg-primary" : "border-green-500 bg-green-500" : "border-border bg-background"}`}>
                  {s.done && !s.active && <Check size={13} className="text-white" />}
                  {s.active && <div className="w-2 h-2 bg-white rounded-full" />}
                </div>
                <div className="pt-0.5 pb-1">
                  <p className={`text-sm font-medium ${s.done ? "text-foreground" : "text-muted-foreground"}`}>{s.label}</p>
                  <p className="text-xs text-muted-foreground">{s.desc}</p>
                  <p className={`text-[11px] mt-1 font-mono ${s.done ? "text-primary" : "text-muted-foreground"}`}>{s.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      <Card className="p-5 space-y-3">
        <h3 className="text-sm font-semibold text-foreground">Need help?</h3>
        <div className="grid grid-cols-2 gap-3">
          <Btn variant="outline" size="sm"><MessageSquare size={14} />Contact Admin</Btn>
          <Btn variant="outline" size="sm"><HelpCircle size={14} />Get Support</Btn>
        </div>
      </Card>
    </div>
  );
}

// ─── Notifications ────────────────────────────────────────────────────────────
function Notifications() {
  const [notifications, setNotifications] = useState(mockNotifications);
  const markAllRead = () => setNotifications(ns => ns.map(n => ({ ...n, read: true })));
  return (
    <div className="max-w-2xl space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{notifications.filter(n => !n.read).length} unread</p>
        <button onClick={markAllRead} className="text-xs text-primary hover:underline flex items-center gap-1"><Check size={12} />Mark all read</button>
      </div>
      {notifications.map(n => (
        <Card key={n.id} className={`p-4 transition-all ${!n.read ? "border-primary/20 bg-primary/[0.02]" : ""}`}>
          <div className="flex gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${n.type === "match" ? "bg-blue-100 dark:bg-blue-900/30" : n.type === "claim" ? "bg-green-100 dark:bg-green-900/30" : n.type === "reminder" ? "bg-orange-100 dark:bg-orange-900/30" : "bg-muted"}`}>
              {n.type === "match" && <Search size={16} className="text-blue-600" />}
              {n.type === "claim" && <CheckCircle size={16} className="text-green-600" />}
              {n.type === "update" && <RefreshCw size={16} className="text-muted-foreground" />}
              {n.type === "reminder" && <Bell size={16} className="text-orange-600" />}
            </div>
            <div className="flex-1">
              <div className="flex items-start justify-between gap-2">
                <p className={`text-sm font-medium ${!n.read ? "text-foreground" : "text-muted-foreground"}`}>{n.title}</p>
                {!n.read && <span className="w-2 h-2 bg-primary rounded-full flex-shrink-0 mt-1.5" />}
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">{n.body}</p>
              <p className="text-[11px] text-muted-foreground mt-1.5">{n.time}</p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}

// ─── User Profile ─────────────────────────────────────────────────────────────
function Profile() {
  const [name, setName] = useState("Sofia Martinez");
  const [phone, setPhone] = useState("+1 555 0123");
  const [saved, setSaved] = useState(false);
  return (
    <div className="max-w-2xl space-y-5">
      <Card className="p-6">
        <div className="flex items-center gap-4 mb-6 pb-6 border-b border-border">
          <div className="relative">
            <div className="w-20 h-20 bg-primary rounded-2xl flex items-center justify-center text-white text-2xl font-bold">SM</div>
            <button className="absolute -bottom-1 -right-1 w-7 h-7 bg-card border border-border rounded-full flex items-center justify-center hover:bg-muted transition-colors">
              <Camera size={12} className="text-muted-foreground" />
            </button>
          </div>
          <div>
            <h2 className="text-lg font-bold text-foreground">{name}</h2>
            <p className="text-sm text-muted-foreground">sofia@campus.edu</p>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs text-muted-foreground">S2024-00123</span>
              <span className="text-xs px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full font-medium">Student</span>
            </div>
          </div>
          <div className="ml-auto hidden sm:block">
            <div className="text-center">
              <p className="text-2xl font-bold text-foreground">340</p>
              <p className="text-xs text-muted-foreground">Karma Points</p>
            </div>
          </div>
        </div>
        <div className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <Input label="Full Name" value={name} onChange={setName} icon={<User size={16} />} />
            <Input label="Phone" value={phone} onChange={setPhone} icon={<Phone size={16} />} />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-foreground">Faculty</label>
            <select className="bg-card border border-border rounded-xl px-4 py-2.5 text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/30">
              <option>Engineering</option><option>Science</option><option>Arts & Humanities</option>
            </select>
          </div>
          {saved && (
            <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-xl text-xs text-green-700 dark:text-green-300 flex items-center gap-2">
              <CheckCircle size={14} />Profile updated successfully
            </div>
          )}
          <Btn onClick={() => setSaved(true)}>Save Changes</Btn>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-sm font-semibold text-foreground mb-4">Notification Preferences</h3>
        <div className="space-y-3">
          {["Email notifications", "SMS alerts", "Matched item alerts", "Claim updates", "Weekly digest"].map(opt => (
            <div key={opt} className="flex items-center justify-between">
              <span className="text-sm text-foreground">{opt}</span>
              <button className="w-10 h-6 bg-primary rounded-full relative transition-colors">
                <span className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow transition-transform" />
              </button>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-sm font-semibold text-foreground mb-4">Account</h3>
        <div className="space-y-2">
          <Btn variant="outline" size="sm" fullWidth><Lock size={14} />Change Password</Btn>
          <Btn variant="outline" size="sm" fullWidth><Download size={14} />Download My Data</Btn>
          <Btn variant="danger" size="sm" fullWidth><Trash2 size={14} />Delete Account</Btn>
        </div>
      </Card>
    </div>
  );
}

// ─── Admin Dashboard ──────────────────────────────────────────────────────────
function AdminDashboard({ onNavigate }: { onNavigate: (s: Screen) => void }) {
  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-foreground">Admin Dashboard</h1>
          <p className="text-sm text-muted-foreground">Campus Lost & Found — Overview</p>
        </div>
        <div className="flex gap-3">
          <Btn size="sm" variant="outline"><Download size={14} />Export</Btn>
          <Btn size="sm"><RefreshCw size={14} />Refresh</Btn>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Reports" value="1,247" trend="+18% this month" icon={FileText} color="bg-blue-500" />
        <StatCard label="Pending Claims" value="38" icon={Clock} color="bg-orange-500" />
        <StatCard label="Items Returned" value="892" trend="71.5% rate" icon={CheckCircle} color="bg-green-500" />
        <StatCard label="Active Users" value="3,421" trend="+5% this week" icon={Users} color="bg-purple-500" />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-sm font-semibold text-foreground">Monthly Overview</h2>
            <div className="flex gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-primary" />Lost</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-green-500" />Found</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-purple-500" />Resolved</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={analyticsData} barSize={8} barCategoryGap="40%">
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: "12px", fontSize: "12px" }} />
              <Bar dataKey="lost" fill="#2563EB" radius={[4,4,0,0]} name="Lost" />
              <Bar dataKey="found" fill="#10B981" radius={[4,4,0,0]} name="Found" />
              <Bar dataKey="resolved" fill="#7C3AED" radius={[4,4,0,0]} name="Resolved" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6">
          <h2 className="text-sm font-semibold text-foreground mb-5">Categories</h2>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={categoryData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={45} outerRadius={75} paddingAngle={3}>
                {categoryData.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
              </Pie>
              <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: "12px", fontSize: "12px" }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-3">
            {categoryData.map((d, i) => (
              <div key={d.name} className="flex items-center gap-2 text-xs">
                <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: CHART_COLORS[i] }} />
                <span className="text-muted-foreground flex-1">{d.name}</span>
                <span className="font-medium text-foreground">{d.value}%</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Recent claims */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-sm font-semibold text-foreground">Pending Claims</h2>
          <button onClick={() => onNavigate("admin-claims")} className="text-xs text-primary hover:underline">View all</button>
        </div>
        <div className="space-y-3">
          {mockItems.slice(0,3).map(item => (
            <div key={item.id} className="flex items-center gap-4 p-3 rounded-xl hover:bg-muted/50 transition-colors">
              <img src={item.img} alt="" className="w-10 h-10 rounded-lg object-cover bg-muted flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{item.title}</p>
                <p className="text-xs text-muted-foreground">{item.date}</p>
              </div>
              <StatusChip status="pending" />
              <div className="flex gap-2 flex-shrink-0">
                <button className="p-1.5 rounded-lg text-green-600 hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors"><Check size={14} /></button>
                <button className="p-1.5 rounded-lg text-destructive hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"><X size={14} /></button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

// ─── Admin Reports ────────────────────────────────────────────────────────────
function AdminReports() {
  const [search, setSearch] = useState(""); const [statusFilter, setStatusFilter] = useState("all");
  const filtered = mockItems.filter(i => {
    const q = search.toLowerCase();
    const matchQ = !q || i.title.toLowerCase().includes(q);
    const matchS = statusFilter === "all" || i.status === statusFilter;
    return matchQ && matchS;
  });
  return (
    <div className="max-w-6xl space-y-5">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search reports…" className="w-full bg-card border border-border rounded-xl pl-10 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary" />
        </div>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="bg-card border border-border rounded-xl px-4 py-2.5 text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/30">
          <option value="all">All Statuses</option>
          {Object.keys(statusConfig).map(s => <option key={s} value={s}>{statusConfig[s].label}</option>)}
        </select>
      </div>
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-5 py-3">Item</th>
                <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-3 py-3 hidden sm:table-cell">Category</th>
                <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-3 py-3 hidden md:table-cell">Location</th>
                <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-3 py-3">Status</th>
                <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-3 py-3 hidden lg:table-cell">Date</th>
                <th className="text-right text-xs font-medium text-muted-foreground uppercase tracking-wider px-5 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map(item => (
                <tr key={item.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <img src={item.img} alt="" className="w-9 h-9 rounded-lg object-cover bg-muted flex-shrink-0" />
                      <span className="text-sm font-medium text-foreground">{item.title}</span>
                    </div>
                  </td>
                  <td className="px-3 py-3 text-sm text-muted-foreground hidden sm:table-cell">{item.category}</td>
                  <td className="px-3 py-3 text-sm text-muted-foreground hidden md:table-cell">{item.location}</td>
                  <td className="px-3 py-3"><StatusChip status={item.status} /></td>
                  <td className="px-3 py-3 text-sm text-muted-foreground hidden lg:table-cell font-mono text-xs">{item.date}</td>
                  <td className="px-5 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button className="p-1.5 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/8 transition-colors"><Eye size={14} /></button>
                      <button className="p-1.5 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/8 transition-colors"><Edit3 size={14} /></button>
                      <button className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/8 transition-colors"><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between px-5 py-3 border-t border-border">
          <p className="text-xs text-muted-foreground">Showing {filtered.length} of {mockItems.length} reports</p>
          <div className="flex gap-1">
            {[1,2,3].map(p => (
              <button key={p} className={`w-7 h-7 rounded-lg text-xs font-medium ${p===1?"bg-primary text-white":"text-muted-foreground hover:bg-muted"}`}>{p}</button>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}

// ─── Admin Claims ─────────────────────────────────────────────────────────────
function AdminClaims() {
  return (
    <div className="max-w-4xl space-y-5">
      <div className="grid grid-cols-3 gap-4">
        <StatCard label="Pending Review" value="38" icon={Clock} color="bg-orange-500" />
        <StatCard label="Approved Today" value="12" icon={CheckCircle} color="bg-green-500" />
        <StatCard label="Rejected Today" value="3" icon={XCircle} color="bg-red-500" />
      </div>
      <div className="space-y-4">
        {mockItems.slice(0,4).map(item => (
          <Card key={item.id} className="p-5">
            <div className="flex flex-col sm:flex-row gap-4">
              <img src={item.img} alt="" className="w-full sm:w-24 h-24 rounded-xl object-cover bg-muted flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-sm font-semibold text-foreground">{item.title}</h3>
                    <p className="text-xs text-muted-foreground">{item.category} · {item.location}</p>
                  </div>
                  <StatusChip status="pending" />
                </div>
                <div className="p-3 bg-muted/50 rounded-xl">
                  <p className="text-xs font-medium text-muted-foreground mb-1">Claimant Proof:</p>
                  <p className="text-xs text-foreground">I bought this from the Apple Store on Nov 12, 2024. Serial: C02Y4K2TJGH5. Has a dent on bottom-left corner.</p>
                </div>
                <div className="flex gap-2">
                  <Btn size="sm" variant="ghost" className="flex-1">
                    <Eye size={13} />View Evidence
                  </Btn>
                  <Btn size="sm" className="flex-1 bg-green-600 hover:bg-green-700 text-white">
                    <Check size={13} />Approve
                  </Btn>
                  <Btn size="sm" variant="danger" className="flex-1">
                    <X size={13} />Reject
                  </Btn>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

// ─── Admin Users ──────────────────────────────────────────────────────────────
function AdminUsers() {
  const [search, setSearch] = useState("");
  const filtered = mockUsers.filter(u => !search || u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()));
  return (
    <div className="max-w-5xl space-y-5">
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search users…" className="w-full bg-card border border-border rounded-xl pl-10 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary" />
        </div>
        <Btn size="md"><Plus size={15} />Invite User</Btn>
      </div>
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-5 py-3">User</th>
                <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-3 py-3 hidden sm:table-cell">Role</th>
                <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-3 py-3">Status</th>
                <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-3 py-3 hidden md:table-cell">Reports</th>
                <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-3 py-3 hidden lg:table-cell">Joined</th>
                <th className="text-right text-xs font-medium text-muted-foreground uppercase tracking-wider px-5 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map(u => (
                <tr key={u.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                        {u.name.split(" ").map(n => n[0]).join("")}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">{u.name}</p>
                        <p className="text-xs text-muted-foreground">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-3 hidden sm:table-cell">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${u.role === "staff" ? "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300" : "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"}`}>{u.role}</span>
                  </td>
                  <td className="px-3 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${u.status === "active" ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300" : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300"}`}>{u.status}</span>
                  </td>
                  <td className="px-3 py-3 text-sm text-muted-foreground hidden md:table-cell">{u.reports}</td>
                  <td className="px-3 py-3 text-sm text-muted-foreground hidden lg:table-cell">{u.joined}</td>
                  <td className="px-5 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button className="p-1.5 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/8 transition-colors"><Eye size={14} /></button>
                      <button className="p-1.5 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/8 transition-colors"><Edit3 size={14} /></button>
                      <button className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/8 transition-colors"><XCircle size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between px-5 py-3 border-t border-border">
          <p className="text-xs text-muted-foreground">Showing {filtered.length} of {mockUsers.length} users</p>
        </div>
      </Card>
    </div>
  );
}

// ─── Admin Analytics ──────────────────────────────────────────────────────────
function AdminAnalytics() {
  return (
    <div className="max-w-6xl space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Recovery Rate" value="71.5%" trend="+3.2% vs last month" icon={TrendingUp} color="bg-green-500" />
        <StatCard label="Avg. Return Time" value="2.4h" trend="-18 min faster" icon={Clock} color="bg-blue-500" />
        <StatCard label="Daily Reports" value="28.4" trend="+6% this week" icon={Activity} color="bg-purple-500" />
        <StatCard label="User Satisfaction" value="4.8/5" trend="NPS 72" icon={Star} color="bg-orange-500" />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h2 className="text-sm font-semibold text-foreground mb-5">Lost vs Found Trend</h2>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={analyticsData}>
              <defs>
                <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#2563EB" stopOpacity={0.15} /><stop offset="95%" stopColor="#2563EB" stopOpacity={0} /></linearGradient>
                <linearGradient id="g2" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#10B981" stopOpacity={0.15} /><stop offset="95%" stopColor="#10B981" stopOpacity={0} /></linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: "12px", fontSize: "12px" }} />
              <Legend wrapperStyle={{ fontSize: "12px" }} />
              <Area type="monotone" dataKey="lost" stroke="#2563EB" strokeWidth={2} fill="url(#g1)" name="Lost" />
              <Area type="monotone" dataKey="found" stroke="#10B981" strokeWidth={2} fill="url(#g2)" name="Found" />
              <Area type="monotone" dataKey="resolved" stroke="#7C3AED" strokeWidth={2} fill="transparent" name="Resolved" strokeDasharray="4 2" />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6">
          <h2 className="text-sm font-semibold text-foreground mb-5">Items by Category</h2>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={categoryData} layout="vertical" barSize={10}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
              <YAxis dataKey="name" type="category" tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} width={90} />
              <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: "12px", fontSize: "12px" }} />
              <Bar dataKey="value" radius={[0,4,4,0]} name="Items">
                {categoryData.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6">
          <h2 className="text-sm font-semibold text-foreground mb-5">Top Locations</h2>
          <div className="space-y-3">
            {[
              { loc: "Main Library", count: 94, pct: 88 },
              { loc: "Engineering Block", count: 67, pct: 63 },
              { loc: "Cafeteria", count: 52, pct: 49 },
              { loc: "Sports Complex", count: 41, pct: 38 },
              { loc: "Admin Block", count: 29, pct: 27 },
            ].map(row => (
              <div key={row.loc}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-foreground">{row.loc}</span>
                  <span className="text-xs font-mono text-muted-foreground">{row.count}</span>
                </div>
                <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${row.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-sm font-semibold text-foreground mb-5">Response Time Distribution</h2>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={[
              { time: "<1h", count: 124 },
              { time: "1-6h", count: 243 },
              { time: "6-24h", count: 189 },
              { time: "1-3d", count: 98 },
              { time: ">3d", count: 34 },
            ]} barSize={28}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="time" tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: "12px", fontSize: "12px" }} />
              <Bar dataKey="count" fill="#2563EB" radius={[6,6,0,0]} name="Reports" />
            </BarChart>
          </ResponsiveContainer>
          <p className="text-xs text-muted-foreground text-center mt-2">Time from report to resolution</p>
        </Card>
      </div>
    </div>
  );
}

// ─── Root App ─────────────────────────────────────────────────────────────────
export default function App() {
  const [screen, setScreen] = useState<Screen>("landing");
  const [theme, setTheme] = useState<Theme>("light");
  const [toast, setToast] = useState<{ message: string; type: "success"|"error"|"info" } | null>(null);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    document.body.style.fontFamily = "'Inter', system-ui, sans-serif";
  }, [theme]);

  const toggleTheme = () => setTheme(t => t === "light" ? "dark" : "light");

  const navigate = (s: Screen) => {
    setScreen(s);
    window.scrollTo({ top: 0, behavior: "smooth" });
    if (s === "my-reports") {
      setToast({ message: "Report submitted successfully!", type: "success" });
      setTimeout(() => setToast(null), 3500);
    }
  };

  const publicScreens: Screen[] = ["landing", "login", "register", "forgot"];
  const isAdmin = screen.startsWith("admin-");

  if (publicScreens.includes(screen)) {
    return (
      <div className="bg-background min-h-screen">
        {screen === "landing" && <Landing onNavigate={navigate} theme={theme} toggleTheme={toggleTheme} />}
        {screen === "login" && <Login onNavigate={navigate} />}
        {screen === "register" && <Register onNavigate={navigate} />}
        {screen === "forgot" && <ForgotPassword onNavigate={navigate} />}
        {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      </div>
    );
  }

  return (
    <AppShell
      screen={screen}
      onNavigate={navigate}
      onLanding={() => setScreen("landing")}
      theme={theme}
      toggleTheme={toggleTheme}
      isAdmin={isAdmin}
    >
      {screen === "dashboard" && <Dashboard onNavigate={navigate} />}
      {screen === "report-lost" && <ReportLost onNavigate={navigate} />}
      {screen === "report-found" && <ReportFound onNavigate={navigate} />}
      {screen === "search" && <SearchItems onNavigate={navigate} />}
      {screen === "item-detail" && <ItemDetail onNavigate={navigate} />}
      {screen === "claim" && <ClaimOwnership onNavigate={navigate} />}
      {screen === "my-reports" && <MyReports onNavigate={navigate} />}
      {screen === "claim-status" && <ClaimStatus />}
      {screen === "notifications" && <Notifications />}
      {screen === "profile" && <Profile />}
      {screen === "admin-dashboard" && <AdminDashboard onNavigate={navigate} />}
      {screen === "admin-reports" && <AdminReports />}
      {screen === "admin-claims" && <AdminClaims />}
      {screen === "admin-users" && <AdminUsers />}
      {screen === "admin-analytics" && <AdminAnalytics />}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </AppShell>
  );
}
