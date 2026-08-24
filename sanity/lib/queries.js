// Fetch all live tools, ordered by display order
export const TOOLS_QUERY = `*[_type == "tool"] | order(order asc) {
  _id,
  title,
  "slug": slug.current,
  description,
  iconImage,
  badge,
  tag,
  href,
  author,
  authorAvatar,
  subtitle,
  pricing,
  order
}`;

// Fetch all upcoming/coming-soon tools, ordered by display order
export const UPCOMING_TOOLS_QUERY = `*[_type == "upcomingTool"] | order(order asc) {
  _id,
  title,
  "slug": slug.current,
  description,
  iconImage,
  tag,
  order
}`;

// Fetch a single tool (or upcoming tool) by slug
export const TOOL_BY_SLUG_QUERY = `*[_type in ["tool", "upcomingTool"] && slug.current == $slug][0] {
  _id,
  _type,
  title,
  "slug": slug.current,
  description,
  body,
  longDescription,
  features,
  pricing,
  platform,
  accessType,
  accountRequirement,
  officialDomain,
  verificationStatus,
  iconImage,
  badge,
  tag,
  href,
  author,
  authorAvatar,
  subtitle,
  _createdAt,
  _updatedAt
}`;

// Fetch related tools excluding the current tool
export const RELATED_TOOLS_QUERY = `*[_type == "tool" && slug.current != $slug] | order(order asc)[0...4] {
  _id,
  title,
  "slug": slug.current,
  description,
  iconImage,
  badge,
  tag,
  href,
  author,
  authorAvatar,
  subtitle,
  pricing
}`;

// Fetch all tool slugs for sitemap and static generation
export const ALL_TOOL_SLUGS_QUERY = `*[_type in ["tool", "upcomingTool"] && defined(slug.current)][].slug.current`;

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

