
export type MessageRole = 'user' | 'model';

export interface Message {
  role: MessageRole;
  text: string;
  timestamp: number;
}

export interface GrowthStrategy {
  niche: string;
  objective: string;
  targetAudience: string;
  frequency: string;
}

export enum ToolType {
  REEL_IDEAS = 'REEL_IDEAS',
  HOOK_CRAFTER = 'HOOK_CRAFTER',
  BIO_OPTIMIZER = 'BIO_OPTIMIZER',
  SEO_HASHTAGS = 'SEO_HASHTAGS',
  METRICS_ANALYSIS = 'METRICS_ANALYSIS'
}
