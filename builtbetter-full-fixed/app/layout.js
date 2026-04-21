import "./globals.css";

export const metadata = {
  title: "Built Better Group",
  description: "Toronto general contracting for condo renovation, design-build projects, suites, and outdoor living.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
