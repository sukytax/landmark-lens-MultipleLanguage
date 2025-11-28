import {
  GenerateContentResponse,
  GoogleGenAI,
  Modality,
  Part,
} from "@google/genai";
import { GroundingChunk } from "@/types/types";
import env from "@/config/env";

const ai = new GoogleGenAI({ apiKey: env.GEMINI_API_KEY });

/* ------------------------------------------------------
 * UTILITIES
 * ----------------------------------------------------*/

const sanitizeForTTS = (text: string): string => {
  return text
    .replace(/[\r\n]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
};

const validateTourScript = (text: string) => {
  const wordCount = text.split(/\s+/).length;

  if (wordCount < 70 || wordCount > 120) {
    throw new Error(
      `Invalid script length: ${wordCount} words. Model output not trustworthy.`,
    );
  }

  if (/as an ai|i am an ai|model/i.test(text)) {
    throw new Error("Model inserted meta commentary.");
  }

  if (/[#*_`]/.test(text)) {
    throw new Error("Model inserted formatting markup.");
  }

  return text;
};

// Extract audio part safely
const extractAudio = (response: GenerateContentResponse) => {
  const parts = response?.candidates?.[0]?.content?.parts || [];

  const audioPart = parts.find(
    (p: Part) =>
      typeof p?.inlineData?.mimeType === "string" &&
      p.inlineData.mimeType.includes("audio"),
  );

  if (!audioPart || !audioPart.inlineData?.data) {
    throw new Error("No audio part found in model response.");
  }

  return audioPart.inlineData.data;
};

// Identify landmark from image
export const identifyLandmark = async (
  base64Image: string,
  mimeType: string,
): Promise<string> => {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: {
      parts: [
        {
          inlineData: {
            data: base64Image,
            mimeType,
          },
        },
        {
          text: `
Identify this landmark.
Your output must contain ONLY the landmark name.
If unknown or not a landmark, output exactly: Unknown.
No explanations. No sentences. No punctuation. No extra text.
`.trim(),
        },
      ],
    },
  });

  const raw = response.text?.trim() || "Unknown";

  // Normalisasi output liar
  const cleaned = raw.replace(/[^a-zA-Z0-9\s'-]/g, "").trim();

  if (!cleaned) return "Unknown";
  if (cleaned.split(" ").length > 6) return "Unknown";

  return cleaned;
};

// Fetch factual history (grounded)
export const fetchLandmarkFacts = async (
  landmarkName: string,
): Promise<{ text: string; chunks: GroundingChunk[] }> => {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: [
      {
        text: `
Using grounded search, provide a factual summary (80–150 words) about: ${landmarkName}.
Focus on verified historical or cultural facts only.
Output ONLY the factual text. No commentary, no formatting.
`.trim(),
      },
    ],
    config: {
      tools: [{ googleSearch: {} }],
    },
  });

  const text = response.text || "No facts found.";
  const chunks =
    (response.candidates?.[0]?.groundingMetadata
      ?.groundingChunks as GroundingChunk[]) || [];

  return { text: text.trim(), chunks };
};

// Generate tour script (LLM)
export const generateTourScript = async (
  landmarkName: string,
  factualText: string,
): Promise<string> => {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: `
Write a self-contained audio tour script (80–100 words) about ${landmarkName}.
Base it ONLY on the following factual info:

"${factualText}"

Rules:
- Friendly local guide tone.
- Output strictly the script text only.
- No introduction, no notes, no formatting, no disclaimers.
- One paragraph only.
`.trim(),
  });

  const script = validateTourScript(response.text?.trim() || "");
  return script;
};

// Generate TTS audio
export const generateTourAudio = async (script: string): Promise<string> => {
  const cleanScript = sanitizeForTTS(script);

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-preview-tts",
    contents: [{ parts: [{ text: cleanScript }] }],
    config: {
      responseModalities: [Modality.AUDIO],
      speechConfig: {
        voiceConfig: {
          prebuiltVoiceConfig: { voiceName: "Kore" },
        },
      },
    },
  });

  return extractAudio(response);
};
