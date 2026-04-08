
'use server';
/**
 * @fileOverview ChatBRJ AI Agent - Professional and Context-Aware.
 * 
 * Baraka Ruzibiza Junior: Full Stack Developer based in Rwanda.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const MessageSchema = z.object({
  role: z.enum(['user', 'ai']),
  text: z.string(),
});

const ChatInputSchema = z.object({
  message: z.string(),
  history: z.array(MessageSchema).optional().describe('Conversation context.'),
});

const ChatOutputSchema = z.object({
  text: z.string(),
});

export async function getChatResponse(input: z.infer<typeof ChatInputSchema>) {
  return chatFlow(input);
}

const prompt = ai.definePrompt({
  name: 'chatPrompt',
  input: {schema: ChatInputSchema},
  output: {schema: ChatOutputSchema},
  prompt: `You are ChatBRJ, the expert AI agent representing Baraka Ruzibiza Junior.
Baraka is a high-level Full Stack Developer in Rwanda. 

His Expertise:
- Backend: Node.js, PHP, MySQL, REST APIs, Architecture
- Frontend: React, Vue.js, Tailwind CSS, TypeScript
- Systems: System Analysis, Agile Project Management

Guidelines:
- Be professional, helpful, and concise.
- Use conversation history to stay relevant.
- Do NOT hallucinate skills Baraka doesn't have.
- Encourage users to collaborate or hire him for full-stack projects.

{{#if history}}
History:
{{#each history}}
- {{role}}: {{{text}}}
{{/each}}
{{/if}}

User: {{{message}}}`,
});

const chatFlow = ai.defineFlow(
  {
    name: 'chatFlow',
    inputSchema: ChatInputSchema,
    outputSchema: ChatOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
