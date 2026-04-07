import Link from "next/link";
import { notFound } from "next/navigation";
import { allPosts, getPostBySlug } from "@/lib/posts/index";
import styles from "../blog.module.css";

export async function generateStaticParams() {
  return allPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }) {
  const p = await params;
  const post = getPostBySlug(p.slug);
  if (!post) return { title: "Not Found" };
  return {
    title: post.metaTitle,
    description: post.metaDescription,
    alternates: { canonical: `https://www.mmmiles.com/blog/${post.slug}` },
    openGraph: {
      title: post.metaTitle,
      description: post.metaDescription,
      url: `https://www.mmmiles.com/blog/${post.slug}`,
      type: "article",
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      images: post.coverImage
        ? [{ url: `https://www.mmmiles.com${post.coverImage}`, alt: post.coverImageAlt }]
        : [],
    },
  };
}

// ─── Content Block Renderer ────────────────────────────────────────────────────
function Block({ block, s }) {
  switch (block.type) {

    case "intro":
      return <p className={s.blockIntro}>{block.text}</p>;

    case "h2":
      return <h2 className={s.blockH2}>{block.text}</h2>;

    case "h3":
      return <h3 className={s.blockH3}>{block.text}</h3>;

    case "paragraph":
      return <p className={s.blockParagraph}>{block.text}</p>;

    case "list":
      return (
        <ul className={s.blockList}>
          {block.items.map((item, i) => <li key={i}>{item}</li>)}
        </ul>
      );

    case "table":
      return (
        <div className={s.tableWrapper}>
          <table className={s.blockTable}>
            <thead>
              <tr>
                {block.headers.map((h, i) => <th key={i}>{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row, i) => (
                <tr key={i}>
                  {row.map((cell, j) => <td key={j}>{cell}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );

    case "tip":
      return (
        <div className={s.blockTip}>
          <span className={s.blockTipIcon}>💡</span>
          <p className={s.blockTipText}>{block.text}</p>
        </div>
      );

    case "warning":
      return (
        <div className={s.blockWarning}>
          <span style={{ fontSize: 18, flexShrink: 0 }}>⚠️</span>
          <p className={s.blockWarningText}>{block.text}</p>
        </div>
      );

    case "cars":
      return (
        <div className={s.carCardGrid}>
          {block.items.map((car) => (
            <div key={car.slug} className={s.carCard}>
              <Link href={`/rent/${car.slug}/${car.city}`} className={s.carCardName}>
                {car.name}
              </Link>
              <p className={s.carCardReason}>{car.reason}</p>
              <Link href={`/rent/${car.slug}/${car.city}`} className={s.carCardButton}>
                View {car.name} →
              </Link>
            </div>
          ))}
        </div>
      );

    case "image":
      return (
        <figure className={s.blockFigure}>
          <img src={block.src} alt={block.alt} className={s.blockFigureImg} />
          {block.caption && <figcaption className={s.blockFigureCaption}>{block.caption}</figcaption>}
        </figure>
      );

    case "cta":
      return (
        <div className={s.blockCta}>
          <p className={s.blockCtaText}>{block.text}</p>
          <Link href={block.buttonLink} className={s.blockCtaButton}>
            {block.buttonText}
          </Link>
        </div>
      );

    default:
      return null;
  }
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default async function BlogPostPage({ params }) {
  const p = await params;
  const post = getPostBySlug(p.slug);
  if (!post) notFound();

  const otherPosts = allPosts.filter((x) => x.slug !== post.slug).slice(0, 3);

  // Schemas
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.metaDescription,
    image: post.coverImage ? `https://www.mmmiles.com${post.coverImage}` : undefined,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    author: { "@type": "Organization", name: "MM Miles", url: "https://www.mmmiles.com" },
    publisher: {
      "@type": "Organization",
      name: "MM Miles",
      logo: { "@type": "ImageObject", url: "https://www.mmmiles.com/goldlogo.png" },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://www.mmmiles.com/blog/${post.slug}`,
    },
  };

  const faqSchema = post.faqs?.length > 0
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: post.faqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: { "@type": "Answer", text: faq.answer },
        })),
      }
    : null;

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://www.mmmiles.com" },
      { "@type": "ListItem", position: 2, name: "Blog", item: "https://www.mmmiles.com/blog" },
      { "@type": "ListItem", position: 3, name: post.title, item: `https://www.mmmiles.com/blog/${post.slug}` },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      {faqSchema && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <div className={styles.postContainer}>
        <div className={styles.postInner}>

          {/* Breadcrumb */}
          <nav className={styles.postBreadcrumb}>
            <Link href="/">Home</Link> &rsaquo;{" "}
            <Link href="/blog">Blog</Link> &rsaquo;{" "}
            <span>{post.title.replace(" | MM Miles", "")}</span>
          </nav>

          {/* Tags */}
          <div className={styles.postTags}>
            {post.tags?.map((tag) => (
              <span key={tag} className={styles.postTag}>{tag}</span>
            ))}
          </div>

          {/* Title */}
          <h1 className={styles.postTitle}>
            {post.title.replace(" | MM Miles", "")}
          </h1>

          {/* Meta */}
          <div className={styles.postMeta}>
            <span>By {post.author}</span>
            <span>
              {new Date(post.publishedAt).toLocaleDateString("en-IN", {
                day: "numeric", month: "long", year: "numeric",
              })}
            </span>
            <span>{post.readTime}</span>
          </div>

          {/* Cover Image */}
          {post.coverImage && (
            <img
              src={post.coverImage}
              alt={post.coverImageAlt}
              className={styles.postCoverImage}
            />
          )}

          {/* Content Blocks */}
          <article>
            {post.content.map((block, i) => (
              <Block key={i} block={block} s={styles} />
            ))}
          </article>

          {/* FAQ Section */}
          {post.faqs?.length > 0 && (
            <section className={styles.faqSection}>
              <h2 className={styles.faqSectionTitle}>Frequently Asked Questions</h2>
              {post.faqs.map(({ question, answer }, i) => (
                <details key={i} className={styles.faqItem}>
                  <summary>{question}</summary>
                  <p>{answer}</p>
                </details>
              ))}
            </section>
          )}

          {/* Book Your Car */}
          <section className={styles.bookSection}>
            <h3 className={styles.bookSectionTitle}>Book Your Self Drive Car</h3>
            <div className={styles.bookLinks}>
              {post.relatedCity && (
                <Link href={`/cities/${post.relatedCity.slug}`} className={styles.bookLink}>
                  Self Drive Cars in {post.relatedCity.name} →
                </Link>
              )}
              {post.relatedCars?.map((car) => (
                <Link
                  key={car.slug}
                  href={`/rent/${car.slug}/${post.relatedCity?.slug || "chennai"}`}
                  className={styles.bookLink}
                >
                  Rent {car.name} →
                </Link>
              ))}
            </div>
          </section>

          {/* More Posts */}
          {otherPosts.length > 0 && (
            <section className={styles.morePostsSection}>
              <h3 className={styles.morePostsTitle}>More Road Trip Guides</h3>
              <div className={styles.morePostsGrid}>
                {otherPosts.map((x) => (
                  <Link key={x.slug} href={`/blog/${x.slug}`} className={styles.morePostCard}>
                    <div className={styles.morePostCardTitle}>
                      {x.title.replace(" | MM Miles", "")}
                    </div>
                    <div className={styles.morePostCardExcerpt}>{x.excerpt}</div>
                  </Link>
                ))}
              </div>
            </section>
          )}

        </div>
      </div>
    </>
  );
}
