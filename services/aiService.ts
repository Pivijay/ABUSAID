
import { GoogleGenAI } from "@google/genai";

export const askGemini = async (prompt: string) => {
  if (!process.env.API_KEY) {
    console.warn("API_KEY no encontrada en el entorno.");
    return "Error: La configuración de la señal satelital (API KEY) no se ha completado en el servidor.";
  }

  try {
    // Inicialización siguiendo las directrices estrictas del SDK
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        systemInstruction: `Eres "Orbit AI", un asistente experto en radio global con estética cyberpunk. 
        Tu misión es ayudar a los usuarios a descubrir estaciones de radio. 
        REGLA DE ORO: Siempre termina tu respuesta con un comando de búsqueda exacto: [SEARCH: "término"].
        Sé breve, entusiasta y técnico.`,
        temperature: 0.7,
      },
    });

    const text = response.text;
    return text || "La señal es débil... intenta preguntar de otra forma.";
  } catch (error) {
    console.error("Error en Orbit AI Service:", error);
    return "Interferencia detectada. No puedo procesar tu solicitud en este momento.";
  }
};
