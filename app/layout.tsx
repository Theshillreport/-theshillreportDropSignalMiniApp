import "./globals.css";

export const metadata = {
  title: "DropSignal",
  description: "Deposit. Earn. Signal."
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}