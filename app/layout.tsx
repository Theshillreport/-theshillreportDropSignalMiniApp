export const metadata = {
  title: "DropSignal",
  description: "Daily onchain drops",
  other: {
    "fc:frame": "vNext",
    "fc:frame:image": "https://drop-signal.vercel.app/og.png",
    "fc:frame:button:1": "Open Drops",
    "fc:frame:post_url": "https://drop-signal.vercel.app"
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>{children}</body>
    </html>
  );
}