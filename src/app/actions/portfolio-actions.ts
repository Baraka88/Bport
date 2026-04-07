"use server"

import { generateProjectDescription } from "@/ai/flows/generate-project-description-flow";
import { getChatResponse } from "@/ai/flows/chat-flow";

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
    return "I'm experiencing a high load right now. Please try again in a moment, or reach out to me via the contact form!";
  }
}

export async function submitHireMeRequest(formData: FormData) {
  const data = Object.fromEntries(formData.entries());
  console.log(`Processing Hire Me request:`, data);
  return { success: true };
}

export async function submitComment(projectId: string, content: string) {
  console.log(`Processing comment for ${projectId}: ${content}`);
  return { success: true };
}

export async function submitCollaborationRequest(formData: FormData) {
  const data = Object.fromEntries(formData.entries());
  console.log(`Processing Collaboration Inquiry:`, data);
  return { success: true };
}