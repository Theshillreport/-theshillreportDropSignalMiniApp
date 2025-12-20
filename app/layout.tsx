import "./globals.css";

export const metadata = {
  title: "DropSignal",
  description: "Deposit. Earn. Signal.",
  other: {
    "fc:frame": "vNext",
    "fc:frame:image": "https://DEINE-VERCEL-URL.vercel.app/preview.png",
    "fc:frame:button:1": "Open DropSignal",
    "fc:frame:button:1:action": "link",
    "fc:frame:button:1:target": "https://DEINE-VERCEL-URL.vercel.app",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          padding: 0,
          background: "#020617",
          color: "white",
        }}
      >
        {children}
      </body>
    </html>
  );
}