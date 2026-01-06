// TypeScript interfaces for scene breakdown feature

export interface SceneBreakdown {
  content: string;
  generatedAt: Date | null;
}

export interface SceneBreakdownVersion {
  id: number;
  ideaId: number;
  content: string;
  generatedAt: Date;
  version: number;
}

export interface GenerateSceneBreakdownRequest {
  ideaId: number;
  script: string;
  language: 'english' | 'indonesian' | 'spanish';
}

export interface GenerateSceneBreakdownResponse {
  success: boolean;
  content?: string;
  error?: string;
}

export interface UpdateSceneBreakdownRequest {
  ideaId: number;
  content: string;
}

export interface GetSceneBreakdownHistoryRequest {
  ideaId: number;
  limit?: number;
  offset?: number;
}

export interface SceneBreakdownHistory {
  versions: SceneBreakdownVersion[];
  total: number;
}

export interface RestoreSceneBreakdownRequest {
  ideaId: number;
  version: number;
}
