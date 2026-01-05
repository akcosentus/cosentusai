/**
 * Cosentus AI Chat - Send Message API Route
 * 
 * This endpoint sends a message to an active Retell AI chat session.
 * 
 * Security: RETELL_API_KEY is kept server-side.
 */

import { NextResponse } from "next/server";

const RETELL_API_KEY = process.env.RETELL_API_KEY;

export async function POST(req: Request) {
  try {
    // Validate API key
    if (!RETELL_API_KEY) {
      console.error("[CHAT] RETELL_API_KEY not configured");
      return NextResponse.json(
        { error: "Chat service not configured" },
        { status: 500 }
      );
    }

    // Parse request
    const { chatId, message } = await req.json();
    
    if (!chatId || !message) {
      return NextResponse.json(
        { error: "Chat ID and message are required" },
        { status: 400 }
      );
    }

    // Send message to Retell API
    console.log(`[RETELL] Sending message to chat: ${chatId}`);
    
    const retellResponse = await fetch(`https://api.retellai.com/send-chat-message/${chatId}`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${RETELL_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        content: message,
      }),
    });

    if (!retellResponse.ok) {
      const errorText = await retellResponse.text();
      console.error(`[RETELL] API error: ${retellResponse.status}`);
      console.error(`[RETELL] Error body:`, errorText);
      return NextResponse.json(
        { error: "Failed to send message" },
        { status: 500 }
      );
    }

    const data = await retellResponse.json();
    console.log(`[RETELL] Message sent successfully`);

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Unexpected error in send-message:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

