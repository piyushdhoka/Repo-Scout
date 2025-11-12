// Always use GitHub API directly (no proxy needed)
const GITHUB_API_BASE = 'https://api.github.com';
const GITHUB_TOKEN = import.meta.env.VITE_GITHUB_TOKEN;

// Rate limit tracking
let rateLimitRemaining: number | null = null;
let rateLimitReset: number | null = null;

// Simple in-memory cache
const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

function getCachedData(key: string): any | null {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }
  cache.delete(key);
  return null;
}

function setCachedData(key: string, data: any): void {
  cache.set(key, { data, timestamp: Date.now() });
  // Clean old entries if cache gets too large
  if (cache.size > 100) {
    const firstKey = cache.keys().next().value;
    if (firstKey) cache.delete(firstKey);
  }
}

async function fetchWithRetry(
  url: string, 
  headers: Record<string, string>, 
  retries = 2
): Promise<Response> {
  for (let i = 0; i <= retries; i++) {
    try {
      const res = await fetch(url, { headers });
      
      // Track rate limits
      const remaining = res.headers.get('x-ratelimit-remaining');
      const reset = res.headers.get('x-ratelimit-reset');
      if (remaining) rateLimitRemaining = parseInt(remaining);
      if (reset) rateLimitReset = parseInt(reset);
      
      if (res.ok) return res;
      
      // Rate limited - wait if we have retries left
      if (res.status === 403 && remaining === '0' && i < retries) {
        const waitTime = reset ? (parseInt(reset) * 1000 - Date.now()) : 60000;
        console.warn(`Rate limited. Waiting ${Math.ceil(waitTime / 1000)}s...`);
        await new Promise(resolve => setTimeout(resolve, Math.min(waitTime, 60000)));
        continue;
      }
      
      // Other errors - exponential backoff
      if (res.status >= 500 && i < retries) {
        await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, i)));
        continue;
      }
      
      return res;
    } catch (error) {
      if (i === retries) throw error;
      await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, i)));
    }
  }
  throw new Error('Max retries exceeded');
}

export interface GitHubIssue {
  id: number;
  title: string;
  html_url: string;
  repository_url: string;
  labels: Array<{
    name: string;
    color: string;
  }>;
  user: {
    login: string;
  };
  created_at: string;
  comments: number;
  state: string;
}

export interface SearchIssuesResponse {
  total_count: number;
  incomplete_results: boolean;
  items: GitHubIssue[];
}

export interface ProcessedIssue {
  title: string;
  repo: string;
  labels: string[];
  language: string;
  url: string;
  author: string;
  createdAt: string;
  comments: number;
}

export interface GitHubRepoData {
  stargazers_count: number;
  name: string;
  full_name: string;
  html_url: string;
}

export const searchGitHubIssues = async (
  language?: string,
  labels?: string[],
  query?: string,
  perPage: number = 30,
  page: number = 1,
  organization?: string
): Promise<ProcessedIssue[]> => {
  try {
    // Build search query
    let searchQuery = 'is:issue is:open';
    
    if (organization) {
      searchQuery += ` org:${organization}`;
    }
    
    if (language) {
      searchQuery += ` language:${language}`;
    }
    
    if (labels && labels.length > 0) {
      labels.forEach(label => {
        searchQuery += ` label:"${label}"`;
      });
    }
    
    if (query && query.trim()) {
      searchQuery += ` ${query.trim()}`;
    }

    // Create cache key
    const cacheKey = `issues_${searchQuery}_${perPage}_${page}`;
    const cached = getCachedData(cacheKey);
    if (cached) {
      console.log('Using cached issues data');
      return cached;
    }

    // Sort by created date (newest first)
    const endpoint = `search/issues?q=${encodeURIComponent(searchQuery)}&sort=created&order=desc&per_page=${perPage}&page=${page}`;
    const url = `${GITHUB_API_BASE}/${endpoint}`;
    
    console.log('Searching GitHub with query:', searchQuery);
    
    const headers: Record<string, string> = {
      'Accept': 'application/vnd.github.v3+json',
      'X-GitHub-Api-Version': '2022-11-28'
    };

    // Add token in development
    if (!import.meta.env.PROD && GITHUB_TOKEN) {
      headers['Authorization'] = `token ${GITHUB_TOKEN}`;
    }
    
    const response = await fetchWithRetry(url, headers);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`GitHub API error: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const data: SearchIssuesResponse = await response.json();
    
    console.log(`Found ${data.total_count} issues (showing ${data.items.length})`);

    const processedIssues: ProcessedIssue[] = data.items.map((issue) => {
      const repoName = issue.repository_url.replace('https://api.github.com/repos/', '');
      
      return {
        title: issue.title,
        repo: repoName,
        labels: issue.labels.map(label => label.name),
        language: language || 'Unknown', // Use search language or Unknown
        url: issue.html_url,
        author: issue.user.login,
        createdAt: issue.created_at,
        comments: issue.comments,
        // Templates removed - too many API calls
        prTemplate: undefined,
        contributingGuide: undefined
      };
    });

    // Cache the results
    setCachedData(cacheKey, processedIssues);

    return processedIssues;
  } catch (error) {
    console.error('Error searching GitHub issues:', error);
    throw error;
  }
};

// Export rate limit info
export const getRateLimitInfo = () => ({
  remaining: rateLimitRemaining,
  reset: rateLimitReset ? new Date(rateLimitReset * 1000) : null
});

// Clear cache utility
export const clearCache = () => {
  cache.clear();
};

// Get repository data including star count
export const getRepoData = async (owner: string, repo: string): Promise<GitHubRepoData> => {
  const cacheKey = `repo_${owner}_${repo}`;
  const cached = getCachedData(cacheKey);

  if (cached) {
    return cached;
  }

  try {
    const url = `${GITHUB_API_BASE}/repos/${owner}/${repo}`;
    const headers: Record<string, string> = {
      'Accept': 'application/vnd.github.v3+json',
      'X-GitHub-Api-Version': '2022-11-28'
    };

    // Add token in development
    if (!import.meta.env.PROD && GITHUB_TOKEN) {
      headers['Authorization'] = `token ${GITHUB_TOKEN}`;
    }

    const response = await fetchWithRetry(url, headers);

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    const repoData: GitHubRepoData = {
      stargazers_count: data.stargazers_count,
      name: data.name,
      full_name: data.full_name,
      html_url: data.html_url,
    };

    // Cache the results
    setCachedData(cacheKey, repoData);

    return repoData;
  } catch (error) {
    console.error('Error fetching repository data:', error);

    // Return fallback data
    return {
      stargazers_count: 220,
      name: repo,
      full_name: `${owner}/${repo}`,
      html_url: `https://github.com/${owner}/${repo}`,
    };
  }
};

// Get star count only
export const getStarCount = async (owner: string, repo: string): Promise<number> => {
  const data = await getRepoData(owner, repo);
  return data.stargazers_count;
};
