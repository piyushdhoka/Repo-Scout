import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Code, TrendingUp, ChevronDown } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/hooks/useAuth";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { githubRepositoryAPI, GitHubRepository } from "@/services/githubRepositoryApi";
import { RepositoryTable } from "@/components/RepositoryTable";
import { RepositoryTableSkeleton } from "@/components/RepositoryTableSkeleton";

const SearchPage = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [repositories, setRepositories] = useState<GitHubRepository[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [sortBy, setSortBy] = useState<'updated' | 'stars' | 'created'>('stars');

  const handleSearch = async () => {
    setIsLoading(true);
    setHasSearched(true);

    try {
      const repoResults = await githubRepositoryAPI.searchRepositories({
        query: searchQuery,
        language: selectedLanguage,
        sort: sortBy,
        perPage: 30
      });
      setRepositories(repoResults);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadTrendingRepositories = useCallback(async () => {
    setIsLoading(true);
    try {
      const trendingRepos = await githubRepositoryAPI.getPopularRepositories('', 1000);
      setRepositories(trendingRepos.slice(0, 30));
    } catch (error) {
      console.error('Failed to load trending repositories:', error);
      setRepositories([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!hasSearched) {
      loadTrendingRepositories();
    }
  }, [hasSearched, loadTrendingRepositories]);

  const handleSearchClick = (e: React.MouseEvent<HTMLButtonElement> | React.KeyboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    handleSearch();
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section with Search */}
      <div className="border-b border-gray-900 px-6 py-8 bg-gradient-to-b from-gray-950 to-black">
        <div className="max-w-7xl mx-auto">
          {/* Title */}
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-3 font-instrument">
              Discover Open Source
            </h1>
            <p className="text-lg text-gray-400">
              Explore trending repositories and find your next contribution
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col sm:flex-row gap-3 mb-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
                <Input
                  placeholder="Search repositories, topics, or organizations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSearchClick(e);
                  }}
                  className="input-classy pl-12 h-12 text-base"
                />
              </div>

              <Button
                onClick={handleSearchClick}
                disabled={isLoading}
                className="btn-primary-classy h-12 px-8 whitespace-nowrap"
              >
                <Search className="h-4 w-4 mr-2" />
                {isLoading ? "Searching..." : "Search"}
              </Button>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-3">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="btn-secondary-classy gap-2">
                    <Code className="h-4 w-4" />
                    {selectedLanguage || 'All Languages'}
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 bg-gray-950 border-gray-800">
                  <DropdownMenuItem onClick={() => setSelectedLanguage("")} className="text-gray-300 hover:text-white focus:bg-gray-900">
                    All Languages
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSelectedLanguage("JavaScript")} className="text-gray-300 hover:text-white focus:bg-gray-900">
                    JavaScript
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSelectedLanguage("TypeScript")} className="text-gray-300 hover:text-white focus:bg-gray-900">
                    TypeScript
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSelectedLanguage("Python")} className="text-gray-300 hover:text-white focus:bg-gray-900">
                    Python
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSelectedLanguage("Go")} className="text-gray-300 hover:text-white focus:bg-gray-900">
                    Go
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSelectedLanguage("Rust")} className="text-gray-300 hover:text-white focus:bg-gray-900">
                    Rust
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSelectedLanguage("Java")} className="text-gray-300 hover:text-white focus:bg-gray-900">
                    Java
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="btn-secondary-classy gap-2">
                    <TrendingUp className="h-4 w-4" />
                    {sortBy === 'stars' ? 'Most Stars' : sortBy === 'created' ? 'Newest' : 'Recently Updated'}
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 bg-gray-950 border-gray-800">
                  <DropdownMenuItem onClick={() => setSortBy('stars')} className="text-gray-300 hover:text-white focus:bg-gray-900">
                    Most Stars
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortBy('updated')} className="text-gray-300 hover:text-white focus:bg-gray-900">
                    Recently Updated
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortBy('created')} className="text-gray-300 hover:text-white focus:bg-gray-900">
                    Newest First
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {selectedLanguage && (
                <span className="tag-badge">
                  {selectedLanguage}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Results Section */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {isLoading ? (
          <>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-white font-instrument mb-2">
                {hasSearched ? 'Search Results' : 'Trending Repositories'}
              </h2>
              <p className="text-gray-400">Loading repositories...</p>
            </div>
            <RepositoryTableSkeleton />
          </>
        ) : repositories.length > 0 ? (
          <>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-white font-instrument mb-2">
                {hasSearched ? 'Search Results' : 'Trending Repositories'}
              </h2>
              <p className="text-gray-400">
                {repositories.length} {repositories.length === 1 ? 'repository' : 'repositories'} found
              </p>
            </div>
            <RepositoryTable repositories={repositories} />
          </>
        ) : hasSearched ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="h-8 w-8 text-gray-600" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No repositories found</h3>
            <p className="text-gray-400">Try adjusting your search criteria</p>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default SearchPage;
