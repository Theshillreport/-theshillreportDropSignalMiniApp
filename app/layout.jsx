export const metadata = {
  title: "DropSignal",
  description: "Deposit. Earn. Signal."
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, background: "#0b1020", color: "white" }}>
        {children}
      </body>
    </html>
  );
}