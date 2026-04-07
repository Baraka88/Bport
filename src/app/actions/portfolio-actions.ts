"use server"

import { generateProjectDescription } from "@/ai/flows/generate-project-description-flow";

export async function getAIDescription(technicalDetails: string, projectGoals: string) {
  try {
    const result = await generateProjectDescription({ technicalDetails, projectGoals });
    return result.description;
  } catch (error) {
    console.error("AI Generation Error:", error);
    return "Could not generate description at this time.";
  }
}

export async function submitHireMeRequest(formData: FormData) {
  // Logic to save to MySQL (simulated)
  // Logic to send email to barakaruzibiza680@gmail.com
  console.log("Saving hire request to DB...");
  return { success: true };
}

export async function submitComment(projectId: string, content: string) {
  // Logic to save to MySQL (simulated)
  console.log(`Saving comment for ${projectId}: ${content}`);
  return { success: true };
}