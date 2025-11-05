// Authentication related types
export interface AuthUser {
  uid: string
  email: string
  displayName: string | null
  photoURL: string | null
  emailVerified: boolean
  metadata?: Record<string, any>
  customData?: {
    preferences?: UserPreferences
    profile?: UserProfile
    activity?: UserActivity
  }
}

export interface UserProfile {
  id: string
  displayName: string
  email: string
  photoURL: string
  bio?: string
  location?: string
  website?: string
  githubUsername?: string
  twitterUsername?: string
  linkedinUrl?: string
  skills: string[]
  interests: string[]
  experience: string
  availability: 'available' | 'busy' | 'looking'
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system'
  language: string
  timezone: string
  emailNotifications: boolean
  pushNotifications: boolean
  weeklyDigest: boolean
  showTutorials: boolean
  defaultLanguageFilter: string[]
  defaultSortOrder: 'updated' | 'stars' | 'created'
  itemsPerPage: number
  showPrivateRepos: boolean
}

export interface UserActivity {
  id: string
  userId: string
  type: 'search' | 'view' | 'like' | 'contribute' | 'follow'
  targetId: string
  targetType: 'repository' | 'issue' | 'user'
  data?: Record<string, any>
  timestamp: string
  metadata?: Record<string, any>
}

export interface AuthCredentials {
  email: string
  password: string
}

export interface SocialAuthProviders {
  google: {
    idToken: string
    accessToken: string
    refreshToken?: string
  }
  github: {
    code: string
    accessToken: string
    refreshToken?: string
  }
}

export interface AuthSession {
  user: AuthUser
  accessToken: string
  refreshToken?: string
  expiresAt: number
  provider: 'email' | 'google' | 'github'
  isAuthenticated: boolean
}

export interface AuthState {
  user: AuthUser | null
  loading: boolean
  error: string | null
  isAuthenticated: boolean
  session: AuthSession | null
}

export interface AuthError {
  code: string
  message: string
  details?: any
}

export interface PasswordResetRequest {
  email: string
}

export interface PasswordResetConfirmation {
  oobCode: string
  newPassword: string
}

export interface EmailVerification {
  oobCode: string
}

export interface UserStats {
  totalContributions: number
  repositoriesFollowed: number
  issuesSolved: number
  pullRequestsMerged: number
  lastActiveDate: string
  favoriteLanguages: string[]
  skillLevel: 'beginner' | 'intermediate' | 'advanced' | 'expert'
}

export interface UserAchievement {
  id: string
  type: 'first_contribution' | 'streak_7_days' | 'streak_30_days' | 'top_contributor' | 'early_adopter'
  unlockedAt: string
  metadata?: Record<string, any>
}

export interface AuthMethods {
  email: {
    enabled: boolean
    requiredFields: ('email' | 'password' | 'displayName')[]
  }
  google: {
    enabled: boolean
    clientId: string
    scopes: string[]
  }
  github: {
    enabled: boolean
    clientId: string
    scopes: string[]
  }
}