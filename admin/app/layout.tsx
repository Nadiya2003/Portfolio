import type { Metadata } from "next";
import { Toaster } from "react-hot-toast";
import "./globals.css";

export const metadata: Metadata = {
  title: "Portfolio Admin — CMS Dashboard",
  description: "Premium CMS Admin Dashboard for Portfolio Management",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        {children}
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: "#1a1a1a",
              color: "#fff",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "12px",
              fontSize: "14px",
            },
            success: { iconTheme: { primary: "#22C55E", secondary: "#0a0a0a" } },
            error: { iconTheme: { primary: "#EF4444", secondary: "#0a0a0a" } },
          }}
        />
      </body>
    </html>
  );
}
