import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ed Donner's Digital Twin",
  description: "An AI Career Twin representing Ed Donner",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
