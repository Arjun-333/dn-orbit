import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { TacticalButton } from "@/components/ui/TacticalButton";
import Link from "next/link";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (session?.user?.role !== "admin") {
    redirect("/");
  }

  const navItems = [
    { label: "01_DASHBOARD", href: "/admin" },
    { label: "02_MEMBERS", href: "/admin/members" },
    { label: "03_EVENTS", href: "/admin/events" },
    { label: "04_PROJECTS", href: "/admin/projects" },
    { label: "05_LEADERBOARD", href: "/admin/leaderboard" },
  ];

  return (
    <div className="flex min-h-screen bg-black text-white font-mono">
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/20 flex flex-col p-6 sticky top-0 h-screen">
        <div className="mb-12">
          <Link href="/" className="text-2xl font-black italic tracking-tighter hover:text-zinc-400 transition-colors">
            DN_ORBIT // ADMIN
          </Link>
          <div className="h-0.5 w-full bg-white mt-2" />
        </div>

        <nav className="flex-1 space-y-4">
          <div className="text-[10px] uppercase tracking-[0.3em] text-zinc-500 mb-4 font-bold">Main Navigation</div>
          {navItems.map((item) => (
            <Link 
              key={item.href} 
              href={item.href}
              className="block group"
            >
              <div className="flex items-center gap-3 text-sm font-bold tracking-tight hover:translate-x-1 transition-transform">
                <span className="text-zinc-600 group-hover:text-white transition-colors">{"//"}</span>
                <span className="uppercase">{item.label}</span>
              </div>
            </Link>
          ))}
        </nav>

        <div className="mt-auto border-t border-white/10 pt-6">
           <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-zinc-800 text-white flex items-center justify-center font-black text-xs border border-white/20">
                {session.user.name?.[0].toUpperCase() || "A"}
              </div>
              <div className="flex flex-col overflow-hidden text-left">
                <span className="text-[10px] font-bold truncate uppercase">{session.user.name || "Administrator"}</span>
                <span className="text-[8px] text-zinc-500 uppercase tracking-widest">Clearance: Level 7</span>
              </div>
           </div>
           <TacticalButton variant="outline" size="sm" className="w-full border-red-500/30 text-red-500 hover:bg-red-500 hover:text-white group">
              <span className="group-hover:animate-pulse">Terminate Session</span>
           </TacticalButton>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-auto">
        {children}
      </main>
    </div>
  );
}
