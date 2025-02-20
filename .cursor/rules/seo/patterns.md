---
description: SEO patterns and best practices
globs: "**/*.{ts,tsx}"
---

# SEO Guidelines

## Metadata

### Basic Metadata

✅ Add essential metadata to pages:

```tsx
// app/layout.tsx
import { Metadata } from "next"

export const metadata: Metadata = {
  title: {
    default: "Your App Name",
    template: "%s | Your App Name",
  },
  description: "Your app description",
  keywords: ["keyword1", "keyword2"],
  authors: [{ name: "Your Name" }],
  creator: "Your Name",
  publisher: "Your Company",
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://your-domain.com",
    title: "Your App Name",
    description: "Your app description",
    siteName: "Your App Name",
    images: [
      {
        url: "https://your-domain.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Your App Name",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Your App Name",
    description: "Your app description",
    creator: "@yourhandle",
    images: ["https://your-domain.com/twitter-image.jpg"],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
```

### Dynamic Metadata

✅ Generate dynamic metadata:

```tsx
// app/blog/[slug]/page.tsx
import { Metadata } from "next"
import { notFound } from "next/navigation"

interface Props {
  params: { slug: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getPost(params.slug)

  if (!post) {
    return {}
  }

  const { title, description, image } = post

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      publishedTime: post.publishedAt,
      authors: [post.author.name],
      images: [
        {
          url: image.url,
          width: image.width,
          height: image.height,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image.url],
    },
  }
}

export default async function BlogPost({ params }: Props) {
  const post = await getPost(params.slug)

  if (!post) {
    notFound()
  }

  return (
    <article>
      <h1>{post.title}</h1>
      {/* Post content */}
    </article>
  )
}
```

## Structured Data

### Article Schema

✅ Add structured data for articles:

```tsx
// components/article-schema.tsx
import { Article } from "schema-dts"

interface ArticleSchemaProps {
  article: {
    title: string
    description: string
    image: string
    datePublished: string
    dateModified: string
    author: {
      name: string
      url: string
    }
  }
}

export function ArticleSchema({ article }: ArticleSchemaProps) {
  const schema: Article = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.description,
    image: article.image,
    datePublished: article.datePublished,
    dateModified: article.dateModified,
    author: {
      "@type": "Person",
      name: article.author.name,
      url: article.author.url,
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

// Usage in page
export default function BlogPost({ post }: { post: Post }) {
  return (
    <>
      <ArticleSchema
        article={{
          title: post.title,
          description: post.description,
          image: post.image,
          datePublished: post.publishedAt,
          dateModified: post.updatedAt,
          author: {
            name: post.author.name,
            url: post.author.url,
          },
        }}
      />
      <article>{/* Post content */}</article>
    </>
  )
}
```

### Product Schema

✅ Add structured data for products:

```tsx
// components/product-schema.tsx
import { Product } from "schema-dts"

interface ProductSchemaProps {
  product: {
    name: string
    description: string
    image: string
    price: number
    currency: string
    sku: string
    brand: string
    availability: string
  }
}

export function ProductSchema({ product }: ProductSchemaProps) {
  const schema: Product = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.image,
    brand: {
      "@type": "Brand",
      name: product.brand,
    },
    offers: {
      "@type": "Offer",
      price: product.price,
      priceCurrency: product.currency,
      sku: product.sku,
      availability: product.availability,
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
```

## Semantic HTML

### Article Structure

✅ Use semantic HTML for articles:

```tsx
// components/blog-post.tsx
export function BlogPost({ post }: { post: Post }) {
  return (
    <article itemScope itemType="https://schema.org/Article">
      <header>
        <h1 itemProp="headline">{post.title}</h1>
        <div className="flex items-center gap-4">
          <img
            src={post.author.avatar}
            alt={post.author.name}
            className="h-10 w-10 rounded-full"
          />
          <div>
            <span itemProp="author">{post.author.name}</span>
            <time itemProp="datePublished" dateTime={post.publishedAt}>
              {formatDate(post.publishedAt)}
            </time>
          </div>
        </div>
      </header>
      <div itemProp="articleBody" className="prose prose-lg">
        {post.content}
      </div>
      <footer>
        <div className="flex items-center gap-4">
          <span>Tags:</span>
          {post.tags.map((tag) => (
            <a key={tag} href={`/tags/${tag}`} itemProp="keywords">
              {tag}
            </a>
          ))}
        </div>
      </footer>
    </article>
  )
}
```

## Image Optimization

### Responsive Images

✅ Optimize images for different devices:

```tsx
// components/optimized-image.tsx
import Image from "next/image"

interface OptimizedImageProps {
  src: string
  alt: string
  sizes?: string
  priority?: boolean
  className?: string
}

export function OptimizedImage({
  src,
  alt,
  sizes = "100vw",
  priority = false,
  className,
}: OptimizedImageProps) {
  return (
    <div className={cn("relative overflow-hidden", className)}>
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        className="object-cover"
        loading={priority ? "eager" : "lazy"}
      />
    </div>
  )
}

// Usage
export function HeroImage({ src, alt }: { src: string; alt: string }) {
  return (
    <OptimizedImage
      src={src}
      alt={alt}
      sizes="(min-width: 1280px) 1200px, 100vw"
      priority
      className="aspect-[16/9]"
    />
  )
}
```

## Performance

### Loading Optimization

✅ Optimize loading performance:

```tsx
// app/blog/page.tsx
import { Suspense } from "react"

export default async function BlogPage() {
  return (
    <main>
      {/* Critical content */}
      <h1>Blog</h1>

      {/* Less critical content */}
      <Suspense fallback={<PostsSkeleton />}>
        <Posts />
      </Suspense>

      {/* Deferred content */}
      <Suspense>
        <RelatedPosts />
      </Suspense>
    </main>
  )
}
```

### Route Segments

✅ Use route segments for better loading:

```tsx
// app/@modal/(.)posts/[id]/page.tsx
export default function PostModal({ params }: { params: { id: string } }) {
  return (
    <Dialog>
      <Suspense fallback={<PostSkeleton />}>
        <Post id={params.id} />
      </Suspense>
    </Dialog>
  )
}

// app/posts/[id]/page.tsx
export default function PostPage({ params }: { params: { id: string } }) {
  return (
    <main>
      <Suspense fallback={<PostSkeleton />}>
        <Post id={params.id} />
      </Suspense>
    </main>
  )
}
```
