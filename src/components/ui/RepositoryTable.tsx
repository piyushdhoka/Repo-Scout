import { GitHubRepository } from "@/services/githubRepositoryApi";
import { Star, GitFork } from "lucide-react";

interface RepositoryTableProps {
  repositories: GitHubRepository[];
}

const getPopularityBadge = (stars: number) => {
  if (stars >= 50000) return { text: "Legendary", className: "badge-legendary" };
  if (stars >= 10000) return { text: "Famous", className: "badge-famous" };
  if (stars >= 1000) return { text: "Popular", className: "badge-popular" };
  return { text: "Rising", className: "badge-popular" };
};

const formatNumber = (num: number) => {
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}k`;
  }
  return num.toString();
};

export const RepositoryTable = ({ repositories }: RepositoryTableProps) => {
  return (
    <div className="animate-fade-in-up">
      {/* Table Header */}
      <div className="repo-table-header">
        <div>Repository</div>
        <div>Language</div>
        <div>Tags</div>
        <div>Stars</div>
        <div>Forks</div>
        <div>Popularity</div>
      </div>

      {/* Table Rows */}
      <div>
        {repositories.map((repo) => {
          const popularity = getPopularityBadge(repo.stargazers_count);
          
          return (
            <div
              key={repo.id}
              className="repo-table-row cursor-pointer"
              onClick={() => window.open(repo.html_url, '_blank')}
            >
              {/* Repository */}
              <div className="flex items-center gap-3">
                <img
                  src={repo.owner.avatar_url}
                  alt={repo.owner.login}
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <h3 className="text-white font-semibold font-instrument">
                    {repo.name}
                  </h3>
                  <p className="text-sm text-gray-400 line-clamp-1">
                    {repo.description || "No description available"}
                  </p>
                </div>
              </div>

              {/* Language */}
              <div>
                {repo.language && (
                  <span className="lang-badge">
                    {repo.language}
                  </span>
                )}
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1">
                {repo.topics?.slice(0, 3).map((topic) => (
                  <span key={topic} className="tag-badge">
                    {topic}
                  </span>
                ))}
                {repo.topics && repo.topics.length > 3 && (
                  <span className="tag-badge">
                    +{repo.topics.length - 3}
                  </span>
                )}
              </div>

              {/* Stars */}
              <div className="stat-item">
                <Star className="w-4 h-4 text-yellow-500" />
                <span className="stat-value">{formatNumber(repo.stargazers_count)}</span>
              </div>

              {/* Forks */}
              <div className="stat-item">
                <GitFork className="w-4 h-4 text-blue-500" />
                <span className="stat-value">{formatNumber(repo.forks_count)}</span>
              </div>

              {/* Popularity */}
              <div>
                <span className={popularity.className}>
                  {popularity.text}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
