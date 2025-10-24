export function buildSeoFromYoast(yh = {}, fallback = {}) {
  const robots = yh.robots || {};
  const img = yh?.og_image?.[0]?.url || fallback.image;

  const robotsContent = [
    robots.index === false ? 'noindex' : 'index',
    robots.follow === false ? 'nofollow' : 'follow',
    robots['max-snippet'] ? `max-snippet:${robots['max-snippet']}` : null,
    robots['max-image-preview'] ? `max-image-preview:${robots['max-image-preview']}` : null,
    robots['max-video-preview'] ? `max-video-preview:${robots['max-video-preview']}` : null,
  ].filter(Boolean).join(',');

  return {
    title: yh.title || fallback.title,
    description: yh.description || fallback.description,
    canonical: yh.canonical,
    robotsContent,
    og: {
      title: yh.og_title || yh.title || fallback.title,
      description: yh.og_description || yh.description || fallback.description,
      image: img,
      type: yh.og_type || 'article',
    },
    twitter: {
      card: yh.twitter_card || 'summary_large_image',
    },
    schema: yh.schema, // objeto JSON-LD
  };
}
