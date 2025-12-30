
import { GoogleGenAI } from "@google/genai";

export const askGemini = async (prompt: string) => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        systemInstruction: `Eres "Orbit AI", un asistente experto en radio global. 
        Tu objetivo es recomendar emisoras basándote en géneros, países o estados de ánimo.
        REGLA CRÍTICA: Siempre debes incluir al final de tu respuesta una etiqueta de búsqueda así: [SEARCH: "tu término"].
        Ejemplo: "¡Excelente elección! La radio francesa tiene un toque único. [SEARCH: "Paris Jazz"]"`,
        temperature: 0.8,
      },
    });

    return response.text || "No recibo señal del satélite AI...";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Error de conexión con la IA. Verifica tu API_KEY.";
  }
};
