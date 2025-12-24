export const dynamic = "force-dynamic";

export async function GET() {
  return new Response(
`<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />

    <meta property="og:title" content="DropSignal" />
    <meta property="og:type" content="website" />
    <meta property="og:image" content="https://theshillreport-drop-signal-mini-app.vercel.app/IMG_2667.jpeg" />
    <meta property="og:url" content="https://theshillreport-drop-signal-mini-app.vercel.app/api/frame" />
    <meta name="twitter:card" content="summary_large_image" />

    <!-- WICHTIG: Ohne das erkennt Warpcast KEINE Frames -->
    <meta name="of:accepts:farcaster" content="vNext" />

    <!-- Frame aktivieren -->
    <meta name="fc:frame" content="vNext" />
    <meta name="fc:frame:image" content="https://theshillreport-drop-signal-mini-app.vercel.app/IMG_2667.jpeg" />

    <!-- Button -->
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