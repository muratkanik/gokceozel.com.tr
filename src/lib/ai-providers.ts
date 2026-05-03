/**
 * Shared multi-LLM helper — OpenAI → xAI (Grok) → Gemini cascade.
 * Import and call `aiComplete(messages, opts)` from any API route.
 */

export interface AIMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface AIOptions {
  temperature?: number;
  json?: boolean; // If true, strip markdown code fences after generation
}

type ProviderFn = (messages: AIMessage[], opts: AIOptions) => Promise<string>;

function stripFences(text: string): string {
  if (text.startsWith('```json')) return text.replace(/^```json\n?/, '').replace(/\n?```$/, '').trim();
  if (text.startsWith('```html')) return text.replace(/^```html\n?/, '').replace(/\n?```$/, '').trim();
  if (text.startsWith('```')) return text.replace(/^```\w*\n?/, '').replace(/\n?```$/, '').trim();
  return text.trim();
}

const openai: ProviderFn = async (messages, opts) => {
  const key = process.env.OPENAI_API_KEY;
  if (!key) throw new Error('OPENAI_API_KEY missing');

  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages,
      temperature: opts.temperature ?? 0.7,
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || `OpenAI HTTP ${res.status}`);
  }

  return stripFences((await res.json()).choices[0].message.content);
};

const xai: ProviderFn = async (messages, opts) => {
  const key = process.env.XAI_API_KEY;
  if (!key) throw new Error('XAI_API_KEY missing');

  const res = await fetch('https://api.x.ai/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` },
    body: JSON.stringify({
      model: 'grok-3-mini',
      messages,
      temperature: opts.temperature ?? 0.7,
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || `xAI HTTP ${res.status}`);
  }

  return stripFences((await res.json()).choices[0].message.content);
};

const gemini: ProviderFn = async (messages, opts) => {
  const key = process.env.GEMINI_API_KEY;
  if (!key) throw new Error('GEMINI_API_KEY missing');

  // Gemini uses a different message format; combine system + user messages
  const systemMsg = messages.find((m) => m.role === 'system')?.content ?? '';
  const userMsgs = messages.filter((m) => m.role !== 'system');

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${key}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...(systemMsg ? { systemInstruction: { parts: [{ text: systemMsg }] } } : {}),
        contents: userMsgs.map((m) => ({
          role: m.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: m.content }],
        })),
        generationConfig: { temperature: opts.temperature ?? 0.7 },
      }),
    }
  );

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || `Gemini HTTP ${res.status}`);
  }

  return stripFences((await res.json()).candidates[0].content.parts[0].text);
};

const PROVIDERS: [string, ProviderFn][] = [
  ['OpenAI', openai],
  ['xAI (Grok)', xai],
  ['Gemini', gemini],
];

/**
 * Try each provider in order, return first successful result.
 * Throws if all fail.
 */
export async function aiComplete(
  messages: AIMessage[],
  opts: AIOptions = {}
): Promise<{ content: string; provider: string }> {
  const errors: string[] = [];

  for (const [name, fn] of PROVIDERS) {
    try {
      const content = await fn(messages, opts);
      return { content, provider: name };
    } catch (e: any) {
      errors.push(`${name}: ${e.message}`);
      console.warn(`[ai-providers] ${name} failed:`, e.message);
    }
  }

  throw new Error(`All AI providers failed:\n${errors.join('\n')}`);
}
