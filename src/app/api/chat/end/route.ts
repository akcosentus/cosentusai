/**
 * Cosentus AI Chat - End Chat API Route
 * 
 * This endpoint ends an active Retell AI chat session.
 * 
 * Uses Retell AI's /end-chat/{chat_id} endpoint.
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

    // Parse request
    const { chatId } = await req.json();
    
    if (!chatId) {
      return NextResponse.json(
        { error: "Chat ID is required" },
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

    // End chat session via Retell API
    console.log(`[RETELL] Ending chat session: ${chatId}`);
    
    const retellResponse = await fetch(`https://api.retellai.com/end-chat/${chatId}`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${RETELL_API_KEY}`,
        "Content-Type": "application/json",
      },
    });

    if (!retellResponse.ok) {
      const errorText = await retellResponse.text();
      console.error(`[RETELL] API error: ${retellResponse.status}`);
      console.error(`[RETELL] Error body:`, errorText);
      return NextResponse.json(
        { error: "Failed to end chat" },
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
    console.log(`[RETELL] Chat session ended successfully`);

    return NextResponse.json({
      success: true,
      chatId: data.chat_id,
      chatStatus: data.chat_status,
    }, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  } catch (error: any) {
    console.error("Unexpected error in end-chat:", error);
    return NextResponse.json(
      { error: "Internal server error" },
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

