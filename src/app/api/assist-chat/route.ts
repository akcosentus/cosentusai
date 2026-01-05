// src/app/api/assist-chat/route.ts
import { NextResponse } from "next/server";

const ASSISTANT_ID = "asst_cCLw4UKxEsSD6zVm4cXglkV1";

export async function POST(req: Request) {
  try {
    // Check if API key exists
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "OPENAI_API_KEY not configured. Please add it to your environment variables." },
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

    const { messages, thread_id } = await req.json();

    // 1. Create a new thread if not provided
    let session_thread_id = thread_id;
    if (!session_thread_id) {
      const threadResp = await fetch("https://api.openai.com/v1/threads", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json",
          "OpenAI-Beta": "assistants=v2"
        },
      });
      
      if (!threadResp.ok) {
        const errorData = await threadResp.json();
        console.error("OpenAI thread creation error:", errorData);
        return NextResponse.json(
          { error: `Failed to create thread: ${errorData.error?.message || 'Unknown error'}` },
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
      
      const threadData = await threadResp.json();
      session_thread_id = threadData.id;
    }

    // 2. Add user message to the thread
    const addMessageResp = await fetch(`https://api.openai.com/v1/threads/${session_thread_id}/messages`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
        "OpenAI-Beta": "assistants=v2"
      },
      body: JSON.stringify({
        role: "user",
        content: messages[messages.length - 1].content,
      }),
    });

    if (!addMessageResp.ok) {
      const errorData = await addMessageResp.json();
      console.error("OpenAI add message error:", errorData);
      return NextResponse.json(
        { error: `Failed to add message: ${errorData.error?.message || 'Unknown error'}` },
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

    // 3. Run assistant to get completion based on thread (invoke run)
    const runResp = await fetch(`https://api.openai.com/v1/threads/${session_thread_id}/runs`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
        "OpenAI-Beta": "assistants=v2"
      },
      body: JSON.stringify({ assistant_id: ASSISTANT_ID }),
    });

    if (!runResp.ok) {
      const errorData = await runResp.json();
      console.error("OpenAI run creation error:", errorData);
      return NextResponse.json(
        { error: `Failed to run assistant: ${errorData.error?.message || 'Unknown error'}` },
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

    const runData = await runResp.json();

    // 4. Poll for completion
    let status = "queued", run_result, tryCount = 0;
    while (status !== "completed" && tryCount < 10) {
      await new Promise(res => setTimeout(res, 1200));
      const polling = await fetch(`https://api.openai.com/v1/threads/${session_thread_id}/runs/${runData.id}`, {
        headers: {
          "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json",
          "OpenAI-Beta": "assistants=v2"
        }
      });
      run_result = await polling.json();
      status = run_result.status;
      tryCount++;
    }

    if (status !== "completed") {
      console.error("Assistant run did not complete:", run_result);
      return NextResponse.json(
        { error: `Assistant run timed out or failed. Status: ${status}` },
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

    // 5. Get response message(s)
    const msgsResp = await fetch(`https://api.openai.com/v1/threads/${session_thread_id}/messages`, {
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
        "OpenAI-Beta": "assistants=v2"
      }
    });

    if (!msgsResp.ok) {
      const errorData = await msgsResp.json();
      console.error("OpenAI get messages error:", errorData);
      return NextResponse.json(
        { error: `Failed to get messages: ${errorData.error?.message || 'Unknown error'}` },
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

    const msgs = await msgsResp.json();
    const lastMessage = msgs.data.find((msg: any) => msg.role === "assistant");

    // Get the raw response text
    let responseText = lastMessage?.content[0]?.text?.value || "Sorry, I didn't find an answer.";
    
    // Remove citation annotations like 【6:1†source】
    responseText = responseText.replace(/【[^】]*】/g, '');
    
    // Clean up any extra spaces left behind
    responseText = responseText.replace(/\s+/g, ' ').trim();

    return NextResponse.json(
      {
        response: responseText,
        thread_id: session_thread_id
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
      { error: `Internal server error: ${error.message}` },
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

