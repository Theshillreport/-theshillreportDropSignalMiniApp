export async function POST() {
  return new Response(
`<!DOCTYPE html>
<html>
  <head>
    <meta name="fc:frame" content="vNext" />
    <meta name="fc:frame:image" content="https://theshillreport-drop-signal-mini-app.vercel.app/IMG_2667.jpeg" />
    <meta name="fc:frame:button:1" content="Thanks!" />
  </head>
  <body></body>
</html>`,
    {
      headers: {
        "Content-Type": "text/html",
        "Cache-Control": "no-cache",
      },
    }
  );
}
