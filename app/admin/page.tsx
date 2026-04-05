import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { TacticalCard } from "@/components/ui/TacticalCard";
import { TacticalButton } from "@/components/ui/TacticalButton";
import { db } from "@/lib/db";

export default async function AdminDashboard() {
  const session = await auth();

  // double check security in server component
  if (session?.user?.role !== "admin") {
    redirect("/");
  }

  // Fetch summary stats
  const totalUsers = await db.user.count();
  const totalEvents = await db.event.count();
  const totalProjects = await db.project.count();
  
  // registrations today (simplified for now)
  const registrationsToday = await db.registration.count({
    where: {
      registeredAt: {
        gte: new Date(new Date().setHours(0, 0, 0, 0))
      }
    }
  });

  return (
    <div className="flex-1 space-y-8 p-8 bg-black min-h-screen font-mono text-white">
      <div className="flex items-center justify-between border-b border-white pb-6">
        <div>
          <h1 className="text-4xl font-black uppercase tracking-tighter italic">
            ADMIN_CONTROL_CENTER
          </h1>
          <p className="text-[10px] text-zinc-500 uppercase tracking-[0.2em] mt-1">
            v1.0.4 // SECURE_ACCESS_GRANTED // {session.user.name?.toUpperCase() || "ADMIN"}
          </p>
        </div>
        <div className="flex gap-4">
          <TacticalButton variant="outline" size="sm">System Logs</TacticalButton>
          <TacticalButton size="sm">Export Data</TacticalButton>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <TacticalCard title="01_MEMBERS" subtitle="total active nodes" status="LIVE">
          <div className="mt-2 text-5xl font-black text-white tracking-tighter">
            {totalUsers.toString().padStart(3, '0')}
          </div>
          <div className="mt-4 flex items-center gap-2">
            <div className="h-1 w-1 bg-green-500 rounded-full animate-pulse" />
            <span className="text-[10px] uppercase tracking-widest text-zinc-500">Node Sync Complete</span>
          </div>
        </TacticalCard>

        <TacticalCard title="02_EVENTS" subtitle="scheduled operations" status="SYNCED">
          <div className="mt-2 text-5xl font-black text-white tracking-tighter">
            {totalEvents.toString().padStart(3, '0')}
          </div>
          <div className="mt-4 flex items-center gap-2">
            <div className="h-1 w-1 bg-yellow-500 rounded-full" />
            <span className="text-[10px] uppercase tracking-widest text-zinc-500">{registrationsToday} New Regs Today</span>
          </div>
        </TacticalCard>

        <TacticalCard title="03_PROJECTS" subtitle="active development" status="ACTIVE">
          <div className="mt-2 text-5xl font-black text-white tracking-tighter">
            {totalProjects.toString().padStart(3, '0')}
          </div>
          <div className="mt-4 flex items-center gap-2">
            <div className="h-1 w-1 bg-blue-500 rounded-full" />
            <span className="text-[10px] uppercase tracking-widest text-zinc-500">Pipeline Stable</span>
          </div>
        </TacticalCard>

        <TacticalCard title="04_THREAT_MGMT" subtitle="system security" status="SECURE">
          <div className="mt-2 text-xl font-bold text-white tracking-tight leading-none uppercase">
            All Protocols<br />Nominal
          </div>
          <div className="mt-4 flex items-center gap-2">
            <div className="h-1 w-1 bg-green-500 rounded-full" />
            <span className="text-[10px] uppercase tracking-widest text-zinc-500">Encryption Active</span>
          </div>
        </TacticalCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <TacticalCard className="lg:col-span-2" title="RECENT_ACTIVITY" subtitle="real-time uplink log">
          <div className="space-y-4 py-2">
             {[1, 2, 3].map((i) => (
               <div key={i} className="flex items-center justify-between border-l-2 border-white pl-4 py-1 hover:bg-white/5 transition-colors group cursor-pointer">
                 <div className="flex flex-col">
                   <span className="text-[10px] text-zinc-500">16:42:0{i} // UPLINK_REQUEST</span>
                   <span className="text-sm font-bold uppercase tracking-tight text-white group-hover:text-white transition-colors">User registration initiated // Node_{i}24</span>
                 </div>
                 <div className="text-[10px] bg-zinc-800 px-2 py-1 uppercase tracking-tighter">SUCCESS</div>
               </div>
             ))}
          </div>
        </TacticalCard>

        <TacticalCard title="QUICK_ACTIONS" subtitle="tactical overrides">
          <div className="grid grid-cols-1 gap-2">
            <TacticalButton variant="outline" className="w-full justify-start py-4">
              {">"} Add New Event
            </TacticalButton>
            <TacticalButton variant="outline" className="w-full justify-start py-4">
              {">"} Broadcast Alert
            </TacticalButton>
            <TacticalButton variant="outline" className="w-full justify-start py-4 text-red-500 border-red-500/50 hover:bg-red-500">
              {">"} System Lockup
            </TacticalButton>
          </div>
        </TacticalCard>
      </div>
    </div>
  );
}