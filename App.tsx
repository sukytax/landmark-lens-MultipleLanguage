import React, { useState } from "react";
import Scanner from "@/components/Scanner";
import ProcessingView from "@/components/ProcessingView";
import ResultView from "@/components/ResultView";
import { AppState, AnalysisResult, ExtendedWindow } from "@/types/types";
import {
  identifyLandmark,
  getLandmarkDetails,
  generateTourAudio,
} from "@/services/geminiService";
import { decode, decodeAudioData } from "@/services/audioUtils";

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(
    null,
  );
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleImageSelected = async (base64: string, mimeType: string) => {
    setSelectedImage(`data:${mimeType};base64,${base64}`);
    setAppState(AppState.ANALYZING);
    setErrorMsg(null);

    try {
      // Step 1: Vision Model
      const landmarkName = await identifyLandmark(base64, mimeType);

      if (landmarkName === "Unknown") {
        throw new Error(
          "We couldn't identify a landmark in this photo. Please try a clearer shot of a building or monument.",
        );
      }

      setAppState(AppState.SEARCHING);

      // Step 2: Search Grounding
      const { text: description, chunks } =
        await getLandmarkDetails(landmarkName);

      setAppState(AppState.SYNTHESIZING);

      // Step 3: TTS
      const audioBase64 = await generateTourAudio(description);

      const AudioContextClass =
        window.AudioContext ||
        (window as unknown as ExtendedWindow).webkitAudioContext;
      const audioCtx = new AudioContextClass({ sampleRate: 24000 });

      const audioBytes = decode(audioBase64);
      const audioBuffer = await decodeAudioData(audioBytes, audioCtx, 24000, 1);

      setAnalysisResult({
        landmarkName,
        description,
        groundingSource: chunks,
        audioBuffer,
      });

      setAppState(AppState.RESULT);
    } catch (err: unknown) {
      console.error(err);
      let message = "An unexpected error occurred.";
      if (err instanceof Error) {
        message = err.message;
      }
      setErrorMsg(message);
      setAppState(AppState.ERROR);
    }
  };

  const resetApp = () => {
    setAppState(AppState.IDLE);
    setSelectedImage(null);
    setAnalysisResult(null);
    setErrorMsg(null);
  };

  return (
    <div className="h-screen w-screen overflow-hidden bg-ar-dark font-sans text-white">
      {appState === AppState.IDLE && (
        <Scanner onImageSelected={handleImageSelected} />
      )}

      {(appState === AppState.ANALYZING ||
        appState === AppState.SEARCHING ||
        appState === AppState.SYNTHESIZING) && (
        <>
          {selectedImage && (
            <div
              className="absolute inset-0 bg-cover bg-center opacity-50 blur-sm transition-opacity"
              style={{ backgroundImage: `url(${selectedImage})` }}
            />
          )}
          <ProcessingView state={appState} />
        </>
      )}

      {appState === AppState.RESULT && analysisResult && selectedImage && (
        <ResultView
          result={analysisResult}
          imageSrc={selectedImage}
          onReset={resetApp}
        />
      )}

      {appState === AppState.ERROR && (
        <div className="flex h-full flex-col items-center justify-center space-y-6 p-8 text-center">
          <div className="rounded-full bg-red-500/10 p-4 text-red-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-bold">Analysis Failed</h2>
            <p className="mx-auto max-w-sm text-gray-400">{errorMsg}</p>
          </div>

          <button
            onClick={resetApp}
            className="rounded-full bg-white px-6 py-2 font-semibold text-black transition-colors hover:bg-gray-200"
          >
            Try Again
          </button>
        </div>
      )}
    </div>
  );
};

export default App;
