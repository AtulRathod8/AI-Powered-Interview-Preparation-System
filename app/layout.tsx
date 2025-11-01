import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sign Language Identifier",
  description: "AI-powered sign language recognition system for mute and deaf people",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
