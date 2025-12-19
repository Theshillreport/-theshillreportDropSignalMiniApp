import "./globals.css";

export const metadata = {
  title: "DropSignal",
  description: "Daily onchain drops. Signal > Noise.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}