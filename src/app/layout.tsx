import "./globals.css";
import "./parchment.css";

export const metadata = { title: "IEP Reality Check" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body className="parchment-theme">{children}</body></html>;
}
