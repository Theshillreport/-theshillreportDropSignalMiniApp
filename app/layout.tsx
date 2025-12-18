export const metadata = {
  title: "DropSignal",
  description: "Daily onchain drops & signals",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body style={{
        margin: 0,
        padding: 0,
        background: "#0b0b0f",
        color: "#ffffff",
        fontFamily: "system-ui, sans-serif"
      }}>
        {children}
      </body>
    </html>
  );
}