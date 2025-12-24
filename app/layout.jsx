export const metadata = {
  title: "Drop Signal Mini App",
  description: "Deposit USDC · Earn Yield · Built on Base",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          background: "#050b1e",
        }}
      >
        {children}
      </body>
    </html>
  );
}
