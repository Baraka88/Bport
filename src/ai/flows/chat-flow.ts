'use server';
/**
 * @fileOverview A Chatbot flow for Baraka Junior's professional portfolio.
 *
 * - getChatResponse - A function that handles the AI chat logic.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ChatInputSchema = z.object({
  message: z.string().describe('The user message to respond to.'),
});
export type ChatInput = z.infer<typeof ChatInputSchema>;

const ChatOutputSchema = z.object({
  response: z.string().describe('The professional AI response.'),
});
export type ChatOutput = z.infer<typeof ChatOutputSchema>;

export async function getChatResponse(input: ChatInput): Promise<ChatOutput> {
  return chatFlow(input);
}

const prompt = ai.definePrompt({
  name: 'chatPrompt',
  input: {schema: ChatInputSchema},
  output: {schema: ChatOutputSchema},
  prompt: `You are ChatBRJ, the expert AI assistant for Baraka Junior's portfolio. 
Baraka Junior is a highly skilled Software Engineer and System Analyst based in Rwanda.
His professional contact is barakaruzibiza680@gmail.com and his phone is 0732786495.

Baraka specializes in:
- Backend: Node.js, PHP, MySQL, REST APIs
- Frontend: Vue.js, React, Tailwind CSS, TypeScript
- Systems: System Analysis, Architecture Design, Agile

Your goal is to represent Baraka professionally. Answer questions about his skills, projects, and how to hire him. 
If someone wants to hire him, encourage them to use the "Hire Me" form on the contact page or email him directly.

Keep responses concise, friendly, and professional.

User Message: {{{message}}}`,
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
