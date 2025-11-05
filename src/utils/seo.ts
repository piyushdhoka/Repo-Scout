interface MetaTags {
  title?: string
  description?: string
  keywords?: string[]
  image?: string
  url?: string
  type?: string
  siteName?: string
  author?: string
  publishedTime?: string
  modifiedTime?: string
}

interface StructuredData {
  '@context': string
  '@type': string
  name?: string
  description?: string
  url?: string
  image?: string
  author?: {
    '@type': string
    name: string
    url?: string
  }
  publisher?: {
    '@type': string
    name: string
    logo?: {
      '@type': string
      url: string
    }
  }
  datePublished?: string
  dateModified?: string
  mainEntityOfPage?: {
    '@type': string
    '@id': string
  }
  [key: string]: any
}

export class SEOUtils {
  private static baseUrl = 'https://reposcout.com'
  private static defaultImage = 'https://reposcout.com/og-image.png'

  /**
   * Generate meta tags for a page
   */
  static generateMetaTags(meta: MetaTags): Record<string, string> {
    const {
      title = 'Repo Scout - Find Your Next Open Source Contribution',
      description = 'Find your next open source contribution with Repo Scout. Discover curated GitHub issues from Y Combinator startups and top open source projects.',
      keywords = [],
      image = this.defaultImage,
      url = this.baseUrl,
      type = 'website',
      siteName = 'Repo Scout',
      author = 'Repo Scout',
      publishedTime,
      modifiedTime
    } = meta

    const tags: Record<string, string> = {
      'title': title,
      'description': description,
      'keywords': keywords.join(', '),
      'author': author,
      'og:title': title,
      'og:description': description,
      'og:image': image,
      'og:image:width': '1200',
      'og:image:height': '630',
      'og:url': url,
      'og:type': type,
      'og:site_name': siteName,
      'twitter:card': 'summary_large_image',
      'twitter:title': title,
      'twitter:description': description,
      'twitter:image': image
    }

    if (publishedTime) {
      tags['article:published_time'] = publishedTime
    }

    if (modifiedTime) {
      tags['article:modified_time'] = modifiedTime
    }

    return tags
  }

  /**
   * Generate structured data (JSON-LD) for various content types
   */
  static generateStructuredData(type: 'website' | 'article' | 'organization' | 'software', data: Partial<StructuredData>): StructuredData {
    const baseStructuredData: StructuredData = {
      '@context': 'https://schema.org',
      '@type': type === 'website' ? 'WebSite' : type === 'article' ? 'Article' : type === 'organization' ? 'Organization' : 'SoftwareApplication',
      name: data.name || 'Repo Scout',
      description: data.description || 'Find your next open source contribution with Repo Scout',
      url: data.url || this.baseUrl,
      image: data.image || this.defaultImage
    }

    if (type === 'website') {
      return {
        ...baseStructuredData,
        potentialAction: {
          '@type': 'SearchAction',
          target: `${this.baseUrl}/search?q={search_term_string}`,
          'query-input': 'required name=search_term_string'
        },
        sameAs: [
          'https://github.com/vivekd16/Repo-Scout'
        ]
      }
    }

    if (type === 'article') {
      return {
        ...baseStructuredData,
        author: data.author || {
          '@type': 'Organization',
          name: 'Repo Scout Team'
        },
        publisher: data.publisher || {
          '@type': 'Organization',
          name: 'Repo Scout',
          logo: {
            '@type': 'ImageObject',
            url: `${this.baseUrl}/logo.png`
          }
        },
        datePublished: data.datePublished,
        dateModified: data.dateModified,
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': data.url || this.baseUrl
        }
      }
    }

    if (type === 'software') {
      return {
        ...baseStructuredData,
        applicationCategory: 'DeveloperApplication',
        operatingSystem: 'Web Browser',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD'
        },
        author: data.author || {
          '@type': 'Organization',
          name: 'Repo Scout Team'
        }
      }
    }

    return baseStructuredData
  }

  /**
   * Generate canonical URL
   */
  static generateCanonicalUrl(path: string = ''): string {
    const cleanPath = path.startsWith('/') ? path.slice(1) : path
    return cleanPath ? `${this.baseUrl}/${cleanPath}` : this.baseUrl
  }

  /**
   * Generate breadcrumbs structured data
   */
  static generateBreadcrumbs(breadcrumbs: Array<{ name: string; url: string }>) {
    const itemListElement = breadcrumbs.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url
    }))

    return {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement
    }
  }

  /**
   * Generate FAQ structured data
   */
  static generateFAQ(faqs: Array<{ question: string; answer: string }>) {
    return {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqs.map(faq => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: faq.answer
        }
      }))
    }
  }

  /**
   * Generate Open Graph image URL with text overlay
   */
  static generateOGImage(title: string, description: string): string {
    const params = new URLSearchParams({
      title,
      description,
      theme: 'dark'
    })

    return `${this.baseUrl}/api/og?${params.toString()}`
  }

  /**
   * Extract text content for SEO
   */
  static extractTextContent(html: string, maxLength: number = 160): string {
    // Remove HTML tags
    const text = html.replace(/<[^>]*>/g, '')

    // Remove extra whitespace
    const cleanText = text.replace(/\s+/g, ' ').trim()

    // Truncate to max length
    if (cleanText.length <= maxLength) {
      return cleanText
    }

    return cleanText.substring(0, maxLength - 3) + '...'
  }

  /**
   * Generate slug from title
   */
  static generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '')
  }

  /**
   * Validate and fix URL
   */
  static normalizeUrl(url: string, base: string = this.baseUrl): string {
    if (!url) return base

    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url
    }

    if (url.startsWith('/')) {
      return `${base}${url}`
    }

    return `${base}/${url}`
  }

  /**
   * Generate robots meta content
   */
  static generateRobotsMeta(index: boolean = true, follow: boolean = true): string {
    const rules = []

    if (index) {
      rules.push('index')
    } else {
      rules.push('noindex')
    }

    if (follow) {
      rules.push('follow')
    } else {
      rules.push('nofollow')
    }

    return rules.join(', ')
  }

  /**
   * Get page-specific SEO configuration
   */
  static getPageSEO(page: string, customData?: Partial<MetaTags>): Record<string, string> {
    const pageConfigs: Record<string, MetaTags> = {
      home: {
        title: 'Repo Scout - Find Your Next Open Source Contribution',
        description: 'Find your next open source contribution with Repo Scout. Discover curated GitHub issues from Y Combinator startups and top open source projects.',
        keywords: ['open source', 'GitHub issues', 'contributions', 'Y Combinator', 'programming']
      },
      search: {
        title: 'Search Open Source Issues - Repo Scout',
        description: 'Search and filter through thousands of open source issues from top projects. Find the perfect contribution opportunity for your skills.',
        keywords: ['search', 'GitHub issues', 'open source', 'contributions', 'programming']
      },
      auth: {
        title: 'Sign In - Repo Scout',
        description: 'Sign in to Repo Scout to track your open source contributions and save your search preferences.',
        keywords: ['sign in', 'login', 'open source', 'contributions']
      },
      guidance: {
        title: 'Getting Started - Repo Scout',
        description: 'Learn how to use Repo Scout to find and contribute to open source projects. Tips and best practices for contributors.',
        keywords: ['guide', 'tutorial', 'getting started', 'open source']
      }
    }

    const config = pageConfigs[page] || pageConfigs.home
    const finalConfig = { ...config, ...customData }

    return this.generateMetaTags(finalConfig)
  }
}