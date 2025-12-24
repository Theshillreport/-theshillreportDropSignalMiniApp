"use client";

export default function AppHeader({ address }) {
  return (
    <div style={{
      zIndex: 3,
      position: "relative",
      padding: "20px 30px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center"
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <img src="/logo.png" style={{ width: 42, borderRadius: 8 }} />
        <strong style={{ fontSize: 20 }}>DropSignal</strong>
      </div>

      <div style={{
        background: "rgba(255,255,255,0.1)",
        padding: "10px 14px",
        borderRadius: 10,
        fontSize: 14
      }}>
        {address.slice(0,6)}...{address.slice(-4)}
      </div>
    </div>
  );
}