/**
 * Cosentus AI Chat API Route
 * 
 * This endpoint handles text-based chat with Retell AI's chat agent.
 * It creates a web call session and returns the access token for the frontend
 * to connect via Retell's Web SDK.
 * 
 * Security: RETELL_API_KEY is kept server-side.
 * Rate limiting: 10 chat sessions per 5 minutes per IP.
 */

import { NextResponse } from "next/server";
import { AGENTS } from "@/config/agents";

const RETELL_API_KEY = process.env.RETELL_API_KEY;

// Rate limiting
const RATE_LIMIT_WINDOW = 5 * 60 * 1000;   // 5 minutes
const MAX_REQUESTS_PER_IP = 10;            // 10 chat sessions per 5 min
const rateLimitStore: { [ip: string]: number[] } = {};

export async function POST(req: Request) {
  try {
    // Get IP for rate limiting
    const ipRaw = req.headers.get('x-forwarded-for');
    const ip = ipRaw?.split(',')[0].trim() || "127.0.0.1";
    const now = Date.now();

    // Cleanup old timestamps
    const timestamps = (rateLimitStore[ip] || []).filter(ts => now - ts < RATE_LIMIT_WINDOW);

    // Check rate limit
    if (timestamps.length >= MAX_REQUESTS_PER_IP) {
      console.warn(`[RATE LIMIT BLOCK - CHAT] ${ip} hit limit (${MAX_REQUESTS_PER_IP} in ${RATE_LIMIT_WINDOW / 60000}min)`);
      return NextResponse.json(
        { error: "Too many chat requests from your device. Please wait a few minutes and try again." },
        { 
          status: 429,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
          },
        }
      );
    }
    timestamps.push(now);
    rateLimitStore[ip] = timestamps;

    // Validate API key
    if (!RETELL_API_KEY) {
      console.error("[CHAT] RETELL_API_KEY not configured");
      return NextResponse.json(
        { error: "Chat service not configured" },
        { 
          status: 500,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
          },
        }
      );
    }

    // Get the chat agent ID
    const chatAgentId = AGENTS.chat;

    // Log the request (for monitoring)
    const userAgent = req.headers.get("user-agent") || "unknown";
    console.log(`[COSENTUS CHAT] Request from IP=${ip}, UA=${userAgent}, Time=${new Date().toISOString()}`);

    // Call Retell API to create a chat session
    console.log(`[RETELL] Creating chat session with agent: ${chatAgentId}`);
    
    const retellResponse = await fetch("https://api.retellai.com/create-chat", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${RETELL_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        agent_id: chatAgentId,
      }),
    });

    console.log(`[RETELL] Response status: ${retellResponse.status}`);
    
    if (!retellResponse.ok) {
      const errorText = await retellResponse.text();
      console.error(`[RETELL] API error: ${retellResponse.status} ${retellResponse.statusText}`);
      console.error(`[RETELL] Error body:`, errorText);
      return NextResponse.json(
        { error: "Failed to initialize chat. Please try again later." },
        { 
          status: 500,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
          },
        }
      );
    }

    const data = await retellResponse.json();
    console.log(`[RETELL] Chat session created successfully`);

    // Return the chat ID and session info for frontend to use
    return NextResponse.json(
      {
        chatId: data.chat_id,
        agentId: data.agent_id,
        chatStatus: data.chat_status,
      },
      {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      }
    );
  } catch (error: any) {
    console.error("Unexpected error in assist-chat:", error);
    return NextResponse.json(
      { error: "Internal server error. Please try again." },
      { 
        status: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      }
    );
  }
}

// Handle preflight OPTIONS request
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
