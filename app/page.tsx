"use client";

import { useEffect, useState } from "react";

export default function Page() {
  const [connected, setConnected] = useState(false);
  const [username, setUsername] = useState<string | null>(null);
  const [fid, setFid] = useState<number | null>(null);

  useEffect(() => {
    // Farcaster Frame Context
    if ((window as any).frameContext) {
      const ctx = (window as any).frameContext;
      setUsername(ctx.user?.username);
      setFid(ctx.user?.fid);
      setConnected(true);
    }
  }, []);

  if (!connected) {
    return (
      <main style={container}>
        <section style={card}>
          <div style={logo}>◉))) DropSignal</div>

          <p style={{ opacity: 0.7, marginTop: 12 }}>
            Deposit. Earn. Signal.
          </p>

          <button
            style={farcasterButton}
            onClick={() => {
              (window as any).openFarcasterAuth?.();
            }}
          >
            Connect with Farcaster
          </button>
        </section>
      </main>
    );
  }

  return (
    <main style={container}>
      <section style={card}>
        <div style={logo}>◉))) DropSignal</div>

        <p style={{ marginTop: 12 }}>
          Welcome <b>@{username}</b>
        </p>

        <div style={inviteBox}>
          <p style={{ opacity: 0.6 }}>Your invite link</p>
          <code style={code}>
            https://farcaster.xyz/miniapps/dropsignal?ref={fid}
          </code>
        </div>

        {/* Hier kommt danach das Vault UI */}
      </section>
    </main>
  );
}