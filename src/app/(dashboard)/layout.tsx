import { AppSidebar } from "@/components/layout/app-sidebar";
import { AppTopbar } from "@/components/layout/app-topbar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-surface">
      <AppSidebar />
      <AppTopbar />
      <main className="ml-[260px] pt-16 min-h-screen">
        <div className="mx-auto max-w-[1440px] px-8 py-8">
          {children}
        </div>
      </main>
    </div>
  );
}
