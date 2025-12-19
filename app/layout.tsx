"use client";
import { WagmiProvider } from "wagmi";
import { config } from "../lib/wagmi";

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <WagmiProvider config={config}>
          {children}
        </WagmiProvider>
      </body>
    </html>
  );
}