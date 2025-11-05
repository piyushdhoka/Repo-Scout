import React, { useEffect, useState } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/hooks/useAuth';
import { Loader } from '@/components/Loader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink, Github, Calendar, CheckCircle, Clock, XCircle } from 'lucide-react';

interface IssueHistory {
  id: string;
  issueTitle: string;
  issueUrl: string;
  prUrl: string;
  prStatus: 'open' | 'merged' | 'closed';
  solvedAt: Date;
  repository?: string;
  labels?: string[];
}

export const IssueHistory: React.FC = () => {
  const [history, setHistory] = useState<IssueHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchHistory = async () => {
      if (!user) return;

      try {
        setLoading(true);
        setError(null);

        const historyRef = collection(db, 'issueHistory');
        const q = query(historyRef, where('userId', '==', user.uid));
        const querySnapshot = await getDocs(q);

        const historyData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          solvedAt: doc.data().solvedAt?.toDate() || new Date(),
          repository: doc.data().repository || 'Unknown Repository',
          labels: doc.data().labels || []
        })) as IssueHistory[];

        // Sort by most recent first
        historyData.sort((a, b) => b.solvedAt.getTime() - a.solvedAt.getTime());

        setHistory(historyData);
      } catch (error: any) {
        console.error('Error fetching history:', error);
        setError(error.message || 'Failed to load issue history');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchHistory();
    } else {
      setLoading(false);
    }
  }, [user]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'merged':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'open':
        return <Clock className="h-4 w-4 text-blue-500" />;
      case 'closed':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      merged: 'bg-green-900/30 text-green-400 border-green-700',
      open: 'bg-blue-900/30 text-blue-400 border-blue-700',
      closed: 'bg-red-900/30 text-red-400 border-red-700'
    };

    return (
      <Badge
        variant="outline"
        className={variants[status as keyof typeof variants] || variants.open}
      >
        <span className="flex items-center gap-1">
          {getStatusIcon(status)}
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <Card className="border-red-900 bg-red-950/20">
        <CardContent className="p-6">
          <div className="text-center">
            <p className="text-red-400 mb-2">Failed to load issue history</p>
            <p className="text-sm text-red-300">{error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!user) {
    return (
      <Card className="border-gray-800 bg-black">
        <CardContent className="p-6">
          <div className="text-center">
            <Github className="h-12 w-12 text-gray-500 mx-auto mb-4" />
            <p className="text-gray-400">Please sign in to view your issue history</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Your Issue Solving History</h2>
          <p className="text-gray-400 mt-1">Track your contributions to open source projects</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">Total solved</p>
          <p className="text-2xl font-bold text-white">{history.length}</p>
        </div>
      </div>

      {history.length === 0 ? (
        <Card className="border-gray-800 bg-black">
          <CardContent className="p-8">
            <div className="text-center">
              <div className="h-16 w-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <Github className="h-8 w-8 text-gray-500" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">No issues solved yet</h3>
              <p className="text-gray-400 mb-4">
                Start contributing to open source projects to build your history here.
              </p>
              <Button asChild className="bg-blue-600 hover:bg-blue-700">
                <a href="/search">Find Issues to Solve</a>
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {history.map((item) => (
            <Card key={item.id} className="border-gray-800 bg-black hover:bg-gray-950 transition-colors">
              <CardContent className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      {getStatusBadge(item.prStatus)}
                      <span className="text-sm text-gray-500">
                        <Calendar className="h-3 w-3 inline mr-1" />
                        {item.solvedAt.toLocaleDateString()}
                      </span>
                    </div>

                    <h3 className="font-semibold text-white mb-2">
                      <a
                        href={item.issueUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-blue-400 transition-colors flex items-center gap-1"
                      >
                        {item.issueTitle}
                        <ExternalLink className="h-3 w-3 flex-shrink-0" />
                      </a>
                    </h3>

                    <div className="flex items-center gap-4 text-sm text-gray-400 mb-3">
                      <span className="font-mono bg-gray-900 px-2 py-1 rounded">
                        {item.repository}
                      </span>
                      {item.labels && item.labels.length > 0 && (
                        <div className="flex items-center gap-1">
                          {item.labels.slice(0, 3).map((label, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {label}
                            </Badge>
                          ))}
                          {item.labels.length > 3 && (
                            <span className="text-xs text-gray-500">+{item.labels.length - 3}</span>
                          )}
                        </div>
                      )}
                    </div>

                    {item.prUrl && (
                      <Button
                        variant="outline"
                        size="sm"
                        asChild
                        className="border-gray-700 bg-gray-900 text-white hover:bg-gray-800"
                      >
                        <a
                          href={item.prUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1"
                        >
                          <Github className="h-3 w-3" />
                          View Pull Request
                        </a>
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}; 