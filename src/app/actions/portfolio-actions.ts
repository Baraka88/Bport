"use server"

import { generateProjectDescription } from "@/ai/flows/generate-project-description-flow";

const CONTACT_EMAIL = "barakaruzibiza680@gmail.com";

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
  const data = Object.fromEntries(formData.entries());
  console.log(`Sending Hire Me request to ${CONTACT_EMAIL}:`, data);
  // Simulated success
  return { success: true };
}

export async function submitComment(projectId: string, content: string) {
  console.log(`Sending comment for ${projectId} to ${CONTACT_EMAIL}: ${content}`);
  return { success: true };
}

export async function submitCollaborationRequest(formData: FormData) {
  const data = Object.fromEntries(formData.entries());
  console.log(`Sending Collaboration Inquiry to ${CONTACT_EMAIL}:`, data);
  return { success: true };
}
