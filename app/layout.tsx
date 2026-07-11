import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Lentium Gallery",
  description: "Клиентски фотогалерии от LENTIUM PRODUCTION",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="bg">
      <body>{children}</body>
    </html>
  );
}
