import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Careerify",
  description: "Careerify is a great website for advancing your career!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
