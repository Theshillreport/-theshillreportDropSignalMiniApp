"use client";

export default function AppHeader({ address }) {
  return (
    <div style={{
      padding: 20,
      display: "flex",
      justifyContent: "space-between"
    }}>
      <strong>DropSignal</strong>
      <span>{address.slice(0,6)}...{address.slice(-4)}</span>
    </div>
  );
}