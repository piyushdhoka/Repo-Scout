interface GitHubRepository {
  id: number
  name: string
  full_name: string
  description: string
  language: string
  stargazers_count: number
  forks_count: number
  watchers_count: number
  open_issues_count: number
  created_at: string
  updated_at: string
  pushed_at: string
  size: number
  private: boolean
  owner: {
    login: string
    id: number
    avatar_url: string
    type: string
  }
  topics: string[]
  license?: {
    name: string
    spdx_id: string
  }
  default_branch: string
  html_url: string
  homepage?: string
  subscribers_count: number
}

interface GitHubSearchResponse {
  total_count: number
  incomplete_results: boolean
  items: GitHubRepository[]
}

// Simple in-memory cache
const repoCache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

function getCachedRepoData(key: string): any | null {
  const cached = repoCache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }
  repoCache.delete(key);
  return null;
}

function setCachedRepoData(key: string, data: any): void {
  repoCache.set(key, { data, timestamp: Date.now() });
  if (repoCache.size > 50) {
    const firstKey = repoCache.keys().next().value;
    if (firstKey) repoCache.delete(firstKey);
  }
}

class GitHubRepositoryAPI {
  // Use proxy in production, direct API in development
  private readonly BASE_URL = import.meta.env.PROD ? '/api/github' : 'https://api.github.com'
  private readonly GITHUB_TOKEN = import.meta.env.VITE_GITHUB_TOKEN
  private rateLimitRemaining: number | null = null
  private rateLimitReset: number | null = null

