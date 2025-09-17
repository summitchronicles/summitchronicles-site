'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Calendar, Clock, User, Tag, Share2, BookOpen } from 'lucide-react'
import { Post } from '@/lib/sanity/types'
import { urlFor } from '@/lib/sanity/client'
import { PortableText } from '@portabletext/react'

interface BlogPostProps {
  post: Post
  preview?: boolean
}

interface BlogPostListProps {
  posts: Post[]
  featured?: boolean
}

// Portable Text components for rich content rendering
const portableTextComponents = {
  types: {
    image: ({ value }: { value: any }) => (
      <div className="my-8">
        <Image
          src={urlFor(value).width(800).height(400).url()}
          alt={value.alt || 'Blog image'}
          width={800}
          height={400}
          className="rounded-xl shadow-spa-medium"
        />
        {value.caption && (
          <p className="text-sm text-spa-charcoal/70 mt-2 text-center italic">
            {value.caption}
          </p>
        )}
      </div>
    ),
    callout: ({ value }: { value: any }) => (
      <div className="my-6 p-6 bg-alpine-blue/5 border-l-4 border-alpine-blue rounded-r-xl">
        <div className="flex items-start gap-3">
          <BookOpen className="w-5 h-5 text-alpine-blue mt-1 flex-shrink-0" />
          <div className="prose prose-sm max-w-none">
            <PortableText value={value.text} />
          </div>
        </div>
      </div>
    )
  },
  block: {
    h2: ({ children }: { children: React.ReactNode }) => (
      <h2 className="text-2xl font-medium text-spa-charcoal mt-8 mb-4">
        {children}
      </h2>
    ),
    h3: ({ children }: { children: React.ReactNode }) => (
      <h3 className="text-xl font-medium text-spa-charcoal mt-6 mb-3">
        {children}
      </h3>
    ),
    normal: ({ children }: { children: React.ReactNode }) => (
      <p className="text-spa-charcoal/80 leading-relaxed mb-4">
        {children}
      </p>
    ),
    blockquote: ({ children }: { children: React.ReactNode }) => (
      <blockquote className="border-l-4 border-summit-gold pl-6 my-6 italic text-spa-charcoal/90">
        {children}
      </blockquote>
    )
  },
  marks: {
    link: ({ children, value }: { children: React.ReactNode; value?: any }) => (
      <Link
        href={value?.href || '#'}
        className="text-alpine-blue hover:text-alpine-blue/80 underline decoration-2 underline-offset-2"
        target={value?.blank ? '_blank' : '_self'}
        rel={value?.blank ? 'noopener noreferrer' : ''}
      >
        {children}
      </Link>
    ),
    strong: ({ children }: { children: React.ReactNode }) => (
      <strong className="font-semibold text-spa-charcoal">{children}</strong>
    ),
    emphasis: ({ children }: { children: React.ReactNode }) => (
      <em className="italic">{children}</em>
    )
  }
}

