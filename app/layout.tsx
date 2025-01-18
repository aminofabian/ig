import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { SessionProvider } from "next-auth/react";
import LayoutClient from "@/components/LayoutClient";
import { MessageProvider } from '@/lib/contexts/MessageContext';
import { ChatProvider } from '@/lib/contexts/ChatContext';
import ClientLayout from '@/components/ClientLayout';

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  title: "IgLeadGen || Instagram Growth Tool",
  description: "IgLeadGen - Instagram Growth and Lead Generation Tool",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className={`${outfit.className} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SessionProvider>
            <MessageProvider>
              <ChatProvider>
                <ClientLayout>
                  <LayoutClient>{children}</LayoutClient>
                </ClientLayout>
              </ChatProvider>
            </MessageProvider>
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
