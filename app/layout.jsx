import "./globals.css";
import { AppProvider } from "@/components/providers/AppProvider";
import { LayoutShell } from "@/components/layout/LayoutShell";

export const metadata = {
  title: "PetCare Hub",
  description: "Unified Next.js pet services and store platform"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AppProvider>
          <LayoutShell>{children}</LayoutShell>
        </AppProvider>
      </body>
    </html>
  );
}
