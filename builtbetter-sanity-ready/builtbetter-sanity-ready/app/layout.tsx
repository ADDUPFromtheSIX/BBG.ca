import "./globals.css";
import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Built Better Group | Toronto General Contracting",
  description: "Condo renovation, garage builds, garden suites, and outdoor living across Toronto and the GTA.",
  metadataBase: new URL("https://builtbettergroup.ca"),
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
