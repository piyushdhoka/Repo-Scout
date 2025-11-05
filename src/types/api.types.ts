// API related types
export interface GitHubRepository {
  id: number
  name: string
  full_name: string
  description: string
  homepage: string | null
  language: string | null
  forks_count: number
  stargazers_count: number
  watchers_count: number
  open_issues_count: number
  subscribers_count: number
  size: number
  private: boolean
  fork: boolean
  archived: boolean
  disabled: boolean
  pushed_at: string
  created_at: string
  updated_at: string
  default_branch: string
  html_url: string
  clone_url: string
  git_url: string
  ssh_url: string
  mirror_url: string
  forks_url: string
  keys_url: string
  collaborators_url: string
  teams_url: string
  hooks_url: string
  issue_events_url: string
  events_url: string
  assignees_url: string
  branches_url: string
  tags_url: string
  blobs_url: string
  git_tags_url: string
  git_refs_url: string
  trees_url: string
  statuses_url: string
  languages_url: string
  stargazers_url: string
  contributors_url: string
  subscribers_url: string
  subscription_url: string
  commits_url: string
  git_commits_url: string
  comments_url: string
  issue_comment_url: string
  contents_url: string
  compare_url: string
  merges_url: string
  archive_url: string
  downloads_url: string
  issues_url: string
  pulls_url: string
  milestones_url: string
  notifications_url: string
  labels_url: string
  releases_url: string
  deployments_url: string
  environments_url: string
}

export interface GitHubUser {
  login: string
  id: number
  avatar_url: string
  gravatar_id: string
  url: string
  html_url: string
  followers_url: string
  following_url: string
  gists_url: string
  starred_url: string
  subscriptions_url: string
  organizations_url: string
  repos_url: string
  events_url: string
  received_events_url: string
  type: string
  site_admin: boolean
  name: string | null
  company: string | null
  blog: string | null
  location: string | null
  email: string | null
  hireable: boolean | null
  bio: string | null
  twitter_username: string | null
  public_repos: number
  public_gists: number
  followers: number
  following: number
  created_at: string
  updated_at: string
}

export interface GitHubIssue {
  id: number
  number: number
  title: string
  body: string | null
  user: GitHubUser
  labels: GitHubLabel[]
  state: 'open' | 'closed'
  locked: boolean
  assignee: GitHubUser | null
  assignees: GitHubUser[]
  milestone: GitHubMilestone | null
  comments: number
  created_at: string
  updated_at: string
  closed_at: string | null
  pull_request: {
    url: string
    html_url: string
    diff_url: string
    patch_url: string
    merged_at: string | null
  } | null
  repository: {
    id: number
    name: string
    full_name: string
    owner: {
      login: string
      avatar_url: string
    }
  }
  html_url: string
  url: string
}

export interface GitHubLabel {
  id: number
  node_id: string
  url: string
  name: string
  color: string
  default: boolean
  description: string | null
}

export interface GitHubMilestone {
  url: string
  html_url: string
  labels_url: string
  id: number
  node_id: string
  number: number
  title: string
  description: string
  creator: GitHubUser
  open_issues: number
  closed_issues: number
  state: 'open' | 'closed'
  created_at: string
  updated_at: string
  due_on: string | null
  closed_at: string | null
}

export interface GitHubSearchResponse<T> {
  total_count: number
  incomplete_results: boolean
  items: T[]
}

// Repository enhancement types
export interface EnhancedRepository {
  id: string
  name: string
  fullName: string
  description: string
  language: string
  stars: number
  forks: number
  watchers: number
  openIssues: number
  createdAt: string
  updatedAt: string
  owner: {
    login: string
    avatarUrl: string
    type: string
  }
  topics: string[]
  license?: {
    name: string
    spdx_id: string
  }
  isPrivate: boolean
  size: number
  isForked: boolean
  isArchived: boolean
  defaultBranch: string
  homepage?: string
  contributors?: number
  lastCommit?: {
    sha: string
    message: string
    author: string
    date: string
  }
  languages?: Record<string, number>
  healthScore?: number
}

export interface RepositoryStats {
  totalCommits: number
  totalContributors: number
  totalIssues: number
  closedIssues: number
  lastCommit: string
  languages: Record<string, number>
  topics: string[]
}

// API request/response types
export interface SearchRepositoriesParams {
  query?: string
  language?: string
  stars?: string
  forks?: string
  topic?: string
  sort?: 'stars' | 'forks' | 'updated' | 'created'
  order?: 'asc' | 'desc'
  perPage?: number
  page?: number
}

export interface SearchIssuesParams {
  query?: string
  language?: string
  labels?: string[]
  state?: 'open' | 'closed' | 'all'
  sort?: 'comments' | 'reactions' | 'updated' | 'created'
  order?: 'asc' | 'desc'
  perPage?: number
  page?: number
  organization?: string
}

// API error types
export interface ApiError {
  message: string
  status?: number
  code?: string
  details?: any
  timestamp: string
}

export interface ValidationError extends ApiError {
  field: string
  value: any
  constraint: string
}

export interface RateLimitError extends ApiError {
  limit: number
  remaining: number
  resetTime: string
}