
import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";
import { SYSTEM_INSTRUCTION } from "../constants";

export class GeminiService {
  private ai: GoogleGenAI;
  private chat: Chat | null = null;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  }

  public async startNewChat() {
    this.chat = this.ai.chats.create({
      model: 'gemini-3-flash-preview',
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.4, // Lower temperature for more strategic/factual responses
        topP: 0.8,
        tools: [{ googleSearch: {} }]
      },
    });
  }

  public async sendMessageStream(message: string, onChunk: (text: string, sources?: any[]) => void) {
    if (!this.chat) {
      await this.startNewChat();
    }

    try {
      const result = await this.chat!.sendMessageStream({ message });
      let fullText = '';
      let sources: any[] = [];

      for await (const chunk of result) {
        const castedChunk = chunk as GenerateContentResponse;
        const text = castedChunk.text;
        
        // Extract grounding sources if available
        const metadata = castedChunk.candidates?.[0]?.groundingMetadata;
        if (metadata?.groundingChunks) {
            sources = metadata.groundingChunks;
        }

        if (text) {
          fullText += text;
          onChunk(fullText, sources);
        }
      }
      return { fullText, sources };
    } catch (error) {
      console.error("Gemini AI Strategic Error:", error);
      throw error;
    }
  }
}

export const geminiService = new GeminiService();