  private async fetchFromGitHub(endpoint: string): Promise<any> {
    const headers: HeadersInit = {
      'Accept': 'application/vnd.github.v3+json',
    }

    // Add token in development
    if (!import.meta.env.PROD && this.GITHUB_TOKEN) {
      headers['Authorization'] = `token ${this.GITHUB_TOKEN}`
    }

    try {
      const response = await fetch(`${this.BASE_URL}${endpoint}`, {
        headers,
      })

      // Track rate limits
      const remaining = response.headers.get('x-ratelimit-remaining');
      const reset = response.headers.get('x-ratelimit-reset');
      if (remaining) this.rateLimitRemaining = parseInt(remaining);
      if (reset) this.rateLimitReset = parseInt(reset);

      if (!response.ok) {
        if (response.status === 403 && this.rateLimitRemaining === 0) {
          const resetDate = this.rateLimitReset ? new Date(this.rateLimitReset * 1000).toLocaleTimeString() : 'unknown';
          throw new Error(`GitHub API rate limit exceeded. Resets at ${resetDate}`);
        }
        if (response.status === 401) {
          throw new Error('Invalid GitHub API token.');
        }
        if (response.status === 422) {
          throw new Error('Invalid search query. Try simplifying your search.');
        }
        throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('GitHub API Error:', error);
      throw error;
    }
  }

  async searchRepositories({
    query = '',
    language = '',
    stars = '',
    sort = 'updated',
    order = 'desc',
    perPage = 20,
    page = 1
  }: {
    query?: string
    language?: string
    stars?: string
    sort?: 'stars' | 'forks' | 'updated' | 'created'
    order?: 'asc' | 'desc'
    perPage?: number
    page?: number
  } = {}): Promise<GitHubRepository[]> {
    // Check cache first
    const cacheKey = `repos_${query}_${language}_${stars}_${sort}_${perPage}_${page}`;
    const cached = getCachedRepoData(cacheKey);
    if (cached) {
      console.log('Using cached repository data');
      return cached;
    }

    // Build search query - simplified to avoid 422 errors
    const searchQueries: string[] = []

    if (query) {
      searchQueries.push(query)
    }

    if (language) {
      searchQueries.push(`language:${language}`)
    }

    if (stars) {
      searchQueries.push(`stars:>${stars}`)
    } else {
      // Default quality filter
      searchQueries.push('stars:>10')
    }

    // Only add pushed filter if no specific query
    if (!query && !language) {
      searchQueries.push('pushed:>2023-01-01')
    }

    const finalQuery = searchQueries.join(' ')

    const params = new URLSearchParams({
      q: finalQuery,
      sort,
      order,
      per_page: Math.min(perPage, 30).toString(), // Limit to 30 to reduce API load
      page: page.toString()
    })

    try {
      const response: GitHubSearchResponse = await this.fetchFromGitHub(
        `/search/repositories?${params}`
      )

      // Cache the results
      setCachedRepoData(cacheKey, response.items);

      return response.items
    } catch (error) {
      // Return empty array on error to avoid breaking UI
      console.error('Repository search failed:', error);
      return [];
    }
  }

  async getRepository(owner: string, repo: string): Promise<GitHubRepository> {
    return this.fetchFromGitHub(`/repos/${owner}/${repo}`)
  }

  async getTrendingRepositories(language = '', since = 'daily'): Promise<GitHubRepository[]> {
    const date = new Date()
    switch (since) {
      case 'weekly':
        date.setDate(date.getDate() - 7)
        break
      case 'monthly':
        date.setMonth(date.getMonth() - 1)
        break
      default: // daily
        date.setDate(date.getDate() - 1)
    }

    const createdDate = date.toISOString().split('T')[0]

    const searchQueries: string[] = []
    searchQueries.push(`created:>${createdDate}`)
    searchQueries.push('stars:>10')
    
    if (language) {
      searchQueries.push(`language:${language}`)
    }

    return this.searchRepositories({
      query: searchQueries.join(' '),
      sort: 'stars',
      perPage: 50
    })
  }

  async getRepositoriesByTopic(topic: string, sort = 'stars'): Promise<GitHubRepository[]> {
    return this.searchRepositories({
      query: `topic:${topic}`,
      sort: sort as any
    })
  }

  async getYCombinatorRepositories(): Promise<GitHubRepository[]> {
    // Simplified query - just use one topic instead of ORing many
    return this.searchRepositories({
      query: 'topic:ycombinator stars:>10',
      sort: 'stars',
      perPage: 50
    })
  }

  async getPopularRepositories(language = '', minStars = 1000): Promise<GitHubRepository[]> {
    const searchQueries: string[] = []
    searchQueries.push(`stars:>${minStars}`)
    
    if (language) {
      searchQueries.push(`language:${language}`)
    }

    return this.searchRepositories({
      query: searchQueries.join(' '),
      sort: 'stars',
      perPage: 50
    })
  }

  async searchRepositoriesByOwner(owner: string): Promise<GitHubRepository[]> {
    return this.searchRepositories({
      query: `user:${owner}`,
      sort: 'updated',
      perPage: 50
    })
  }

  // Mock data for when API is unavailable
  getMockRepositories(): GitHubRepository[] {
    return [
      {
        id: 1,
        name: 'react',
        full_name: 'facebook/react',
        description: 'A declarative, efficient, and flexible JavaScript library for building user interfaces.',
        language: 'JavaScript',
        stargazers_count: 225000,
        forks_count: 46000,
        watchers_count: 6700,
        open_issues_count: 800,
        created_at: '2013-05-24T16:41:05Z',
        updated_at: '2024-01-15T20:30:00Z',
        pushed_at: '2024-01-15T18:45:00Z',
        size: 150000,
        private: false,
        owner: {
          login: 'facebook',
          id: 69631,
          avatar_url: 'https://avatars.githubusercontent.com/u/69631?v=4',
          type: 'Organization'
        },
        topics: ['react', 'javascript', 'frontend', 'ui', 'library'],
        license: { name: 'MIT', spdx_id: 'MIT' },
        default_branch: 'main',
        html_url: 'https://github.com/facebook/react',
        subscribers_count: 7500
      },
      {
        id: 2,
        name: 'vscode',
        full_name: 'microsoft/vscode',
        description: 'Visual Studio Code - a lightweight but powerful source code editor.',
        language: 'TypeScript',
        stargazers_count: 159000,
        forks_count: 29000,
        watchers_count: 5400,
        open_issues_count: 6500,
        created_at: '2015-09-03T15:54:08Z',
        updated_at: '2024-01-15T22:15:00Z',
        pushed_at: '2024-01-15T21:30:00Z',
        size: 800000,
        private: false,
        owner: {
          login: 'microsoft',
          id: 6154722,
          avatar_url: 'https://avatars.githubusercontent.com/u/6154722?v=4',
          type: 'Organization'
        },
        topics: ['vscode', 'editor', 'typescript', 'electron', 'development'],
        default_branch: 'main',
        html_url: 'https://github.com/microsoft/vscode',
        subscribers_count: 12000
      },
      {
        id: 3,
        name: 'tensorflow',
        full_name: 'tensorflow/tensorflow',
        description: 'An Open Source Machine Learning Framework for Everyone.',
        language: 'C++',
        stargazers_count: 185000,
        forks_count: 75000,
        watchers_count: 9800,
        open_issues_count: 3500,
        created_at: '2015-11-09T01:22:21Z',
        updated_at: '2024-01-15T19:45:00Z',
        pushed_at: '2024-01-15T17:20:00Z',
        size: 650000,
        private: false,
        owner: {
          login: 'tensorflow',
          id: 15658638,
          avatar_url: 'https://avatars.githubusercontent.com/u/15658638?v=4',
          type: 'Organization'
        },
        topics: ['tensorflow', 'machine-learning', 'deep-learning', 'ai', 'python'],
        license: { name: 'Apache 2.0', spdx_id: 'Apache-2.0' },
        default_branch: 'master',
        html_url: 'https://github.com/tensorflow/tensorflow',
        subscribers_count: 5500
      }
    ]
  }
}

export const githubRepositoryAPI = new GitHubRepositoryAPI()
export type { GitHubRepository }