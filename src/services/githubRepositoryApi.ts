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

class GitHubRepositoryAPI {
  private readonly BASE_URL = 'https://api.github.com'
  private readonly TOKEN = import.meta.env.VITE_GITHUB_API_KEY

  private async fetchFromGitHub(endpoint: string): Promise<any> {
    const headers: HeadersInit = {
      'Accept': 'application/vnd.github.v3+json',
    }

    if (this.TOKEN) {
      headers['Authorization'] = `token ${this.TOKEN}`
    }

    try {
      const response = await fetch(`${this.BASE_URL}${endpoint}`, {
        headers,
        cache: 'no-store'
      })

      if (!response.ok) {
        if (response.status === 403) {
          throw new Error('GitHub API rate limit exceeded. Please try again later.')
        }
        if (response.status === 401) {
          throw new Error('Invalid GitHub API token.')
        }
        throw new Error(`GitHub API error: ${response.status} ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.error('GitHub API Error:', error)
      throw error
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
    // Build search query
    const searchQueries: string[] = []

    if (query) {
      searchQueries.push(`${query} in:name,description`)
    }

    if (language) {
      searchQueries.push(`language:${language}`)
    }

    if (stars) {
      searchQueries.push(`stars:>${stars}`)
    }

    // Add quality filters - use simpler query to avoid 422 errors
    // Only add basic filters to keep query length manageable
    if (!query && !language) {
      // Default trending query: just show popular repos
      searchQueries.push('stars:>1000')
      searchQueries.push('pushed:>2023-01-01')
    } else {
      // For user searches, just add a star filter for quality
      searchQueries.push('stars:>10')
    }

    const finalQuery = searchQueries.join(' ')

    const params = new URLSearchParams({
      q: finalQuery,
      sort,
      order,
      per_page: perPage.toString(),
      page: page.toString()
    })

    const response: GitHubSearchResponse = await this.fetchFromGitHub(
      `/search/repositories?${params}`
    )

    return response.items
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