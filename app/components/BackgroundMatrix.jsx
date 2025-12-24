"use client";

export default function BackgroundMatrix() {
  return (
    <div style={{
      position: "absolute",
      inset: 0,
      background:
        "radial-gradient(circle at top left, #ff9f1c20 0%, transparent 55%), radial-gradient(circle at bottom right, #38bdf820 0%, transparent 55%)",
      zIndex: 1
    }} />
  );
}