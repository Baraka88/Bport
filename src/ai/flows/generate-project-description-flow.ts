import { ai } from '@/ai/genkit';
import { z } from 'zod';

const GenerateProjectDescriptionInputSchema = z.object({
  technicalDetails: z.string().describe('Detailed technical aspects and implementation specifics of the project.'),
  projectGoals: z.string().describe('The main objectives and desired outcomes of the project.'),
});

export type GenerateProjectDescriptionInput = z.infer<typeof GenerateProjectDescriptionInputSchema>;

const GenerateProjectDescriptionOutputSchema = z.object({
  description: z.string().describe('A concise and impactful description or tagline for the project.'),
});

export type GenerateProjectDescriptionOutput = z.infer<typeof GenerateProjectDescriptionOutputSchema>;

export async function generateProjectDescription(
  input: GenerateProjectDescriptionInput
): Promise<GenerateProjectDescriptionOutput> {
  return generateProjectDescriptionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateProjectDescriptionPrompt',
  input: { schema: GenerateProjectDescriptionInputSchema },
  output: { schema: GenerateProjectDescriptionOutputSchema },
  prompt: `You are an expert copywriter specializing in creating compelling and concise project descriptions for a professional portfolio.

Generate a short, impactful, and clear description or tagline for a project based on the following details:

Technical Details: {{{technicalDetails}}}
Project Goals: {{{projectGoals}}}

Ensure the description is suitable for a portfolio showcase, highlighting the project's essence and value in a few sentences.`,
});

const generateProjectDescriptionFlow = ai.defineFlow(
  {
    name: 'generateProjectDescriptionFlow',
    inputSchema: GenerateProjectDescriptionInputSchema,
    outputSchema: GenerateProjectDescriptionOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);

    return output || {
      description: "A modern, scalable project built with strong engineering principles."
    };
  }
);
