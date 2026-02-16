
import { GoogleGenAI, Modality } from "@google/genai";

/**
 * Converts a File object to its base64 string representation.
 */
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const base64String = (reader.result as string).split(',')[1];
      resolve(base64String);
    };
    reader.onerror = (error) => reject(error);
  });
};

/**
 * Edits an image using the gemini-2.5-flash-image model.
 */
export const editImage = async (prompt: string, base64Image: string, mimeType: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [
        {
          inlineData: {
            data: base64Image,
            mimeType: mimeType,
          },
        },
        {
          text: prompt,
        },
      ],
    },
    config: {
      imageConfig: {
        aspectRatio: "1:1"
      }
    }
  });

  // Traverse all parts to find the image part as per guidelines.
  if (response.candidates?.[0]?.content?.parts) {
    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        const base64EncodeString: string = part.inlineData.data;
        return `data:image/png;base64,${base64EncodeString}`;
      }
    }
  }
  throw new Error("Nenhuma imagem retornada do Gemini");
};

/**
 * Generates video using the Veo model and handles operation polling.
 */
export const generateVideo = async (
  prompt: string, 
  base64Image?: string, 
  mimeType?: string, 
  config?: { resolution: '720p' | '1080p', aspectRatio: '16:9' | '9:16' }
) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  let operation = await ai.models.generateVideos({
    model: 'veo-3.1-fast-generate-preview',
    prompt: prompt,
    image: base64Image ? {
      imageBytes: base64Image,
      mimeType: mimeType || 'image/png',
    } : undefined,
    config: {
      numberOfVideos: 1,
      resolution: config?.resolution || '720p',
      aspectRatio: config?.aspectRatio || '16:9'
    }
  });

  // Poll until the operation is complete.
  while (!operation.done) {
    await new Promise(resolve => setTimeout(resolve, 10000));
    operation = await ai.operations.getVideosOperation({ operation: operation });
  }

  const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
  if (!downloadLink) throw new Error("Falha ao gerar vídeo: Link de download não encontrado");

  // Fetch final MP4 bytes and create a local URL.
  const response = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
  const blob = await response.blob();
  return URL.createObjectURL(blob);
};

/**
 * Generates text-to-speech audio and converts raw PCM to a playable WAV Blob.
 */
export const generateTTS = async (text: string, voice: string, emotion?: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = emotion ? `${emotion}: ${text}` : text;
  
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-preview-tts",
    contents: [{ parts: [{ text: prompt }] }],
    config: {
      responseModalities: [Modality.AUDIO],
      speechConfig: {
        voiceConfig: {
          prebuiltVoiceConfig: { voiceName: voice },
        },
      },
    },
  });

  const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
  if (!base64Audio) throw new Error("Falha ao gerar áudio");

  // API returns raw PCM data; convert to WAV for standard browser audio tag support.
  const pcmBytes = decodeBase64(base64Audio);
  const wavBlob = createWavBlob(pcmBytes, 24000);
  return URL.createObjectURL(wavBlob);
};

/**
 * Decodes base64 string to Uint8Array.
 */
function decodeBase64(base64: string): Uint8Array {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

/**
 * Adds a WAV header to raw PCM data.
 */
function createWavBlob(pcmData: Uint8Array, sampleRate: number): Blob {
  const header = new ArrayBuffer(44);
  const view = new DataView(header);

  const writeString = (v: DataView, offset: number, str: string) => {
    for (let i = 0; i < str.length; i++) {
      v.setUint8(offset + i, str.charCodeAt(i));
    }
  };

  writeString(view, 0, 'RIFF');
  view.setUint32(4, 36 + pcmData.length, true);
  writeString(view, 8, 'WAVE');
  writeString(view, 12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true); // PCM Format
  view.setUint16(22, 1, true); // Mono
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true); // Byte rate
  view.setUint16(32, 2, true); // Block align
  view.setUint16(34, 16, true); // Bits per sample
  writeString(view, 36, 'data');
  view.setUint32(40, pcmData.length, true);

  return new Blob([header, pcmData], { type: 'audio/wav' });
}