// Individual blog post component
export function BlogPost({ post, preview = false }: BlogPostProps) {
  const [isSharing, setIsSharing] = useState(false)

  const handleShare = async () => {
    setIsSharing(true)
    try {
      if (navigator.share) {
        await navigator.share({
          title: post.title,
          text: post.excerpt || '',
          url: window.location.href
        })
      } else {
        // Fallback: copy to clipboard
        await navigator.clipboard.writeText(window.location.href)
        // Could show a toast notification here
      }
    } catch (error) {
      console.error('Error sharing:', error)
    } finally {
      setIsSharing(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <article className="max-w-4xl mx-auto">
      {preview && (
        <div className="bg-summit-gold/20 border border-summit-gold/30 rounded-lg p-4 mb-8">
          <p className="text-spa-charcoal font-medium">
            📝 Preview Mode: This content is being edited
          </p>
        </div>
      )}

      {/* Header */}
      <header className="mb-8">
        <div className="flex flex-wrap items-center gap-4 text-sm text-spa-charcoal/70 mb-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <time dateTime={post.publishedAt}>
              {formatDate(post.publishedAt)}
            </time>
          </div>
          
          {post.readTime && (
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>{post.readTime} min read</span>
            </div>
          )}

          <div className="flex items-center gap-2">
            <User className="w-4 h-4" />
            <span>{post.author.name}</span>
          </div>

          <button
            onClick={handleShare}
            disabled={isSharing}
            className="flex items-center gap-2 px-3 py-1 rounded-full bg-spa-stone/20 hover:bg-spa-stone/30 transition-colors"
          >
            <Share2 className="w-4 h-4" />
            <span>{isSharing ? 'Sharing...' : 'Share'}</span>
          </button>
        </div>

        <h1 className="text-4xl md:text-5xl font-light text-spa-charcoal mb-4 leading-tight">
          {post.title}
        </h1>

        {post.excerpt && (
          <p className="text-xl text-spa-charcoal/80 leading-relaxed">
            {post.excerpt}
          </p>
        )}

        {post.categories && post.categories.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-6">
            {post.categories.map((category) => (
              <Link
                key={category._id}
                href={`/blog/category/${category.slug.current}`}
                className="inline-flex items-center gap-1 px-3 py-1 bg-alpine-blue/10 text-alpine-blue rounded-full text-sm hover:bg-alpine-blue/20 transition-colors"
              >
                <Tag className="w-3 h-3" />
                {category.title}
              </Link>
            ))}
          </div>
        )}
      </header>

      {/* Featured Image */}
      {post.mainImage && (
        <div className="mb-8 rounded-2xl overflow-hidden shadow-spa-medium">
          <Image
            src={urlFor(post.mainImage).width(1200).height(600).url()}
            alt={post.mainImage.alt || post.title}
            width={1200}
            height={600}
            className="w-full h-auto"
            priority
          />
        </div>
      )}

      {/* Content */}
      <div className="prose prose-lg max-w-none">
        {/* <PortableText value={post.body} components={portableTextComponents} /> */}
        <div>Content placeholder - PortableText temporarily disabled for build</div>
      </div>

      {/* Author Bio */}
      {post.author.bio && (
        <div className="mt-12 p-6 bg-spa-cloud/20 rounded-xl">
          <div className="flex items-start gap-4">
            {post.author.image && (
              <Image
                src={urlFor(post.author.image).width(80).height(80).url()}
                alt={post.author.name}
                width={80}
                height={80}
                className="rounded-full"
              />
            )}
            <div>
              <h3 className="text-lg font-medium text-spa-charcoal mb-2">
                About {post.author.name}
              </h3>
              <p className="text-spa-charcoal/80 leading-relaxed">
                {post.author.bio}
              </p>
            </div>
          </div>
        </div>
      )}
    </article>
  )
}

// Blog post list component
export function BlogPostList({ posts, featured = false }: BlogPostListProps) {
  const [displayedPosts, setDisplayedPosts] = useState(featured ? 6 : 9)

  const loadMore = () => {
    setDisplayedPosts(prev => prev + 6)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  return (
    <div className="space-y-8">
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {posts.slice(0, displayedPosts).map((post) => (
          <article
            key={post._id}
            className="group bg-white rounded-xl shadow-spa-soft hover:shadow-spa-medium transition-all duration-300"
          >
            <Link href={`/blog/${post.slug.current}`}>
              <div className="aspect-video relative overflow-hidden rounded-t-xl">
                {post.mainImage ? (
                  <Image
                    src={urlFor(post.mainImage).width(400).height(250).url()}
                    alt={post.mainImage.alt || post.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-alpine-blue/20 to-summit-gold/20 flex items-center justify-center">
                    <BookOpen className="w-12 h-12 text-spa-charcoal/30" />
                  </div>
                )}
              </div>
            </Link>

            <div className="p-6">
              <div className="flex items-center gap-4 text-sm text-spa-charcoal/70 mb-3">
                <time dateTime={post.publishedAt}>
                  {formatDate(post.publishedAt)}
                </time>
                {post.readTime && (
                  <>
                    <span>•</span>
                    <span>{post.readTime} min read</span>
                  </>
                )}
              </div>

              <Link href={`/blog/${post.slug.current}`}>
                <h3 className="text-lg font-medium text-spa-charcoal mb-3 group-hover:text-alpine-blue transition-colors line-clamp-2">
                  {post.title}
                </h3>
              </Link>

              {post.excerpt && (
                <p className="text-spa-charcoal/80 text-sm leading-relaxed mb-4 line-clamp-3">
                  {post.excerpt}
                </p>
              )}

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-spa-charcoal/70">
                  <User className="w-4 h-4" />
                  <span>{post.author.name}</span>
                </div>

                {post.categories && post.categories.length > 0 && (
                  <Link
                    href={`/blog/category/${post.categories[0].slug.current}`}
                    className="text-xs px-2 py-1 bg-alpine-blue/10 text-alpine-blue rounded-full hover:bg-alpine-blue/20 transition-colors"
                  >
                    {post.categories[0].title}
                  </Link>
                )}
              </div>
            </div>
          </article>
        ))}
      </div>

      {displayedPosts < posts.length && (
        <div className="text-center">
          <button
            onClick={loadMore}
            className="px-8 py-3 bg-alpine-blue text-white rounded-lg hover:bg-alpine-blue/90 transition-colors"
          >
            Load More Posts
          </button>
        </div>
      )}
    </div>
  )
}