export interface AiSystemStatus {
  status: 'operational' | 'ready' | 'not_initialized' | 'error';
  provider: string;
  ai: {
    connected: boolean;
    model: string;
  };
  knowledgeBase: Record<string, unknown>;
  capabilities: Record<string, boolean>;
  timestamp: string;
}

export interface AiInitResult {
  status: 'initialized' | 'ready' | 'not_initialized';
  message?: string;
  stats: Record<string, unknown>;
  aiStatus: 'connected' | 'disconnected';
}

export interface AiIngestResult {
  success: boolean;
  data: Record<string, unknown>;
  message: string;
}
