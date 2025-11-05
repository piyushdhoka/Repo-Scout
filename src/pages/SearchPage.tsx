import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, ChevronLeft, ChevronRight, ChevronDown, Home, Flame, Star, Bug, Twitter, Github, Mail, Filter as FilterIcon, Star as StarIcon, User, History, Code, Zap, TrendingUp } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { searchGitHubIssues, ProcessedIssue } from "@/services/githubApi";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Loader from "@/components/Loader";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useSearchLimit } from "@/hooks/useSearchLimit";
import { IssueHistory } from "@/components/IssueHistory";
import { EnhancedSidebar } from "@/components/UI/EnhancedSidebar";
import { EnhancedRepositoryCard, RepositoryCardSkeleton } from "@/components/UI/EnhancedRepositoryCard";
import { githubRepositoryAPI, GitHubRepository } from "@/services/githubRepositoryApi";
import { InteractiveButton } from "@/components/UI/InteractiveButton";
import { Skeleton } from "@/components/UI/Skeleton";

const SearchPage = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [selectedLabels, setSelectedLabels] = useState<string[]>([]);
  const [issues, setIssues] = useState<ProcessedIssue[]>([]);
  const [repositories, setRepositories] = useState<GitHubRepository[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRepositoriesLoading, setIsRepositoriesLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [organization, setOrganization] = useState("");
  const [selectedPopularity, setSelectedPopularity] = useState<string>("");
  const [viewMode, setViewMode] = useState<'issues' | 'repositories'>('repositories');
  const [sortBy, setSortBy] = useState<'updated' | 'stars' | 'created'>('updated');

  const { incrementSearchCount } = useSearchLimit();
  const { toast } = useToast();

  const handleSearch = async () => {
    setIsLoading(true);
    setIsRepositoriesLoading(true);
    setHasSearched(true);
    incrementSearchCount();

    try {
      if (viewMode === 'repositories') {
        // Search repositories
        const repoResults = await githubRepositoryAPI.searchRepositories({
          query: searchQuery,
          language: selectedLanguage,
          sort: sortBy,
          perPage: 20
        });
        setRepositories(repoResults);
        toast({
          title: "Repository search completed",
          description: `Found ${repoResults.length} repositories`,
        });
      } else {
        // Search issues (existing functionality)
        const results = await searchGitHubIssues(
          selectedLanguage || undefined,
          selectedLabels.length > 0 ? selectedLabels : undefined,
          searchQuery || undefined,
          100,
          1,
          organization || undefined
        );
        setIssues(results);
        toast({
          title: "Search completed",
          description: `Found ${results.length} issues`,
        });
      }
    } catch (error) {
      console.error('Search failed:', error);
      toast({
        title: "Search failed",
        description: "Failed to fetch data from GitHub. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setIsRepositoriesLoading(false);
    }
  };

  const loadTrendingRepositories = useCallback(async () => {
    setIsRepositoriesLoading(true);
    try {
      const trendingRepos = await githubRepositoryAPI.getYCombinatorRepositories();
      setRepositories(trendingRepos.slice(0, 12));
    } catch (error) {
      console.error('Failed to load trending repositories:', error);
      // Use mock data as fallback
      setRepositories(githubRepositoryAPI.getMockRepositories());
    } finally {
      setIsRepositoriesLoading(false);
    }
  }, []);

  // Load trending repositories on mount
  useEffect(() => {
    if (viewMode === 'repositories' && !hasSearched) {
      loadTrendingRepositories();
    }
  }, [viewMode, hasSearched, loadTrendingRepositories]);

  const handleSearchClick = (e: React.MouseEvent<HTMLButtonElement> | React.KeyboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    handleSearch();
  };

  const toggleLabel = (label: string) => {
    setSelectedLabels(prev => 
      prev.includes(label) 
        ? prev.filter(l => l !== label)
        : [...prev, label]
    );
  };

  const getLanguageBadgeClass = (lang: string) => {
    const badges: Record<string, string> = {
      "Go": "bg-sky-500 text-white",
      "TypeScript": "bg-blue-500 text-white",
      "JavaScript": "bg-yellow-500 text-white",
      "Python": "bg-blue-600 text-white",
      "Java": "bg-orange-500 text-white",
      "Rust": "bg-orange-700 text-white",
      "C++": "bg-blue-600 text-white",
      "PHP": "bg-purple-500 text-white",
    };
    return badges[lang] || "bg-gray-600 text-white";
  };

  const getPopularityBadge = (stars: number) => {
    if (stars >= 50000) return { text: "Legendary", class: "bg-yellow-500 text-black" };
    if (stars >= 20000) return { text: "Famous", class: "bg-purple-500 text-white" };
    if (stars >= 5000) return { text: "Popular", class: "bg-green-500 text-white" };
    return { text: "Growing", class: "bg-gray-500 text-white" };
  };

  return (
    <div className="flex h-screen bg-black text-white overflow-hidden">
      {/* Enhanced Sidebar */}
      <EnhancedSidebar
        user={user}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden bg-black">
        {/* Header */}
        <div className="border-b border-gray-800 px-6 py-4 bg-gradient-to-b from-gray-900 to-black">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <Code className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    REPO SCOUT
                  </h2>
                  <p className="text-sm text-gray-400">
                    {user ? `Welcome back, ${user.displayName || user.email?.split('@')[0]}!` : 'Find your next open source contribution'}
                  </p>
                </div>
              </div>

              {/* View Mode Toggle */}
              <div className="flex items-center gap-2">
                <div className="flex items-center bg-gray-900 border border-gray-700 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode('repositories')}
                    className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                      viewMode === 'repositories'
                        ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    Repositories
                  </button>
                  <button
                    onClick={() => setViewMode('issues')}
                    className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                      viewMode === 'issues'
                        ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    Issues
                  </button>
                </div>
              </div>
            </div>
            {user && (
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={user.photoURL || undefined} alt={user.displayName || 'User'} />
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                    {user.displayName ? user.displayName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : user.email?.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="text-right">
                  <p className="text-sm font-medium text-white">{user.displayName || 'User'}</p>
                  <p className="text-xs text-gray-400">{user.email}</p>
                </div>
              </div>
            )}
          </div>

          {/* Enhanced Search Bar */}
          <div className="flex flex-col space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  placeholder={
                    viewMode === 'repositories'
                      ? "Search repositories, topics, or owners..."
                      : "Search issues from curated open source projects"
                  }
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSearchClick(e);
                  }}
                  className="pl-10 bg-gray-900/50 border-gray-700 text-white placeholder:text-gray-500 focus:border-blue-500/50 focus:bg-gray-900/80 transition-all"
                />
              </div>

              {/* Enhanced Filters */}
              <div className="flex items-center gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="bg-gray-900/50 border-gray-700 text-white hover:bg-gray-800/50 gap-2">
                      <Code className="h-4 w-4" />
                      {selectedLanguage || 'Language'}
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56 bg-gray-900 border border-gray-700 text-white">
                    <DropdownMenuItem onClick={() => setSelectedLanguage("")}>All Languages</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSelectedLanguage("JavaScript")}>JavaScript</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSelectedLanguage("TypeScript")}>TypeScript</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSelectedLanguage("Python")}>Python</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSelectedLanguage("Go")}>Go</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSelectedLanguage("Rust")}>Rust</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSelectedLanguage("Java")}>Java</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSelectedLanguage("C++")}>C++</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSelectedLanguage("PHP")}>PHP</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSelectedLanguage("Swift")}>Swift</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSelectedLanguage("Kotlin")}>Kotlin</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="bg-gray-900/50 border-gray-700 text-white hover:bg-gray-800/50 gap-2">
                      <TrendingUp className="h-4 w-4" />
                      {sortBy === 'stars' ? 'Most Stars' : sortBy === 'created' ? 'Newest' : 'Recently Updated'}
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56 bg-gray-900 border border-gray-700 text-white">
                    <DropdownMenuItem onClick={() => setSortBy('updated')}>Recently Updated</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSortBy('stars')}>Most Stars</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSortBy('created')}>Newest First</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <InteractiveButton
                  onClick={handleSearchClick}
                  disabled={isLoading}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                  glow
                  ripple
                >
                  <Search className="h-4 w-4 mr-2" />
                  {isLoading ? "Searching..." : viewMode === 'repositories' ? "Search Repos" : "Search Issues"}
                </InteractiveButton>
              </div>
            </div>

            {/* Enhanced Filter Tags */}
            <div className="flex items-center gap-4">
              <div className="flex flex-wrap gap-2">
                {viewMode === 'repositories' ? (
                  <>
                    {["JavaScript", "TypeScript", "Python", "Go", "Rust", "Vue", "React", "Docker"].map((lang) => (
                      <Badge
                        key={lang}
                        className={`cursor-pointer transition-all ${
                          selectedLanguage === lang
                            ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white border-0 px-3 py-1.5'
                            : 'bg-gray-800/50 text-gray-300 border border-gray-700 hover:bg-gray-700/50 hover:text-white px-3 py-1.5'
                        }`}
                        onClick={() => setSelectedLanguage(selectedLanguage === lang ? "" : lang)}
                      >
                        {lang}
                      </Badge>
                    ))}
                  </>
                ) : (
                  <>
                    {["JavaScript", "Python", "TypeScript", "Go", "Rust"].map((lang) => (
                      <Badge
                        key={lang}
                        className={`cursor-pointer transition-all ${
                          selectedLanguage === lang
                            ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white border-0 px-3 py-1.5'
                            : 'bg-gray-800/50 text-gray-300 border border-gray-700 hover:bg-gray-700/50 hover:text-white px-3 py-1.5'
                        }`}
                        onClick={() => setSelectedLanguage(selectedLanguage === lang ? "" : lang)}
                      >
                        {lang}
                      </Badge>
                    ))}
                  </>
                )}
              </div>

              {viewMode === 'repositories' && !hasSearched && (
                <div className="flex items-center gap-2 ml-auto">
                  <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white border-0">
                    <Zap className="h-3 w-3 mr-1" />
                    Trending
                  </Badge>
                  <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0">
                    <Star className="h-3 w-3 mr-1" />
                    Y Combinator
                  </Badge>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Enhanced Content Area */}
        <div className="flex-1 overflow-y-auto bg-gradient-to-b from-black to-gray-950">
          {viewMode === 'repositories' ? (
            <div className="p-6">
              {isRepositoriesLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <RepositoryCardSkeleton key={i} variant="default" />
                  ))}
                </div>
              ) : repositories.length > 0 ? (
                <>
                  {/* Repository Stats Header */}
                  <div className="mb-6 flex items-center justify-between">
                    <h3 className="text-xl font-semibold text-white">
                      {hasSearched ? 'Search Results' : 'Trending Repositories'}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <span>{repositories.length} repositories</span>
                      {selectedLanguage && <span>• {selectedLanguage}</span>
                    </div>
                  </div>

                  {/* Repository Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {repositories.map((repo) => (
                      <EnhancedRepositoryCard
                        key={repo.id}
                        repository={{
                          id: repo.id.toString(),
                          name: repo.name,
                          fullName: repo.full_name,
                          description: repo.description || '',
                          language: repo.language,
                          stars: repo.stargazers_count,
                          forks: repo.forks_count,
                          watchers: repo.watchers_count,
                          openIssues: repo.open_issues_count,
                          createdAt: repo.created_at,
                          updatedAt: repo.updated_at,
                          owner: {
                            login: repo.owner.login,
                            avatarUrl: repo.owner.avatar_url,
                            type: repo.owner.type
                          },
                          topics: repo.topics,
                          license: repo.license,
                          isPrivate: repo.private,
                          size: repo.size
                        }}
                        onCardClick={(repository) => {
                          window.open(`https://github.com/${repository.fullName}`, '_blank')
                        }}
                      />
                    ))}
                  </div>
                </>
              ) : hasSearched ? (
                <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                  <Code className="h-12 w-12 mb-4 text-gray-600" />
                  <h3 className="text-lg font-medium mb-2">No repositories found</h3>
                  <p className="text-sm">Try adjusting your search terms or filters</p>
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 rounded-full mb-4">
                    <Zap className="h-4 w-4 text-blue-400" />
                    <span className="text-sm text-blue-400 font-medium">Explore Trending Repositories</span>
                  </div>
                  <p className="text-gray-400 mb-6">
                    Discover curated open source projects from Y Combinator and top contributors
                  </p>
                  <InteractiveButton
                    onClick={loadTrendingRepositories}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  >
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Load Trending
                  </InteractiveButton>
                </div>
              )}
            </div>
          ) : (
            // Issues view (existing functionality but enhanced)
            <div className="px-6 py-4">
              {isLoading ? (
                <div className="flex items-center justify-center h-full">
                  <Loader />
                </div>
              ) : issues.length > 0 ? (
                <>
                  {/* Issues Header */}
                  <div className="mb-6 flex items-center justify-between">
                    <h3 className="text-xl font-semibold text-white">Open Issues</h3>
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <span>{issues.length} issues</span>
                      {selectedLanguage && <span>• {selectedLanguage}</span>}
                    </div>
                  </div>

                  {/* Enhanced Issues Table */}
                  <div className="space-y-3">
                    {issues
                      .map((issue, idx) => ({
                        issue,
                        idx,
                        popularity: getPopularityBadge(1000 + idx * 100).text
                      }))
                      .filter(({ popularity }) => !selectedPopularity || popularity === selectedPopularity)
                      .slice(0, 20)
                      .map(({ issue, idx, popularity }) => (
                        <div
                          key={issue.url}
                          className="p-4 bg-gradient-to-r from-gray-900/50 to-gray-800/50 border border-gray-800 rounded-xl hover:from-gray-800/70 hover:to-gray-700/70 transition-all hover:transform hover:-translate-y-1 cursor-pointer group"
                          onClick={() => window.open(issue.url, '_blank')}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
                                {issue.repo.split('/')[1]?.[0]?.toUpperCase() || 'R'}
                              </div>
                              <div>
                                <h4 className="font-semibold text-white group-hover:text-blue-400 transition-colors">
                                  {issue.repo.split('/')[1] || issue.repo}
                                </h4>
                                <p className="text-sm text-gray-400 line-clamp-1">{issue.title}</p>
                              </div>
                            </div>

                            <div className="flex items-center gap-4">
                              <Badge className={getLanguageBadgeClass(issue.language) || "bg-gray-600 text-white"}>
                                {issue.language}
                              </Badge>
                              <div className="flex flex-wrap gap-1">
                                {issue.labels.slice(0, 2).map((label) => (
                                  <Badge key={label} className="bg-gray-700 text-gray-300 border-0 text-xs">
                                    {label.length > 12 ? `${label.substring(0, 12)}...` : label}
                                  </Badge>
                                ))}
                              </div>
                              <Badge className={`${getPopularityBadge(1000 + idx * 100).class} text-xs`}>
                                {popularity}
                              </Badge>
                            </div>
                          </div>

                          <div className="mt-3 flex items-center gap-6 text-sm text-gray-400">
                            <span className="flex items-center gap-1">
                              <MessageSquare className="h-3 w-3" />
                              {issue.comments} comments
                            </span>
                            <span className="flex items-center gap-1">
                              <Star className="h-3 w-3" />
                              {idx + 1}k stars
                            </span>
                            <span className="flex items-center gap-1">
                              <GitFork className="h-3 w-3" />
                              {idx + 1}k forks
                            </span>
                          </div>
                        </div>
                      ))}
                  </div>
                </>
              ) : hasSearched ? (
                <div className="flex items-center justify-center h-full text-gray-400">
                  No issues found. Try adjusting your search.
                </div>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400">
                  Enter a search term to find open source issues
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchPage;