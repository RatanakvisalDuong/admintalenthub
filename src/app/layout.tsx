import type { Metadata } from "next";
import { Ubuntu } from "next/font/google";
import "./globals.css";
import SessionProvider from "../component/providers/SessionProvider";

const ubuntuFont = Ubuntu({
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "TalentHub Admin",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${ubuntuFont.className} bg-[#E8E8E8]`}>
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}