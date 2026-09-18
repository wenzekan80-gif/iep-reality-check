import "./globals.css";

export const metadata = { title: "IEP Reality Check" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body>{children}</body></html>;
}
