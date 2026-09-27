import "./globals.css";
import "./notebook.css";
import "../ui/notebook-shell.css";
import "../ui/notebook-source.css";
import "../ui/notebook-meeting.css";
import "../ui/ai-plan.css";

export const metadata = { title: "IEP Reality Check" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body className="notebook-theme">{children}</body></html>;
}
