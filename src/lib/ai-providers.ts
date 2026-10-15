/**
 * Shared multi-LLM helper.
 *
 * Provider is chosen with env vars — no code change needed to switch:
 *   AI_PROVIDER        'openrouter' (default) | 'anthropic'
 *   ANTHROPIC_API_KEY  required when AI_PROVIDER=anthropic
 *   ANTHROPIC_MODEL    default 'claude-opus-5-5'
 *   OPENROUTER_API_KEY required when AI_PROVIDER=openrouter
 *   OPENROUTER_MODELS  comma-separated fallback chain (optional)
 *
 * The selected provider runs first; the other one is tried as a fallback
 * if its key is configured.
 *
 * Use `aiComplete(messages, opts)` for one-shot calls and
 * `aiStream(messages, opts)` for chat (OpenAI-style SSE output, so the
 * ChatWidget client works with either provider).
 */

import Anthropic from '@anthropic-ai/sdk';

export interface AIMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface AIOptions {
  temperature?: number; // OpenRouter only — Claude Opus 5.5 rejects sampling params
  json?: boolean; // If true, strip markdown code fences after generation
  maxTokens?: number;
  effort?: 'low' | 'medium' | 'high' | 'xhigh' | 'max'; // Anthropic only
}

type ProviderName = 'anthropic' | 'openrouter';
type ProviderFn = (messages: AIMessage[], opts: AIOptions) => Promise<string>;
type StreamFn = (messages: AIMessage[], opts: AIOptions) => Promise<ReadableStream<Uint8Array>>;

function stripFences(text: string): string {
  if (text.startsWith('```json')) return text.replace(/^```json\n?/, '').replace(/\n?```$/, '').trim();
  if (text.startsWith('```html')) return text.replace(/^```html\n?/, '').replace(/\n?```$/, '').trim();
  if (text.startsWith('```')) return text.replace(/^```\w*\n?/, '').replace(/\n?```$/, '').trim();
  return text.trim();
}

// ─── OpenRouter ──────────────────────────────────────────────────────────────

const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';

function openrouterKey() {
  const key = process.env.OPENROUTER_API_KEY || process.env.NEXT_PUBLIC_OPENROUTER_API_KEY;
  if (!key) throw new Error('OPENROUTER_API_KEY missing');
  return key;
}

function openrouterModels(): string[] {
  const fromEnv = process.env.OPENROUTER_MODELS?.split(',').map(m => m.trim()).filter(Boolean);
  if (fromEnv?.length) return fromEnv;
  return [
    'google/gemini-2.5-flash',
    'deepseek/deepseek-chat',
    'meta-llama/llama-3.1-8b-instruct'
  ];
}

const openrouter: ProviderFn = async (messages, opts) => {
  const key = openrouterKey();

  for (const model of openrouterModels()) {
    try {
      const res = await fetch(OPENROUTER_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${key}`
        },
        body: JSON.stringify({
          model: model,
          messages,
          temperature: opts.temperature ?? 0.7,
          max_tokens: opts.maxTokens ?? (opts.json ? 4000 : 3000),
          ...(opts.json ? { response_format: { type: 'json_object' } } : {}),
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error?.message || `OpenRouter HTTP ${res.status} for ${model}`);
      }

      return stripFences((await res.json()).choices[0].message.content);
    } catch (error: any) {
      console.warn(`[ai-providers] OpenRouter model ${model} failed:`, error.message);
      // Loop continues to fallback model
    }
  }

  throw new Error("All fallback models failed on OpenRouter.");
};

const openrouterStream: StreamFn = async (messages, opts) => {
  const res = await fetch(OPENROUTER_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${openrouterKey()}`,
      'HTTP-Referer': 'https://gokceozel.com.tr',
      'X-Title': 'Gökçe Özel Klinik Chat',
    },
    body: JSON.stringify({
      model: openrouterModels()[0],
      messages,
      stream: true,
      temperature: opts.temperature ?? 0.5,
      max_tokens: opts.maxTokens ?? 600,
    }),
  });
  if (!res.ok || !res.body) throw new Error(`OpenRouter HTTP ${res.status}`);
  return res.body;
};

// ─── Anthropic (Claude) ──────────────────────────────────────────────────────

let anthropicClient: Anthropic | null = null;
function anthropic() {
  if (!process.env.ANTHROPIC_API_KEY) throw new Error('ANTHROPIC_API_KEY missing');
  const workspaceId = process.env.ANTHROPIC_WORKSPACE_ID || process.env.ANTHROPHIC_WORKSPACE_ID;
  anthropicClient ??= new Anthropic({
    defaultHeaders: workspaceId ? { 'anthropic-workspace-id': workspaceId } : undefined,
  });
  return anthropicClient;
}

const anthropicModel = () => process.env.ANTHROPIC_MODEL || 'claude-opus-5-5';

/**
 * Claude takes the system prompt as a separate field and the conversation
 * must start with a user turn. Leading assistant messages (e.g. the chat
 * widget's greeting) are folded into the system prompt instead.
 */
