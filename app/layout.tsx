export const metadata = {
  title: "DropSignal",
  description: "Discover daily drops on Farcaster",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: "Inter, sans-serif" }}>
        {children}
      </body>
    </html>
  );
}
