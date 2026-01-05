/**
 * Cosentus AI Chat API Route
 * 
 * This endpoint acts as a secure proxy to the n8n AI workflow.
 * It handles user questions and returns AI-generated responses.
 * 
 * Security: n8n webhook URL and auth are kept server-side.
 * Rate limiting: Inherits from parent API security measures.
 */

import { NextResponse } from "next/server";

const N8N_WEBHOOK_URL = "https://cosentus.app.n8n.cloud/webhook/chat";

// Rate limiting (similar to voice agent)
const RATE_LIMIT_WINDOW = 5 * 60 * 1000;   // 5 minutes
const MAX_REQUESTS_PER_IP = 10;            // 10 chat messages per 5 min
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
        { error: "Too many questions from your device. Please wait a few minutes and try again." },
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

    // Parse request
    const { messages, thread_id } = await req.json();
    
    if (!messages || messages.length === 0) {
      return NextResponse.json(
        { error: "No message provided" },
        { 
          status: 400,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
          },
        }
      );
    }

    // Get the latest user message
    const userMessage = messages[messages.length - 1].content;

    // Log the request (for monitoring)
    const userAgent = req.headers.get("user-agent") || "unknown";
    console.log(`[COSENTUS CHAT] Question from IP=${ip}, UA=${userAgent}, Time=${new Date().toISOString()}`);

    // Forward to n8n webhook
    const n8nResponse = await fetch(N8N_WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Add a secret header for n8n to verify requests come from your API
        "X-Cosentus-Secret": process.env.N8N_WEBHOOK_SECRET || "cosentus-internal-2024",
      },
      body: JSON.stringify({
        question: userMessage,
        thread_id: thread_id || null,
        metadata: {
          ip: ip,
          timestamp: new Date().toISOString(),
        }
      }),
    });

    if (!n8nResponse.ok) {
      console.error(`n8n webhook error: ${n8nResponse.status} ${n8nResponse.statusText}`);
      return NextResponse.json(
        { error: "Failed to get response from AI. Please try again later." },
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

    const n8nData = await n8nResponse.json();

    // Return the AI response
    return NextResponse.json(
      {
        response: n8nData.answer || n8nData.response || "Sorry, I couldn't generate a response.",
        thread_id: n8nData.thread_id || thread_id || null,
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

