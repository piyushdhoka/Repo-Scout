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
      {/* Sidebar */}
      <div className={`bg-[#1a1a1a] border-r border-gray-800 transition-all duration-300 relative ${
        isSidebarCollapsed ? 'w-16' : 'w-64'
      }`}>

        <div className="h-full flex flex-col">
          {/* Sidebar top section for the toggle button (separate from nav items) */}
          <div className={`px-2 py-3 border-b border-gray-800 flex ${isSidebarCollapsed ? 'justify-center' : 'justify-end'}`}>
            <button
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              className="bg-gray-800 p-1 rounded border border-gray-700 hover:bg-gray-700 transition-all"
              aria-label={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {isSidebarCollapsed ? <ChevronRight className="h-4 w-4 text-gray-300" /> : <ChevronLeft className="h-4 w-4 text-gray-300" />}
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto py-4">
            {/* USER SECTION */}
            {user && !isSidebarCollapsed && (
              <div className="px-4 mb-4">
                <h3 className="text-xs uppercase text-gray-500 font-semibold mb-2">USER</h3>
                <div className="space-y-1">
                  <Link to="/" className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-gray-400 hover:bg-gray-800 hover:text-white transition-colors">
                    <Home className="h-5 w-5 flex-shrink-0" />
                    <span>Back to Home</span>
                  </Link>
                </div>
              </div>
            )}

            {/* GENERAL */}
            <div className="px-4 mb-4">
              {!isSidebarCollapsed && <h3 className="text-xs uppercase text-gray-500 font-semibold mb-2">GENERAL</h3>}
              <div className="space-y-1">
                <button className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg bg-gray-800 text-white hover:bg-gray-700 transition-colors ${isSidebarCollapsed ? 'justify-center' : ''}`}>
                  <Search className="h-5 w-5 flex-shrink-0" />
                  {!isSidebarCollapsed && <span>Search</span>}
                </button>
                {user && (
                  <button className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-gray-400 hover:bg-gray-800 hover:text-white transition-colors ${isSidebarCollapsed ? 'justify-center' : ''}`}>
                    <History className="h-5 w-5 flex-shrink-0" />
                    {!isSidebarCollapsed && <span>My History</span>}
                  </button>
                )}
                <button className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-gray-400 hover:bg-gray-800 hover:text-white transition-colors ${isSidebarCollapsed ? 'justify-center' : ''}`}>
                  <Flame className="h-5 w-5 flex-shrink-0" />
                  {!isSidebarCollapsed && <span>Trending</span>}
                </button>
              </div>
            </div>

            {/* FEEDBACK */}
            <div className="px-4 mb-4">
              {!isSidebarCollapsed && <h3 className="text-xs uppercase text-gray-500 font-semibold mb-2">FEEDBACK</h3>}
              <div className="space-y-1">
                <button className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-gray-400 hover:bg-gray-800 hover:text-white transition-colors ${isSidebarCollapsed ? 'justify-center' : ''}`}>
                  <Star className="h-5 w-5 flex-shrink-0" />
                  {!isSidebarCollapsed && <span>Suggest Feature</span>}
                </button>
                <button className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-gray-400 hover:bg-gray-800 hover:text-white transition-colors ${isSidebarCollapsed ? 'justify-center' : ''}`}>
                  <Bug className="h-5 w-5 flex-shrink-0" />
                  {!isSidebarCollapsed && <span>Report Bug</span>}
                </button>
              </div>
            </div>

            {/* SOCIAL */}
            <div className="px-4 mb-4">
              {!isSidebarCollapsed && <h3 className="text-xs uppercase text-gray-500 font-semibold mb-2">SOCIAL</h3>}
              <div className="space-y-1">
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-gray-400 hover:bg-gray-800 hover:text-white transition-colors ${isSidebarCollapsed ? 'justify-center' : ''}`}>
                  <Twitter className="h-5 w-5 flex-shrink-0" />
                  {!isSidebarCollapsed && <span>Twitter</span>}
                </a>
                <a href="https://github.com/vivekd16/Repo-Scout" target="_blank" rel="noopener noreferrer" className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-gray-400 hover:bg-gray-800 hover:text-white transition-colors ${isSidebarCollapsed ? 'justify-center' : ''}`}>
                  <Github className="h-5 w-5 flex-shrink-0" />
                  {!isSidebarCollapsed && <span>GitHub</span>}
                </a>
                <button className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-gray-400 hover:bg-gray-800 hover:text-white transition-colors ${isSidebarCollapsed ? 'justify-center' : ''}`}>
                  <Mail className="h-5 w-5 flex-shrink-0" />
                  {!isSidebarCollapsed && <span>Email</span>}
                </button>
              </div>
            </div>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden bg-black">
        {/* Header */}
        <div className="border-b border-gray-800 px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div>
                <h2 className="text-2xl font-bold text-white">REPO SCOUT</h2>
                <p className="text-sm text-gray-400">
                  {user ? `Welcome back, ${user.displayName || user.email?.split('@')[0]}!` : 'Find your next open source contribution'}
                </p>
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

          {/* Search Bar */}
          <div className="flex items-center gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                placeholder="Curated open source projects from Y Combinator"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSearchClick(e);
                }}
                className="pl-10 bg-gray-900 border-gray-700 text-white placeholder:text-gray-500"
              />
            </div>
            <div className="flex gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="bg-gray-800 border-gray-700 text-white hover:bg-gray-700 gap-2">
                    {selectedLanguage || 'All Languages'}
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
                </DropdownMenuContent>
              </DropdownMenu>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="bg-gray-800 border-gray-700 text-white hover:bg-gray-700 gap-2">
                    {selectedPopularity || 'All Popularity'}
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 bg-gray-900 border border-gray-700 text-white">
                  <DropdownMenuItem onClick={() => setSelectedPopularity("")}>All Popularity</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSelectedPopularity("Legendary")}>Legendary</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSelectedPopularity("Famous")}>Famous</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSelectedPopularity("Popular")}>Popular</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSelectedPopularity("Growing")}>Growing</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button 
                onClick={handleSearchClick}
                disabled={isLoading}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                {isLoading ? "Searching..." : "Search"}
              </Button>
            </div>
          </div>

          {/* Filter Tags */}
          <div className="flex flex-wrap gap-2 mt-3">
            {["JavaScript", "Python", "TypeScript", "Go", "Rust"].map((lang) => (
              <Badge
                key={lang}
                variant={selectedLanguage === lang ? "default" : "secondary"}
                className={`cursor-pointer ${selectedLanguage === lang ? 'bg-blue-600' : 'bg-gray-800 hover:bg-gray-700'}`}
                onClick={() => setSelectedLanguage(selectedLanguage === lang ? "" : lang)}
              >
                {lang}
              </Badge>
            ))}
          </div>
        </div>

        {/* Table Content */}
        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <Loader />
            </div>
          ) : issues.length > 0 ? (
            <div className="px-6 py-4">
              {/* Table Header */}
              <div className="grid grid-cols-12 gap-4 pb-3 border-b border-gray-800 text-sm text-gray-400 font-semibold">
                <div className="col-span-4">Repository</div>
                <div className="col-span-2">Language</div>
                <div className="col-span-2">Tags</div>
                <div className="col-span-1">Stars</div>
                <div className="col-span-1">Forks</div>
                <div className="col-span-2">Popularity</div>
              </div>

          {/* Table Rows */}
          {issues
            .map((issue, idx) => ({
              issue,
              idx,
              popularity: getPopularityBadge(1000 + idx * 100).text
            }))
            .filter(({ popularity }) => !selectedPopularity || popularity === selectedPopularity)
            .slice(0, 50)
            .map(({ issue, idx, popularity }) => (
            <div
              key={issue.url}
              className="grid grid-cols-12 gap-4 py-4 border-b border-gray-900 hover:bg-gray-900/50 transition-colors"
            >
              <div className="col-span-4 flex items-center gap-3">
                <div className="w-8 h-8 rounded bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
                  {issue.repo.split('/')[1]?.[0]?.toUpperCase() || 'R'}
                </div>
                <a
                  href={`https://github.com/${issue.repo}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-white hover:text-blue-400 transition-colors truncate"
                >
                  {issue.repo.split('/')[1] || issue.repo}
                </a>
              </div>
              <div className="col-span-2 flex items-center">
                <Badge className={getLanguageBadgeClass(issue.language) || "bg-gray-600 text-white px-2 py-0.5 text-xs"}>
                  {issue.language}
                </Badge>
              </div>
              <div className="col-span-2 flex flex-wrap gap-1 items-center">
                {issue.labels.slice(0, 3).map((label) => (
                  <Badge key={label} className="bg-gray-700 text-gray-300 border-0 px-2 py-0.5 text-xs">
                    {label.substring(0, 12)}
                  </Badge>
                ))}
              </div>
              <div className="col-span-1 text-gray-300 flex items-center">{issue.comments}+</div>
              <div className="col-span-1 text-gray-300 flex items-center">{idx + 1}k</div>
              <div className="col-span-2 flex items-center">
                <Badge className={`${getPopularityBadge(1000 + idx * 100).class} px-2 py-0.5 text-xs`}>
                  {popularity}
                </Badge>
              </div>
            </div>
          ))}
            </div>
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
      </div>
    </div>
  );
};

export default SearchPage;