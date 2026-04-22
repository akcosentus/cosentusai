'use client';

/**
 * Combined embed: Cosentus search bar (chat) on top, v2 voice agents grid below.
 *
 * Implementation note:
 * Uses nested iframes pointing at the existing `/embed/chat` and
 * `/embed/voice/all-v2` routes so both original embeds remain untouched.
 * The outer iframe on the customer site must still set
 * `allow="microphone"`; same-origin nested iframes delegate that permission
 * as long as we also set `allow="microphone"` on them here.
 *
 * Tunable knobs:
 * - CHAT_HEIGHT_PX: height of the top (chat) pane. ~520 fits the search
 *   bar + focused suggested questions and still leaves the expanded chat
 *   panel usable when a user actually sends a message.
 */

const CHAT_HEIGHT_PX = 520;
const VOICE_MIN_HEIGHT_PX = 760;

export default function CombinedEmbed() {
  return (
    <div className="flex flex-col w-full min-h-screen min-h-[100svh] bg-transparent">
      <iframe
        src="/embed/chat"
        title="Cosentus chat"
        allow="microphone"
        className="w-full border-0 block"
        style={{ height: `${CHAT_HEIGHT_PX}px`, flex: '0 0 auto' }}
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
