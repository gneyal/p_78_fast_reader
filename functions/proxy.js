export async function onRequest(context) {
  const url = new URL(context.request.url);
  const pdfUrl = url.searchParams.get('url');

  if (!pdfUrl) {
    return new Response('Missing url parameter', { status: 400 });
  }

  // Only allow archive.org URLs for security
  if (!pdfUrl.startsWith('https://archive.org/')) {
    return new Response('Only archive.org URLs allowed', { status: 403 });
  }

  try {
    const response = await fetch(pdfUrl);
    const pdf = await response.arrayBuffer();

    return new Response(pdf, {
      headers: {
        'Content-Type': 'application/pdf',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'public, max-age=86400',
      },
    });
  } catch (error) {
    return new Response('Failed to fetch PDF', { status: 500 });
  }
}