function toAnthropic(messages: AIMessage[]) {
  const system: string[] = [];
  const turns: Anthropic.Beta.BetaMessageParam[] = [];

  for (const m of messages) {
    if (!m.content.trim()) continue;
    if (m.role === 'system') {
      system.push(m.content);
    } else if (m.role === 'assistant' && turns.length === 0) {
      system.push(`Konuşmayı şu mesajla açtın:\n${m.content}`);
    } else {
      turns.push({ role: m.role, content: m.content });
    }
  }

  return { system: system.join('\n\n') || undefined, messages: turns };
}

function anthropicParams(
  messages: AIMessage[],
  opts: AIOptions
): Anthropic.Beta.MessageCreateParamsNonStreaming {
  // JSON-mode calls skip extended thinking entirely — thinking tokens inflate
  // the estimated duration above the SDK's non-streaming 10-minute guard,
  // and deterministic structured output doesn't benefit from reasoning.
  const useThinking = !opts.json && !opts.effort?.startsWith?.('none');
  return {
    model: anthropicModel(),
    // Without extended thinking the 10-min guard is not triggered up to ~16k.
    max_tokens: Math.max(opts.maxTokens ?? (opts.json ? 16000 : 8000), 4000),
    ...toAnthropic(messages),
    ...(useThinking ? { output_config: { effort: opts.effort ?? 'medium' } } : {}),
    // On a safety refusal, the API reruns the request on a fallback model.
    betas: ['server-side-fallback-2026-07-01'],
    fallbacks: 'default',
  };
}

const anthropicComplete: ProviderFn = async (messages, opts) => {
  const response = await anthropic().beta.messages.create(anthropicParams(messages, opts));

  if (response.stop_reason === 'refusal') {
    throw new Error(`Claude refused (${response.stop_details?.category ?? 'unknown'})`);
  }

  const text = response.content
    .filter((b): b is Anthropic.Beta.BetaTextBlock => b.type === 'text')
    .map(b => b.text)
    .join('');
  return stripFences(text);
};

/** Re-emits Claude's text deltas as OpenAI-style SSE chunks. */
const anthropicStream: StreamFn = async (messages, opts) => {
  // Awaiting create() surfaces HTTP errors here, so the caller can fall back.
  const events = await anthropic().beta.messages.create({
    ...anthropicParams(messages, { effort: 'low', ...opts }),
    stream: true,
  });

  const encoder = new TextEncoder();
  const sse = (data: string) => encoder.encode(`data: ${data}\n\n`);

  return new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        for await (const event of events) {
          if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
            controller.enqueue(sse(JSON.stringify({ choices: [{ delta: { content: event.delta.text } }] })));
          }
        }
      } catch (e: any) {
        console.error('[ai-providers] Claude stream failed:', e.message);
      } finally {
        controller.enqueue(sse('[DONE]'));
        controller.close();
      }
    },
    cancel() {
      events.controller.abort();
    },
  });
};

// ─── Provider selection ──────────────────────────────────────────────────────

const PROVIDERS: Record<ProviderName, { complete: ProviderFn; stream: StreamFn }> = {
  anthropic: { complete: anthropicComplete, stream: anthropicStream },
  openrouter: { complete: openrouter, stream: openrouterStream },
};

function providerOrder(): ProviderName[] {
  const primary: ProviderName = process.env.AI_PROVIDER === 'anthropic' ? 'anthropic' : 'openrouter';
  return primary === 'anthropic' ? ['anthropic', 'openrouter'] : ['openrouter', 'anthropic'];
}

/**
 * Try each provider in order, return first successful result.
 * Throws if all fail.
 */
export async function aiComplete(
  messages: AIMessage[],
  opts: AIOptions = {}
): Promise<{ content: string; provider: string }> {
  const errors: string[] = [];

  for (const name of providerOrder()) {
    try {
      const content = await PROVIDERS[name].complete(messages, opts);
      return { content, provider: name };
    } catch (e: any) {
      errors.push(`${name}: ${e.message}`);
      console.warn(`[ai-providers] ${name} failed:`, e.message);
    }
  }

  throw new Error(`All AI providers failed:\n${errors.join('\n')}`);
}

/**
 * Streaming chat completion as OpenAI-style SSE (`data: {choices:[{delta}]}`
 * lines, ending with `data: [DONE]`). Falls back if a provider fails to start.
 */
export async function aiStream(
  messages: AIMessage[],
  opts: AIOptions = {}
): Promise<ReadableStream<Uint8Array>> {
  const errors: string[] = [];

  for (const name of providerOrder()) {
    try {
      return await PROVIDERS[name].stream(messages, opts);
    } catch (e: any) {
      errors.push(`${name}: ${e.message}`);
      console.warn(`[ai-providers] ${name} stream failed:`, e.message);
    }
  }

  throw new Error(`All AI providers failed:\n${errors.join('\n')}`);
}
