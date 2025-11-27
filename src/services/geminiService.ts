import { GoogleGenAI, Modality } from "@google/genai";
import { GroundingChunk } from "@/types/types";
import env from "@/config/env";

// Server-side instance
const ai = new GoogleGenAI({ apiKey: env.GEMINI_API_KEY });

// 1. Identify the landmark using Gemini 3 Pro (Vision)
export const identifyLandmark = async (
  base64Image: string,
  mimeType: string,
): Promise<string> => {
  const response = await ai.models.generateContent({
    model: "models/gemini-flash-lite-latest",
    contents: {
      parts: [
        {
          inlineData: {
            data: base64Image,
            mimeType: mimeType,
          },
        },
        {
          text: "Identify this landmark. Return ONLY the name of the landmark. If it is not a landmark, say 'Unknown'. Do not add any other text.",
        },
      ],
    },
  });

  return response.text?.trim() || "Unknown";
};

// 2. Search for history using Gemini 2.5 Flash + Search Grounding
export const getLandmarkDetails = async (
  landmarkName: string,
): Promise<{ text: string; chunks: GroundingChunk[] }> => {
  const response = await ai.models.generateContent({
    model: "models/gemini-flash-lite-latest",
    contents: `Write a short, engaging audio tour script (approx 80-100 words) about ${landmarkName}. Focus on interesting historical facts or secrets. Make it sound like a friendly local guide speaking.`,
    config: {
      tools: [{ googleSearch: {} }],
    },
  });

  const text = response.text || "No details found.";
  const chunks =
    (response.candidates?.[0]?.groundingMetadata
      ?.groundingChunks as GroundingChunk[]) || [];

  return { text, chunks };
};

// 3. Generate Speech using Gemini 2.5 Flash TTS
// Returns Base64 string instead of AudioBuffer
export const generateTourAudio = async (text: string): Promise<string> => {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-preview-tts",
    contents: [{ parts: [{ text: text }] }],
    config: {
      responseModalities: [Modality.AUDIO],
      speechConfig: {
        voiceConfig: {
          prebuiltVoiceConfig: { voiceName: "Kore" },
        },
      },
    },
  });

  const base64Audio =
    response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
  if (!base64Audio) {
    throw new Error("No audio data received.");
  }

  return base64Audio;
};
