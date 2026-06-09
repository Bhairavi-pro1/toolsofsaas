// Fetch all live tools, ordered by display order
export const TOOLS_QUERY = `*[_type == "tool"] | order(order asc) {
  _id,
  title,
  slug,
  description,
  iconImage,
  badge,
  tag,
  href,
  order
}`;

// Fetch all upcoming/coming-soon tools, ordered by display order
export const UPCOMING_TOOLS_QUERY = `*[_type == "upcomingTool"] | order(order asc) {
  _id,
  title,
  slug,
  description,
  iconImage,
  tag,
  order
}`;

// Fetch all published blog posts ordered by publish date desc
export const POSTS_QUERY = `*[_type == "post" && !(_id in path("drafts.**"))] | order(publishedAt desc) {
  _id,
  title,
  "slug": slug.current,
  publishedAt,
  description,
  mainImage
}`;

// Fetch a single published blog post by slug
export const POST_QUERY = `*[_type == "post" && slug.current == $slug && !(_id in path("drafts.**"))][0] {
  _id,
  title,
  "slug": slug.current,
  publishedAt,
  description,
  mainImage,
  body
}`;

