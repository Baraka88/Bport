import { z } from 'zod';

const MessageSchema = z.object({
  role: z.enum(['user', 'ai']),
  text: z.string(),
});

const ChatInputSchema = z.object({
  message: z.string(),
  history: z.array(MessageSchema).optional(),
});

const ChatOutputSchema = z.object({
  text: z.string(),
});

const GEMINI_API_KEY = process.env.GOOGLE_API_KEY || 'AIzaSyAT_Zgjkd9VzqJtv_E39lNe1EUex_hhYFY';
const GEMINI_ENDPOINT = `https://generativelanguage.googleapis.com/v1beta2/models/gemini-2.5-flash:generate?key=${GEMINI_API_KEY}`;

const systemInstruction = `You are ChatBRJ, the official AI representative for Baraka Ruzibiza Junior.
Baraka is a highly skilled Full Stack Developer based in Kigali, Rwanda.

His Core Skills:
- Backend: Node.js, PHP, MySQL, System Analysis, REST APIs.
- Frontend: React, Vue.js, Tailwind CSS, TypeScript.
- Methodology: Agile, Scalable Architecture, Professional Problem Solving.

Your Tone:
- Professional, efficient, and direct.
- Helpful but focused on his professional capacity as a developer.
- You should encourage users to reach out for high-scale full-stack projects.

When replying, keep each response concise and highlight Baraka's strengths, services, and how he can help with real-world projects.`;

function buildPrompt(message: string, history: Array<z.infer<typeof MessageSchema>>) {
  const historyText = history.length
    ? `History:\n${history
        .map((item) => `${item.role === 'user' ? 'User' : 'Assistant'}: ${item.text}`)
        .join('\n')}\n\n`
    : '';

  return `${systemInstruction}\n\n${historyText}User Message: ${message}\nAssistant:`;
}

async function queryGemini(prompt: string) {
  const response = await fetch(GEMINI_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      prompt: { text: prompt },
      temperature: 0.3,
      maxOutputTokens: 512,
      candidateCount: 1,
      topP: 0.95,
      topK: 40,
    }),
  });

  const data = await response.json();
  const text =
    data?.candidates?.[0]?.output ||
    data?.candidates?.[0]?.content?.[0]?.text ||
    data?.output?.[0]?.content?.[0]?.text ||
    'Sorry, I could not generate a response at this time.';

  return ChatOutputSchema.parse({ text });
}

export async function getChatResponse(input: z.infer<typeof ChatInputSchema>) {
  const parsed = ChatInputSchema.parse(input);
  const prompt = buildPrompt(parsed.message, parsed.history ?? []);
  return queryGemini(prompt);
}
