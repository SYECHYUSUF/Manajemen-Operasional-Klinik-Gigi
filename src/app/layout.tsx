import type { Metadata } from "next";
import "./globals.css";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import { RoleProvider } from "@/contexts/role-context";

export const metadata: Metadata = {
  title: { default: "DentalCloud Pro", template: "%s | DentalCloud Pro" },
  description: "Aplikasi Manajemen Operasional Klinik Gigi – Enterprise Grade",
  keywords: ["klinik gigi", "manajemen klinik", "rekam medis", "odontogram"],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className="antialiased">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <RoleProvider>
            <TooltipProvider>
              {children}
            </TooltipProvider>
          </RoleProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
