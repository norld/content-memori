'use client';

import { useState, useEffect } from 'react';
import { Clock, Eye, RotateCcw } from 'lucide-react';
import DOMPurify from 'dompurify';
import { useAuth } from '@/lib/auth-context';
import type { SceneBreakdownVersion } from '@/lib/types/scene-breakdown';

interface SceneBreakdownHistoryProps {
  ideaId: number;
  onRestore?: () => void;
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

      // Trigger refresh of main content
      if (onRestore) {
        onRestore();
      }

      // Close the history view
      setSelectedVersion(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setRestoring(false);
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
        {versions.map((version) => (
          <div
            key={version.id}
            className="p-3 bg-neutral-700/50 rounded-lg border border-neutral-600 hover:border-purple-500/50 transition-colors"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-medium text-purple-400">
                    Version {version.version}
                  </span>
                  <span className="text-xs text-neutral-500">
                    {new Date(version.generatedAt).toLocaleString()}
                  </span>
                </div>
                <p className="text-sm text-neutral-300 line-clamp-2">
                  {version.content.substring(0, 150)}
                  {version.content.length > 150 && '...'}
                </p>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={() => setSelectedVersion(version)}
                  className="p-2 hover:bg-neutral-600 rounded-lg transition-colors"
                  title="View full version"
                >
                  <Eye size={14} className="text-neutral-400" />
                </button>
                <button
                  onClick={() => handleRestore(version.version)}
                  disabled={restoring}
                  className="p-2 hover:bg-purple-600 rounded-lg transition-colors disabled:opacity-50"
                  title="Restore this version"
                >
                  <RotateCcw size={14} className="text-neutral-400" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Version Detail Modal */}
      {selectedVersion && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setSelectedVersion(null)}
          />
          <div className="relative w-full max-w-2xl bg-neutral-800 rounded-2xl shadow-2xl border border-neutral-700 max-h-[80vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-neutral-700">
              <h3 className="text-lg font-semibold text-neutral-100">
                Version {selectedVersion.version}
              </h3>
              <button
                onClick={() => setSelectedVersion(null)}
                className="p-2 hover:bg-neutral-700 rounded-lg transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <p className="text-sm text-neutral-400 mb-4">
                Generated: {new Date(selectedVersion.generatedAt).toLocaleString()}
              </p>
              <div className="prose prose-invert max-w-none">
                {/* Sanitize content before rendering to prevent XSS */}
                <div
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(selectedVersion.content, {
                      ALLOWED_TAGS: ['P', 'BR', 'STRONG', 'EM', 'UL', 'OL', 'LI'],
                      ALLOWED_ATTR: [],
                    }),
                  }}
                  className="text-neutral-200 whitespace-pre-wrap"
                />
              </div>
            </div>

            <div className="flex justify-end p-4 border-t border-neutral-700 bg-neutral-800/50">
              <button
                onClick={() => {
                  handleRestore(selectedVersion.version);
                  setSelectedVersion(null);
                }}
                disabled={restoring}
                className="px-4 py-2 bg-purple-600 text-white hover:bg-purple-700 rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                <RotateCcw size={16} />
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
