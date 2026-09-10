import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Interview Trainer",
  description: "Prépare tes entretiens avec des révisions courtes et régulières.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
