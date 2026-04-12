import { NextRequest, NextResponse } from 'next/server';
import { getChatResponse } from '@/ai/flows/chat-flow';

export const runtime = 'edge';

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();
    const response = await getChatResponse(payload);
    return NextResponse.json(response);
  } catch (error) {
    console.error('Chat API error', error);
    return NextResponse.json(
      { text: 'Sorry, something went wrong while generating your response.' },
      { status: 500 }
    );
  }
}
