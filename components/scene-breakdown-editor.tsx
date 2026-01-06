'use client';

import { useState, useEffect } from 'react';
import { Sparkles } from 'lucide-react';
import DOMPurify from 'dompurify';
import debounce from 'lodash/debounce';
import { useAuth } from '@/lib/auth-context';

interface SceneBreakdownEditorProps {
  ideaId: number;
  initialContent?: string;
  script: string;
  onContentChange?: (content: string) => void;
}

export function SceneBreakdownEditor({
  ideaId,
  initialContent = '',
  script,
  onContentChange,
}: SceneBreakdownEditorProps) {
  const { session } = useAuth();
  const [content, setContent] = useState(initialContent);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getAuthHeaders = () => {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (session?.access_token) {
      headers['Authorization'] = `Bearer ${session.access_token}`;
    }

    return headers;
  };

  // Update parent component when content changes
  const updateContent = (newContent: string) => {
    setContent(newContent);
    if (onContentChange) {
      onContentChange(newContent);
    }
  };

  // Debounced auto-save for manual edits
  const debouncedSave = debounce(async (newContent: string) => {
    if (!session) return;

    try {
      const response = await fetch('/api/update-scene-breakdown', {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          ideaId,
          content: newContent,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to save');
      }
    } catch (err) {
      console.error('Auto-save error:', err);
    }
  }, 500);

  const handleEdit = (e: React.FormEvent<HTMLDivElement>) => {
    // Sanitize content to prevent XSS
    const sanitized = DOMPurify.sanitize(e.currentTarget.innerHTML, {
      ALLOWED_TAGS: ['P', 'BR', 'STRONG', 'EM', 'UL', 'OL', 'LI'],
      ALLOWED_ATTR: [],
    });

    updateContent(sanitized);
    debouncedSave(sanitized);
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold text-neutral-100 mb-2">Scene Breakdown</h3>
        <p className="text-sm text-neutral-400">
          Edit the content below or use the AI Generate button in the footer to create a scene breakdown from your script.
        </p>
      </div>

      {error && (
        <div className="p-4 bg-red-500/10 text-red-400 rounded-lg border border-red-500/20">
          {error}
        </div>
      )}

      <div
        contentEditable
        onInput={handleEdit}
        className="min-h-[300px] p-4 border border-neutral-600 rounded-lg prose prose-invert max-w-none focus:outline-none focus:ring-2 focus:ring-purple-500 bg-neutral-700/50 text-neutral-200"
        suppressContentEditableWarning
      >
        {content}
      </div>
    </div>
  );
}
