export interface GroundingChunk {
  web?: {
    uri: string;
    title: string;
  };
}

// Type used for internal app state (decoded audio)
export interface AnalysisResult {
  landmarkName: string;
  description: string;
  groundingSource: GroundingChunk[];
  audioBuffer?: AudioBuffer;
}

// Type used for API response (encoded audio)
export interface AnalysisResponse {
  landmarkName: string;
  description: string;
  groundingSource: GroundingChunk[];
  audioBase64: string;
}

export enum AppState {
  IDLE = "IDLE",
  ANALYZING = "ANALYZING", // Image recognition
  SEARCHING = "SEARCHING", // Grounding search
  SYNTHESIZING = "SYNTHESIZING", // TTS
  RESULT = "RESULT",
  ERROR = "ERROR",
}

// Interface for Window with WebKit AudioContext support
export interface ExtendedWindow extends Window {
  webkitAudioContext: typeof AudioContext;
}
