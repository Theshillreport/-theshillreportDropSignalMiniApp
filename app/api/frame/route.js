export async function GET() {
  return new Response(
    `
      <!DOCTYPE html>
      <html>
        <head>
          <meta property="og:title" content="Mein Frame" />
          <meta property="og:image" content="https://theshillreport-drop-signal-mini-app.vercel.app/" />

          <!-- Frame aktivieren -->
          <meta name="fc:frame" content="vNext" />

          <!-- Erste Seite (Image + Button) -->
          <meta name="fc:frame:image" content="https://DEINE-APP.vercel.app/frame-image.png" />
          <meta name="fc:frame:button:1" content="Deposit USDC" />
          <meta name="fc:frame:button:1:action" content="post" />
          <meta name="fc:frame:post_url" content="https://DEINE-APP.vercel.app/api/frame/step2" />
        </head>
        <body></body>
      </html>
    `,
    {
      headers: {
        "Content-Type": "text/html",
        "Cache-Control": "no-cache",
      },
    }
  );
}