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

const openrouter: ProviderFn = async (messages, opts) => {
  const key = process.env.OPENROUTER_API_KEY || process.env.NEXT_PUBLIC_OPENROUTER_API_KEY;
  if (!key) throw new Error('OPENROUTER_API_KEY missing');

  // Fallback order for models
  const models = [
    'google/gemini-2.5-flash',
    'deepseek/deepseek-chat',
    'meta-llama/llama-3.1-8b-instruct'
  ];

  for (const model of models) {
    try {
      const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json', 
          'Authorization': `Bearer ${key}` 
        },
        body: JSON.stringify({
          model: model,
          messages,
          temperature: opts.temperature ?? 0.7,
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

const PROVIDERS: [string, ProviderFn][] = [
  ['OpenRouter', openrouter],
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
