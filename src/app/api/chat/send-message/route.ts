/**
 * Cosentus AI Chat - Send Message API Route
 * 
 * This endpoint sends a message to an active Retell AI chat session
 * and returns the agent's response synchronously.
 * 
 * Uses Retell AI's /create-chat-completion endpoint.
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

    // Send message to Retell API using create-chat-completion
    console.log(`[RETELL] Sending message to chat: ${chatId}`);
    
    const retellResponse = await fetch("https://api.retellai.com/create-chat-completion", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${RETELL_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: chatId,
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
    console.log(`[RETELL] Received response from agent`);

    // Extract agent response from messages array
    const agentMessage = data.messages && data.messages.length > 0 
      ? data.messages[0] 
      : null;

    if (!agentMessage || !agentMessage.content) {
      console.error(`[RETELL] No agent response in completion`);
      return NextResponse.json(
        { error: "No response from agent" },
        { status: 500 }
      );
    }

    // Return the agent's response
    return NextResponse.json({
      content: agentMessage.content,
      role: agentMessage.role,
      messageId: agentMessage.message_id,
    });
  } catch (error: any) {
    console.error("Unexpected error in send-message:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

