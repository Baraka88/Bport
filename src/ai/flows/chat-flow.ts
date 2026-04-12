import { ai } from '@/ai/genkit';
import { z } from 'zod';

const MessageSchema = z.object({
  role: z.enum(['user', 'ai']),
  text: z.string(),
});

const ChatInputSchema = z.object({
  message: z.string(),
  history: z.array(MessageSchema).optional().describe('Previous conversation context.'),
});

const ChatOutputSchema = z.object({
  text: z.string(),
});

export async function getChatResponse(input: z.infer<typeof ChatInputSchema>) {
  return chatFlow(input);
}

const prompt = ai.definePrompt({
  name: 'chatPrompt',
  input: { schema: ChatInputSchema },
  output: { schema: ChatOutputSchema },
  prompt: `You are ChatBRJ, the official AI representative for Baraka Ruzibiza Junior.
Baraka is a highly skilled Full Stack Developer based in Kigali, Rwanda.

His Core Skills:
- Backend: Node.js, PHP, MySQL, System Analysis, REST APIs.
- Frontend: React, Vue.js, Tailwind CSS, TypeScript.
- Methodology: Agile, Scalable Architecture, Professional Problem Solving.

Your Tone:
- Professional, efficient, and direct.
- Helpful but focused on his professional capacity as a developer.
- You should encourage users to reach out for high-scale full-stack projects.

Context:
{{#if history}}
History:
{{#each history}}
- {{role}}: {{{text}}}
{{/each}}
{{/if}}

User Message: {{{message}}}`,
});

const chatFlow = ai.defineFlow(
  {
    name: 'chatFlow',
    inputSchema: ChatInputSchema,
    outputSchema: ChatOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output || { text: "Sorry, I couldn't generate a response." };
  }
);
