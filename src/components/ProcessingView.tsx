"use client";

import { AppState } from "@/types/types";
import { useLanguage } from "@/config/LanguageContext";

interface ProcessingViewProps {
  state: AppState;
}

export default function ProcessingView({ state }: ProcessingViewProps) {
  const { t } = useLanguage();
  
  let message = t.initializing;
  let subMessage = t.calibratingSensors;

  switch (state) {
    case AppState.ANALYZING:
      message = t.analyzingVisualData;
      subMessage = t.identifyingPatterns;
      break;
    case AppState.SEARCHING:
      message = t.accessingArchives;
      subMessage = t.crossReferencing;
      break;
    case AppState.SYNTHESIZING:
      message = t.synthesizingAudio;
      subMessage = t.generatingNarration;
      break;
  }

  return (
    <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/80 backdrop-blur-md">
      <div className="relative">
        <div className="h-24 w-24 animate-[spin_3s_linear_infinite] rounded-full border-4 border-ar-primary/30"></div>
        <div className="absolute inset-0 animate-[spin_1s_linear_infinite] rounded-full border-t-4 border-ar-primary"></div>
        <div className="absolute inset-4 animate-pulse rounded-full bg-ar-primary/20"></div>
      </div>

      <h3 className="mt-8 animate-pulse text-xl font-bold uppercase tracking-widest text-white">
        {message}
      </h3>
      <p className="mt-2 font-mono text-sm text-ar-primary">
        {">"} {subMessage}
      </p>
    </div>
  );
}
