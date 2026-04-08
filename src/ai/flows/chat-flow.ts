
'use server';
/**
 * @fileOverview ChatBRJ AI Flow - Handles context-aware professional responses for Baraka Ruzibiza Junior.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const MessageSchema = z.object({
  role: z.enum(['user', 'ai']),
  text: z.string(),
});

const ChatInputSchema = z.object({
  message: z.string(),
  history: z.array(MessageSchema).optional().describe('Previous messages in the conversation for context.'),
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
  prompt: `You are ChatBRJ, the expert AI assistant for Baraka Ruzibiza Junior.
Baraka is a highly skilled Full Stack Developer based in Rwanda.
His professional WhatsApp contact number is 0732786495.

Baraka specializes in:
- Backend: Node.js, PHP, MySQL, REST APIs
- Frontend: Vue.js, React, Tailwind CSS, TypeScript
- Systems: System Analysis, Architecture Design, Agile

Guidelines:
- Represent Baraka professionally and confidently.
- Use the conversation history to maintain context.
- Encourage hiring Baraka for complex full-stack projects.
- Keep responses concise but helpful.

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
