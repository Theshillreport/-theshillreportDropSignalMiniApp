"use client";

import { WagmiProvider } from "wagmi";
import { wagmiConfig } from "../lib/wagmi";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <WagmiProvider config={wagmiConfig}>
          {children}
        </WagmiProvider>
      </body>
    </html>
  );
}