
import { GoogleGenAI } from "@google/genai";
import { ChatMessage } from "../types";

// Always initialize GoogleGenAI with a named parameter using process.env.API_KEY.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getGeminiResponse = async (history: ChatMessage[], prompt: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [
        ...history.map(msg => ({
          role: msg.role,
          parts: [{ text: msg.text }]
        })),
        { role: 'user', parts: [{ text: prompt }] }
      ],
      config: {
        // Move personality and rules to systemInstruction for better model steering.
        systemInstruction: "Kamu adalah asisten ahli dari Bank Sampah Gresik (B-Gres). Tugasmu adalah membantu masyarakat Gresik mengelola sampah, memberikan tips daur ulang, mengidentifikasi jenis sampah, dan menjelaskan manfaat ekonomi dari bank sampah. Gunakan bahasa Indonesia yang ramah dan informatif.",
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
      }
    });

    // Access the text property directly from the GenerateContentResponse object.
    return response.text || "Maaf, saya sedang mengalami kendala teknis.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Maaf, terjadi kesalahan saat menghubungi asisten AI.";
  }
};
