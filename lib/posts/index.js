// ─────────────────────────────────────────────────────────────────────────────
// lib/posts/index.js
//
// HOW TO ADD A NEW POST:
// 1. Copy _TEMPLATE.js → create new file in lib/posts/your-slug.js
// 2. Add one import line below
// 3. Add the imported variable to allPosts array
// Done — everything else updates automatically
// ─────────────────────────────────────────────────────────────────────────────

import { post as post1 } from "./chennai-to-pondicherry";

// ─── ADD NEW POSTS HERE ───────────────────────────────────────────────────────
// import { post as post2 } from "./chennai-to-ooty";
// import { post as post3 } from "./ecr-road-trip-chennai";
// import { post as post4 } from "./chennai-to-kodaikanal";
// (uncomment above lines one by one as you write each post)
// ─────────────────────────────────────────────────────────────────────────────

export const allPosts = [
  post1,
  // post2,
  // post3,
  // post4,
];

export function getPostBySlug(slug) {
  return allPosts.find((p) => p.slug === slug) || null;
}

export function getAllSlugs() {
  return allPosts.map((p) => p.slug);
}

export function getRecentPosts(count = 3) {
  return [...allPosts]
    .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt))
    .slice(0, count);
}
