"use server"

import { generateProjectDescription } from "@/ai/flows/generate-project-description-flow";
import { getChatResponse } from "@/ai/flows/chat-flow";

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

export async function askChatBot(message: string) {
  try {
    const result = await getChatResponse({ message });
    return result.response;
  } catch (error) {
    console.error("Chatbot AI Error:", error);
    return "I'm experiencing a high load right now. Please try again in a moment, or reach out to Baraka directly via email!";
  }
}

export async function submitHireMeRequest(formData: FormData) {
  const data = Object.fromEntries(formData.entries());
  console.log(`Sending Hire Me request to ${CONTACT_EMAIL}:`, data);
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
