'use client';

/**
 * Combined embed: Cosentus search bar (chat) on top, v2 voice agents grid below.
 *
 * Architecture:
 * - Nested iframes preserve both existing embed routes untouched.
 * - The top iframe uses `/embed/chat?compact=1`, which:
 *     (a) top-aligns the search bar (no viewport centering), and
 *     (b) posts its content height to this page via `postMessage` so we can
 *         resize the chat iframe to exactly fit its content. As the chat
 *         grows (search bar focused → suggested questions) or shrinks, the
 *         voice iframe below is pushed down or up via flex layout.
 * - The bottom iframe is `/embed/voice/all-v2`, unchanged.
 *
 * Mic permission: the customer's outer iframe must set `allow="microphone"`.
 * Both inner iframes also set `allow="microphone"` to delegate.
 */

import { useEffect, useState } from 'react';

const INITIAL_CHAT_HEIGHT_PX = 160;
const MIN_CHAT_HEIGHT_PX = 120;
const MAX_CHAT_HEIGHT_PX = 2000;
const VOICE_MIN_HEIGHT_PX = 760;

export default function CombinedEmbed() {
  const [chatHeight, setChatHeight] = useState(INITIAL_CHAT_HEIGHT_PX);

  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;
      const data = event.data;
      if (!data || typeof data !== 'object') return;
      if (data.type !== 'cosentus-chat-height') return;
      const raw = Number(data.height);
      if (!Number.isFinite(raw)) return;
      const clamped = Math.min(MAX_CHAT_HEIGHT_PX, Math.max(MIN_CHAT_HEIGHT_PX, raw));
      setChatHeight(clamped);
    };

    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, []);

  return (
    <div className="flex flex-col w-full min-h-screen min-h-[100svh] bg-transparent">
      <iframe
        src="/embed/chat?compact=1"
        title="Cosentus chat"
        allow="microphone"
        className="w-full border-0 block"
        style={{ height: `${chatHeight}px`, flex: '0 0 auto' }}
      />
      <iframe
        src="/embed/voice/all-v2"
        title="Cosentus voice agents"
        allow="microphone"
        className="w-full border-0 block"
        style={{ minHeight: `${VOICE_MIN_HEIGHT_PX}px`, flex: '1 1 auto' }}
      />
    </div>
  );
}
