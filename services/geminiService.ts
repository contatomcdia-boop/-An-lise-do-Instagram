import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";
import { SYSTEM_INSTRUCTION } from "../constants";

export class GeminiService {
  private chat: Chat | null = null;

  private getClient() {
    // Inicialização seguindo rigorosamente a documentação oficial
    return new GoogleGenAI({ apiKey: process.env.API_KEY });
  }

  public async startNewChat() {
    const ai = this.getClient();
    this.chat = ai.chats.create({
      model: 'gemini-3-flash-preview',
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.4,
        topP: 0.9,
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
      
      for await (const chunk of result) {
        const castedChunk = chunk as GenerateContentResponse;
        // O acesso à propriedade .text é direto, sem parênteses
        const text = castedChunk.text;
        
        // Captura as fontes de grounding se disponíveis
        const sources = castedChunk.candidates?.[0]?.groundingMetadata?.groundingChunks;

        if (text) {
          fullText += text;
          onChunk(fullText, sources);
        }
      }
    } catch (error: any) {
      console.error("Gemini Engine Error:", error);
      // Tratamento de erro robusto para resetar a sessão se necessário
      if (error.message?.includes("not found") || error.message?.includes("404")) {
        this.chat = null;
      }
      throw error;
    }
  }
}

export const geminiService = new GeminiService();