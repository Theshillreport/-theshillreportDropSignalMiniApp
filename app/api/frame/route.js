export async function GET() {
  return new Response(
`<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />

    <meta property="og:title" content="Drop Signal Mini App" />
    <meta property="og:description" content="Deposit USDC · Earn on Base" />
    <meta property="og:type" content="website" />
    <meta property="og:image" content="https://theshillreport-drop-signal-mini-app.vercel.app/IMG_2667.jpeg" />

    <!-- FRAME aktivieren -->
    <meta name="fc:frame" content="vNext" />

    <!-- Bild -->
    <meta name="fc:frame:image" content="https://theshillreport-drop-signal-mini-app.vercel.app/IMG_2667.jpeg" />

    <!-- BUTTON -->
    <meta name="fc:frame:button:1" content="Open App" />
    <meta name="fc:frame:button:1:action" content="link" />
    <meta name="fc:frame:button:1:target" content="https://theshillreport-drop-signal-mini-app.vercel.app/" />
  </head>
  <body></body>
</html>`,
    {
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "no-store",
      },
    }
  );
}