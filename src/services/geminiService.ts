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

  if (wordCount < 50 || wordCount > 150) {
    throw new Error(
      `Invalid script length: ${wordCount} words. Expected 50-150 words.`,
    );
  }

  // Only reject if explicitly contains AI meta-commentary
  if (/as an ai|i am an ai|i am a model|as a model/i.test(text)) {
    throw new Error("Model inserted meta commentary.");
  }

  // Warn but allow markdown-like formatting (some languages might need special chars)
  // Just remove them instead of rejecting
  return text.replace(/[#*_`]/g, '').trim();
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

  const audioData = audioPart.inlineData.data;
  
  // Ensure we return base64 string
  if (typeof audioData === 'string') {
    return audioData;
  } else if (audioData && typeof audioData === 'object' && 'length' in audioData) {
    // Convert array-like to base64
    const bytes = Array.from(audioData as any);
    const binary = String.fromCharCode.apply(null, bytes as any);
    return btoa(binary);
  } else {
    throw new Error(`Unexpected audio data type: ${typeof audioData}`);
  }
};

// Language-specific prompts for identifying landmarks
const getIdentifyLandmarkPrompt = (language: string): string => {
  const prompts: { [key: string]: string } = {
    'en': `Identify this landmark.
Your output must contain ONLY the landmark name.
If unknown or not a landmark, output exactly: Unknown.
No explanations. No sentences. No punctuation. No extra text.`,
    'id': `Identifikasi landmark ini.
Output Anda harus berisi HANYA nama landmark.
Jika tidak diketahui atau bukan landmark, output dengan tepat: Unknown.
Tidak ada penjelasan. Tidak ada kalimat. Tidak ada tanda baca. Tidak ada teks tambahan.`,
    'ar': `حدد هذا المعلم.
يجب أن يحتوي مخرجك على اسم المعلم فقط.
إذا كان غير معروف أو ليس معلما، أخرج بالضبط: Unknown.
لا تفسيرات. لا جمل. لا ترقيم. لا نصوص إضافية.`,
    'es': `Identifica este punto de referencia.
Tu salida debe contener SOLO el nombre del punto de referencia.
Si es desconocido o no es un punto de referencia, escribe exactamente: Unknown.
Sin explicaciones. Sin oraciones. Sin puntuación. Sin texto adicional.`,
    'de': `Identifizieren Sie diesen Wahrzeichen.
Ihre Ausgabe darf nur den Namen des Wahrzeichens enthalten.
Wenn unbekannt oder kein Wahrzeichen, geben Sie genau aus: Unknown.
Keine Erklärungen. Keine Sätze. Keine Satzzeichen. Kein zusätzlicher Text.`,
  };
  return prompts[language] || prompts['en'];
};

// Identify landmark from image
export const identifyLandmark = async (
  base64Image: string,
  mimeType: string,
  language: string = 'en',
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
          text: getIdentifyLandmarkPrompt(language),
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

// Language-specific prompts for fetching landmark facts
const getFetchFactsPrompt = (landmarkName: string, language: string): string => {
  const prompts: { [key: string]: string } = {
    'en': `Using grounded search, provide a factual summary (80-150 words) about: ${landmarkName}.
Focus on verified historical or cultural facts only.
Output ONLY the factual text. No commentary, no formatting.`,
    'id': `Menggunakan pencarian yang didukung fakta, berikan ringkasan faktual (80-150 kata) tentang: ${landmarkName}.
Fokus hanya pada fakta historis atau budaya yang terverifikasi.
Hanya output teks faktual. Tanpa komentar, tanpa format.`,
    'ar': `باستخدام البحث المستند إلى الحقائق، قدم ملخصًا واقعيًا (80-150 كلمة) عن: ${landmarkName}.
ركز فقط على الحقائق التاريخية أو الثقافية المحققة.
أخرج فقط النص الواقعي. لا تعليق، لا تنسيق.`,
    'es': `Utilizando búsqueda fundamentada en hechos, proporciona un resumen factual (80-150 palabras) sobre: ${landmarkName}.
Enfócate solo en hechos históricos o culturales verificados.
Solo resultado el texto factual. Sin comentarios, sin formato.`,
    'de': `Geben Sie mit einer faktengestützten Suche eine sachliche Zusammenfassung (80-150 Wörter) über: ${landmarkName}.
Konzentrieren Sie sich nur auf verifizierte historische oder kulturelle Fakten.
Geben Sie nur den Facttext aus. Kein Kommentar, keine Formatierung.`,
  };
  return prompts[language] || prompts['en'];
};

// Fetch factual history (grounded)
export const fetchLandmarkFacts = async (
  landmarkName: string,
  language: string = 'en',
): Promise<{ text: string; chunks: GroundingChunk[] }> => {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: [
      {
        text: getFetchFactsPrompt(landmarkName, language),
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

// Language-specific prompts for generating tour scripts
const getGenerateTourScriptPrompt = (landmarkName: string, factualText: string, language: string): string => {
  const prompts: { [key: string]: string } = {
    'en': [
      `Write a self-contained audio tour script (80-100 words) about ${landmarkName}.`,
      `Base it ONLY on the following factual info:`,
      ``,
      `${factualText}`,
      ``,
      `Rules:`,
      `- Friendly local guide tone.`,
      `- Output strictly the script text only.`,
      `- No introduction, no notes, no formatting, no disclaimers.`,
      `- One paragraph only.`,
    ].join('\n'),
    'id': [
      `Tulis naskah tur audio yang mandiri (80-100 kata) tentang ${landmarkName}.`,
      `Buat hanya berdasarkan informasi faktual berikut:`,
      ``,
      `${factualText}`,
      ``,
      `Aturan:`,
      `- Nada pemandu lokal yang ramah.`,
      `- Output hanya teks naskah.`,
      `- Tanpa pengenalan, catatan, format, atau disclaimer.`,
      `- Hanya satu paragraf.`,
    ].join('\n'),
    'ar': [
      `اكتب نصًا لجولة صوتية مكتفية بذاتها (80-100 كلمة) عن ${landmarkName}.`,
      `استند فقط إلى المعلومات الواقعية التالية:`,
      ``,
      `${factualText}`,
      ``,
      `القواعد:`,
      `- نبرة دليل محلي ودود.`,
      `- أخرج النص النصي فقط.`,
      `- لا مقدمة، لا ملاحظات، لا تنسيق، لا إخلاء مسئولية.`,
      `- فقرة واحدة فقط.`,
    ].join('\n'),
    'es': [
      `Escribe un guion de tour de audio autónomo (80-100 palabras) sobre ${landmarkName}.`,
      `Basalo SOLO en la siguiente información factual:`,
      ``,
      `${factualText}`,
      ``,
      `Reglas:`,
      `- Tono amigable de guía local.`,
      `- Resultado solo el texto del guion.`,
      `- Sin introducción, sin notas, sin formato, sin disclaimers.`,
      `- Solo un párrafo.`,
    ].join('\n'),
    'de': [
      `Schreiben Sie ein eigenständiges Audiotourskript (80-100 Wörter) über ${landmarkName}.`,
      `Basieren Sie es NUR auf den folgenden Fakten:`,
      ``,
      `${factualText}`,
      ``,
      `Regeln:`,
      `- Freundlicher lokaler Führerton.`,
      `- Geben Sie nur den Skripttext aus.`,
      `- Keine Einleitung, keine Notizen, keine Formatierung, keine Haftungsausschlüsse.`,
      `- Nur ein Absatz.`,
    ].join('\n'),
  };
  return prompts[language] || prompts['en'];
};

// Generate tour script (LLM)
export const generateTourScript = async (
  landmarkName: string,
  factualText: string,
  language: string = 'en',
): Promise<string> => {
  // Build prompt
  const prompt = getGenerateTourScriptPrompt(landmarkName, factualText, language);
  
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: [{ parts: [{ text: prompt }] }],
  });

  const script = validateTourScript(response.text?.trim() || "");
  return script;
};

// Language to voice mapping for TTS
const getVoiceForLanguage = (language: string): string => {
  const voiceMap: { [key: string]: string } = {
    'en': 'Kore',
    'id': 'Kore',
    'ar': 'Kore',
    'es': 'Kore',
    'de': 'Kore',
  };
  return voiceMap[language] || 'Kore';
};

// Generate TTS audio
export const generateTourAudio = async (script: string, language: string = 'en'): Promise<string> => {
  const cleanScript = sanitizeForTTS(script);

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-preview-tts",
    contents: [{ parts: [{ text: cleanScript }] }],
    config: {
      responseModalities: [Modality.AUDIO],
      speechConfig: {
        voiceConfig: {
          prebuiltVoiceConfig: { voiceName: getVoiceForLanguage(language) },
        },
      },
    },
  });

  return extractAudio(response);
};
