import { Helmet } from 'react-helmet-async'

interface SEOProps {
  title?: string
  description?: string
  keywords?: string
  ogImage?: string
  ogType?: 'website' | 'article'
  twitterCard?: 'summary' | 'summary_large_image'
  canonicalUrl?: string
}

const defaultSEO = {
  title: 'Repo Scout - Discover Amazing GitHub Repositories',
  description: 'Find trending GitHub repositories with advanced search and discovery features. Explore open-source projects across multiple programming languages and technologies.',
  keywords: 'GitHub, repositories, open source, search, discovery, trending, programming, development, code',
  ogImage: '/repo_logo.png',
  siteName: 'Repo Scout',
  twitterHandle: '@piyush_dhoka27',
}

export function SEO({
  title,
  description = defaultSEO.description,
  keywords = defaultSEO.keywords,
  ogImage = defaultSEO.ogImage,
  ogType = 'website',
  twitterCard = 'summary_large_image',
  canonicalUrl,
}: SEOProps) {
  const fullTitle = title ? `${title} | Repo Scout` : defaultSEO.title
  const currentUrl = canonicalUrl || window.location.href

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:site_name" content={defaultSEO.siteName} />

      {/* Twitter */}
      <meta property="twitter:card" content={twitterCard} />
      <meta property="twitter:url" content={currentUrl} />
      <meta property="twitter:title" content={fullTitle} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={ogImage} />
      <meta property="twitter:creator" content={defaultSEO.twitterHandle} />

      {/* Canonical URL */}
      <link rel="canonical" href={currentUrl} />

      {/* Additional SEO Tags */}
      <meta name="robots" content="index, follow" />
      <meta name="language" content="English" />
      <meta name="revisit-after" content="7 days" />
      <meta name="author" content="Piyush Dhoka" />

      {/* Viewport for mobile */}
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      
      {/* Theme color */}
      <meta name="theme-color" content="#000000" />
    </Helmet>
  )
}
