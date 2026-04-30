import { AppSidebar } from "@/components/layout/app-sidebar";
import { AppTopbar } from "@/components/layout/app-topbar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-surface">
      <AppSidebar />
      <AppTopbar />
      <main className="md:ml-[260px] pt-16 min-h-screen">
        <div className="mx-auto max-w-[1440px] px-4 sm:px-6 md:px-8 py-6 md:py-8">
          {children}
        </div>
      </main>
    </div>
  );
}
