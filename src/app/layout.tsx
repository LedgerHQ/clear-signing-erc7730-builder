import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";

import { TRPCReactProvider } from "~/trpc/react";
import { Erc7730StoreProvider } from "~/store/erc7730Provider";
import { Toaster } from "~/components/ui/toaster";
import { ThemeProvider } from "~/components/ui/theme-provider";

export const metadata: Metadata = {
  title: "Create Erc7730 Json",
  description: "Clear sign all the things",
  icons: [{ rel: "icon", url: "/ledger-logo-short-black.svg" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${GeistSans.variable}`}
      suppressHydrationWarning
    >
      <body>
        <TRPCReactProvider>
          <Erc7730StoreProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              {children}
              <Toaster />
            </ThemeProvider>
          </Erc7730StoreProvider>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
