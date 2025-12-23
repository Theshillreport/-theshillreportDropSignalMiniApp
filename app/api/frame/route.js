export async function GET() {
  return new Response(
`<!DOCTYPE html>
<html>
  <head>
    <meta property="og:title" content="Mein Frame" />

    <!-- FRAME AKTIVIEREN -->
    <meta name="fc:frame" content="vNext" />

    <!-- DEIN BILD -->
    <meta name="fc:frame:image" content="https://DEINE-APP.vercel.app/IMG_2667.jpeg" />

    <!-- BUTTON -->
    <meta name="fc:frame:button:1" content="Deposit USDC" />
    <meta name="fc:frame:button:1:action" content="post" />
    <meta name="fc:frame:post_url" content="https://DEINE-APP.vercel.app/api/frame/step2" />
  </head>
  <body></body>
</html>`,
    { headers: { "Content-Type": "text/html", "Cache-Control": "no-cache" } }
  );
}