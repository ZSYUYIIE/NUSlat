import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NUSlat – Vocabulary Learning",
  description:
    "A gamified vocabulary learning app. Master 1k, 2k, and 3k words step by step.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
