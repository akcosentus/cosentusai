// src/app/api/assist-chat/route.ts
import { NextResponse } from "next/server";

const ASSISTANT_ID = "asst_cCLw4UKxEsSD6zVm4cXglkV1";

export async function POST(req: Request) {
  const { messages, thread_id } = await req.json();

  // 1. Create a new thread if not provided
  let session_thread_id = thread_id;
  if (!session_thread_id) {
    const threadResp = await fetch("https://api.openai.com/v1/threads", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
    });
    const threadData = await threadResp.json();
    session_thread_id = threadData.id;
  }

  // 2. Add user message to the thread
  await fetch(`https://api.openai.com/v1/threads/${session_thread_id}/messages`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      role: "user",
      content: messages[messages.length - 1].content,
    }),
  });

  // 3. Run assistant to get completion based on thread (invoke run)
  const runResp = await fetch(`https://api.openai.com/v1/threads/${session_thread_id}/runs`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ assistant_id: ASSISTANT_ID }),
  });
  const runData = await runResp.json();

  // 4. Poll for completion
  let status = "queued", run_result, tryCount = 0;
  while (status !== "completed" && tryCount < 10) {
    await new Promise(res => setTimeout(res, 1200));
    const polling = await fetch(`https://api.openai.com/v1/threads/${session_thread_id}/runs/${runData.id}`, {
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      }
    });
    run_result = await polling.json();
    status = run_result.status;
    tryCount++;
  }

  // 5. Get response message(s)
  const msgsResp = await fetch(`https://api.openai.com/v1/threads/${session_thread_id}/messages`, {
    headers: {
      "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json"
    }
  });
  const msgs = await msgsResp.json();
  const lastMessage = msgs.data.find((msg: any) => msg.role === "assistant");

  return NextResponse.json({
    response: lastMessage?.content[0]?.text?.value || "Sorry, I didn't find an answer.",
    thread_id: session_thread_id
  });
}

