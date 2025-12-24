export default function AppHeader({ address }) {
  return (
    <div
      style={{
        width: "100%",
        padding: "12px 18px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        background: "rgba(10,15,40,0.85)",
        borderBottom: "1px solid rgba(255,255,255,0.1)",
        zIndex: 3,
        position: "relative",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <img
          src="/logo.png"
          alt="logo"
          style={{ width: 34, height: 34, borderRadius: 10 }}
        />
        <h2 style={{ margin: 0 }}>DropSignal</h2>
      </div>

      <div
        style={{
          padding: "6px 12px",
          borderRadius: 12,
          background: "rgba(255,255,255,0.1)",
        }}
      >
        {address.slice(0, 6)}...{address.slice(-4)}
      </div>
    </div>
  );
}
