
"use server"

import { generateProjectDescription } from "@/ai/flows/generate-project-description-flow";

/**
 * Generates an AI-enhanced project description.
 */
export async function getAIDescription(technicalDetails: string, projectGoals: string) {
  try {
    const result = await generateProjectDescription({ technicalDetails, projectGoals });
    return result.description;
  } catch (error) {
    return "Could not generate description at this time.";
  }
}
