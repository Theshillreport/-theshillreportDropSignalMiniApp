"use client";

import { useEffect, useState } from "react";

export default function Page() {
  const [connected, setConnected] = useState(false);
  const [username, setUsername] = useState<string | null>(null);
  const [fid, setFid] = useState<number | null>(null);

  useEffect(() => {
    // Farcaster Mini App Context (wenn in Farcaster geöffnet)
    if ((window as any).frameContext) {
      const ctx = (window as any).frameContext;
      setUsername(ctx.user?.username ?? null);
      setFid(ctx.user?.fid ?? null);
      setConnected(true);
    }
  }, []);

  // -----------------------------
  // CONNECT SCREEN
  // -----------------------------
  if (!connected) {
    return (
      <main style={container}>
        <div style={background} />

        <section style={card}>
          <div style={logo}>◉))) DropSignal</div>
          <p style={subtitle}>Deposit. Earn. Signal.</p>

          <button
            style={farcasterButton}
            onClick={() => {
              // Farcaster öffnet automatisch Auth
              (window as any).openFarcasterAuth?.();
            }}
          >
            Connect with Farcaster
          </button>
        </section>
      </main>
    );
  }

  // -----------------------------
  // MAIN APP
  // -----------------------------
  return (
    <main style={container}>
      <div style={background} />

      <section style={card}>
        <div style={logo}>◉))) DropSignal</div>

        <p style={{ marginTop: 8, opacity: 0.8 }}>
          Welcome <b>@{username}</b>
        </p>

        <div style={statBox}>
          <span>Deposited</span>
          <strong>$0.00 USDC</strong>
        </div>

        <div style={statBox}>
          <span>Earned</span>
          <strong>+ $0.0000</strong>
        </div>

        <div style={actions}>
          <button style={depositBtn}>Deposit</button>
          <button style={withdrawBtn}>Withdraw</button>
        </div>

        <div style={apyBox}>
          <span>Current APY</span>
          <strong>18.4% • live</strong>
        </div>

        <div style={inviteBox}>
          <p style={{ opacity: 0.6 }}>Your invite link</p>
          <code style={code}>
            https://farcaster.xyz/miniapps/dropsignal?ref={fid}
          </code>
        </div>
      </section>
    </main>
  );
}

/* ======================================================
   STYLES (GANZ UNTEN – WICHTIG)
   ====================================================== */

const container = {
  position: "relative" as const,
  minHeight: "100vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  overflow: "hidden",
};

const background = {
  position: "absolute" as const,
  inset: 0,
  background:
    "radial-gradient(circle at top, #1e1b4b 0%, #020617 70%)",
  zIndex: -1,
};

const card = {
  width: 360,
  padding: 20,
  borderRadius: 20,
  background: "rgba(255,255,255,0.06)",
  backdropFilter: "blur(14px)",
  border: "1px solid rgba(255,255,255,0.08)",
  boxShadow: "0 0 60px rgba(139,92,246,0.15)",
};

const logo = {
  fontSize: 22,
  fontWeight: 800,
  letterSpacing: 0.5,
};

const subtitle = {
  marginTop: 6,
  opacity: 0.7,
};

const farcasterButton = {
  width: "100%",
  marginTop: 20,
  padding: 14,
  borderRadius: 16,
  border: "none",
  fontWeight: 700,
  fontSize: 15,
  background: "#8b5cf6",
  color: "white",
};

const statBox = {
  marginTop: 14,
  padding: 12,
  borderRadius: 14,
  background: "rgba(0,0,0,0.3)",
  display: "flex",
  justifyContent: "space-between",
};

const actions = {
  display: "flex",
  gap: 10,
  marginTop: 16,
};

const depositBtn = {
  flex: 1,
  padding: 12,
  borderRadius: 14,
  background: "#22c55e",
  border: "none",
  fontWeight: 700,
};

const withdrawBtn = {
  flex: 1,
  padding: 12,
  borderRadius: 14,
  background: "transparent",
  border: "1px solid #8b5cf6",
  color: "#c4b5fd",
};

const apyBox = {
  marginTop: 16,
  padding: 12,
  borderRadius: 14,
  background: "rgba(139,92,246,0.15)",
  display: "flex",
  justifyContent: "space-between",
};

const inviteBox = {
  marginTop: 18,
  padding: 12,
  borderRadius: 14,
  background: "rgba(0,0,0,0.35)",
};

const code = {
  fontSize: 12,
  wordBreak: "break-all" as const,
};