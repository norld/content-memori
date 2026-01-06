'use client';

import { useState, useEffect } from 'react';
import { Clock, Eye, RotateCcw } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { parseSceneBreakdown, type Scene } from '@/lib/types/scene';
import { SceneCard } from '@/components/scene-card';
import { formatRelativeTime } from '@/lib/time';

interface SceneBreakdownVersion {
  id: number;
  idea_id: number;
  content: string;
  generated_at: string;
  version: number;
}

interface SceneBreakdownHistoryProps {
  ideaId: number;
  onRestore?: (content: string) => void;
}

export function SceneBreakdownHistory({
  ideaId,
  onRestore,
}: SceneBreakdownHistoryProps) {
  const { session } = useAuth();
  const [versions, setVersions] = useState<SceneBreakdownVersion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedVersion, setSelectedVersion] = useState<SceneBreakdownVersion | null>(null);
  const [restoring, setRestoring] = useState(false);

  const getAuthHeaders = () => {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (session?.access_token) {
      headers['Authorization'] = `Bearer ${session.access_token}`;
    }

    return headers;
  };

  useEffect(() => {
    loadHistory();
  }, [ideaId]);

  const loadHistory = async () => {
    if (!session) return;

    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        ideaId: ideaId.toString(),
        limit: '50',
      });

      const response = await fetch(`/api/scene-breakdown/history?${params}`, {
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to load history');
      }

      const data = await response.json();
      setVersions(data.versions || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRestore = async (version: number) => {
    if (!session) return;

    setRestoring(true);
    setError(null);

    try {
      const response = await fetch('/api/scene-breakdown/restore', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          ideaId,
          version,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to restore');
      }

      const data = await response.json();

      // Trigger refresh of main content with restored content
      if (onRestore && data.content) {
        onRestore(data.content);
      }

      // Close the history view
      setSelectedVersion(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setRestoring(false);
    }
  };

  const getVersionScenes = (content: string): Scene[] => {
    return parseSceneBreakdown(content);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Unknown';
    try {
      return formatRelativeTime(dateString);
    } catch {
      return 'Invalid date';
    }
  };

  if (loading) {
    return (
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-neutral-400 flex items-center gap-2">
          <Clock size={16} />
          Generation History
        </h4>
        <div className="text-neutral-500 text-sm">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-neutral-400 flex items-center gap-2">
          <Clock size={16} />
          Generation History
        </h4>
        <div className="text-red-400 text-sm">{error}</div>
      </div>
    );
  }

  if (versions.length === 0) {
    return (
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-neutral-400 flex items-center gap-2">
          <Clock size={16} />
          Generation History
        </h4>
        <div className="text-neutral-500 text-sm">No history available</div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h4 className="text-sm font-medium text-neutral-400 flex items-center gap-2">
        <Clock size={16} />
        Generation History ({versions.length} version{versions.length !== 1 ? 's' : ''})
      </h4>

      <div className="space-y-2 max-h-[400px] overflow-y-auto">
        {versions.map((version) => {
          const scenes = getVersionScenes(version.content);
          return (
            <div
              key={version.id}
              className="p-3 bg-white/5 rounded-lg border border-white/5 hover:border-red-600/20 transition-colors"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-medium text-red-400">
                      Version {version.version}
                    </span>
                    <span className="text-xs text-neutral-500">
                      {scenes.length} scene{scenes.length !== 1 ? 's' : ''}
                    </span>
                    <span className="text-xs text-neutral-600">
                      • {formatDate(version.generated_at)}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-500 line-clamp-1">
                    {scenes.length > 0 ? scenes[0].action : 'No scenes available'}
                  </p>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => setSelectedVersion(version)}
                    className="p-2 hover:bg-white/5 rounded-lg transition-colors"
                    title="View full version"
                  >
                    <Eye size={14} className="text-neutral-500" />
                  </button>
                  <button
                    onClick={() => handleRestore(version.version)}
                    disabled={restoring}
                    className="p-2 hover:bg-red-600/10 rounded-lg transition-colors disabled:opacity-50"
                    title="Restore this version"
                  >
                    <RotateCcw size={14} className="text-neutral-500 hover:text-red-400" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Version Detail Modal */}
      {selectedVersion && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setSelectedVersion(null)}
          />
          <div className="relative w-full max-w-2xl bg-neutral-900 rounded-2xl shadow-2xl border border-white/10 max-h-[80vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-white/5">
              <div>
                <h3 className="text-sm font-semibold text-neutral-200">
                  Version {selectedVersion.version}
                </h3>
                <p className="text-xs text-neutral-500 mt-1">
                  {formatDate(selectedVersion.generated_at)}
                </p>
              </div>
              <button
                onClick={() => setSelectedVersion(null)}
                className="p-2 hover:bg-white/5 rounded-lg transition-colors text-neutral-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {(() => {
                const scenes = getVersionScenes(selectedVersion.content);
                if (scenes.length === 0) {
                  return (
                    <div className="text-center py-8 text-neutral-500">
                      No scenes available in this version
                    </div>
                  );
                }
                return (
                  <div className="space-y-3">
                    {scenes.map((scene) => (
                      <SceneCard key={scene.scene} scene={scene} />
                    ))}
                  </div>
                );
              })()}
            </div>

            <div className="flex justify-end p-4 border-t border-white/5 bg-neutral-900/50">
              <button
                onClick={() => {
                  handleRestore(selectedVersion.version);
                  setSelectedVersion(null);
                }}
                disabled={restoring}
                className="px-4 py-2 bg-red-600/10 hover:bg-red-600/20 text-red-400 border border-red-600/20 rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2 text-xs font-medium"
              >
                <RotateCcw size={14} />
                {restoring ? 'Restoring...' : 'Restore This Version'}
              </button>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="p-3 bg-red-500/10 text-red-400 rounded-lg border border-red-500/20 text-sm">
          {error}
        </div>
      )}
    </div>
  );
}
