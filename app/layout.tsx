import type { Metadata } from "next";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { ThemeProvider } from "@/components/theme-provider";

export const metadata: Metadata = {
  title: "MyEasyScience | Learn science your way",
  description: "Explore Chemistry, Biology, Physics and Mathematics with MyEasyScience."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" suppressHydrationWarning><body><ThemeProvider><SiteHeader />{children}</ThemeProvider></body></html>;
}
