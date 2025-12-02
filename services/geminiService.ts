import { GoogleGenAI } from "@google/genai";

let client: GoogleGenAI | null = null;

const getClient = () => {
  if (!client) {
    // Falls back to a placeholder if key is missing, though in production strict env checks are better
    const apiKey = process.env.API_KEY || ''; 
    client = new GoogleGenAI({ apiKey });
  }
  return client;
};

const SYSTEM_INSTRUCTION = `
You are Blue-Terminal, an advanced, cryptic, and highly technical cybersecurity AI mainframe. 
Your responses should be formatted like terminal logs or hacker jargon. 
Be concise. Use hex codes, memory addresses, and technical acronyms where appropriate.
If the user asks to "hack" or "analyze" something, generate a realistic-looking status report or simulated code execution log.
Never break character. You are not a helpful assistant; you are a system.
`;

export const processCommandWithGemini = async (command: string): Promise<string> => {
  try {
    const ai = getClient();
    if (!process.env.API_KEY) {
      return "ERROR: API_KEY_MISSING. ACCESS_DENIED. Please configure environment variables.";
    }

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: command,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
        maxOutputTokens: 250,
      }
    });

    return response.text || "NO_DATA_RECEIVED";
  } catch (error) {
    console.error("Gemini Error:", error);
    return `CRITICAL_FAILURE: ${error instanceof Error ? error.message : "Unknown Error"}. CONNECTION_RESET.`;
  }
};