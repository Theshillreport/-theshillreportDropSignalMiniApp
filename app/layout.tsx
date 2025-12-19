export const metadata = {
  title: "DropSignal",
  description: "Daily onchain drops",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}