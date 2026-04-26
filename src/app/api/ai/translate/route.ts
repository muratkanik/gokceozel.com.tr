import { NextResponse } from 'next/server';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const XAI_API_KEY = process.env.XAI_API_KEY;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

async function translateWithOpenAI(content: string, targetLocale: string, isJson: boolean): Promise<string> {
  if (!OPENAI_API_KEY) throw new Error('OPENAI_API_KEY missing');
  
  const systemPrompt = isJson 
    ? `Translate all the string values in this JSON object to ${targetLocale.toUpperCase()}. DO NOT change any of the JSON keys, only translate the values. Return ONLY valid JSON without any markdown formatting or explanation.`
    : `Translate the following HTML/text content to ${targetLocale.toUpperCase()}. Preserve all HTML tags and attributes exactly as they are. Return ONLY the translated HTML.`;

  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${OPENAI_API_KEY}` },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content }
      ],
      temperature: 0.3,
    })
  });

  if (!res.ok) throw new Error(await res.text());
  const data = await res.json();
  let result = data.choices[0].message.content.trim();
  if (result.startsWith('```json')) result = result.replace(/^```json\n?/, '').replace(/\n?```$/, '');
  if (result.startsWith('```html')) result = result.replace(/^```html\n?/, '').replace(/\n?```$/, '');
  if (result.startsWith('```')) result = result.replace(/^```\n?/, '').replace(/\n?```$/, '');
  return result;
}

async function translateWithXAI(content: string, targetLocale: string, isJson: boolean): Promise<string> {
  if (!XAI_API_KEY) throw new Error('XAI_API_KEY missing');
  
  const systemPrompt = isJson 
    ? `Translate all the string values in this JSON object to ${targetLocale.toUpperCase()}. DO NOT change any of the JSON keys, only translate the values. Return ONLY valid JSON without any markdown formatting or explanation.`
    : `Translate the following HTML/text content to ${targetLocale.toUpperCase()}. Preserve all HTML tags and attributes exactly as they are. Return ONLY the translated HTML.`;

  const res = await fetch('https://api.x.ai/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${XAI_API_KEY}` },
    body: JSON.stringify({
      model: 'grok-2-latest',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content }
      ],
      temperature: 0.3,
    })
  });

  if (!res.ok) throw new Error(await res.text());
  const data = await res.json();
  let result = data.choices[0].message.content.trim();
  if (result.startsWith('```json')) result = result.replace(/^```json\n?/, '').replace(/\n?```$/, '');
  if (result.startsWith('```html')) result = result.replace(/^```html\n?/, '').replace(/\n?```$/, '');
  if (result.startsWith('```')) result = result.replace(/^```\n?/, '').replace(/\n?```$/, '');
  return result;
}

async function translateWithGemini(content: string, targetLocale: string, isJson: boolean): Promise<string> {
  if (!GEMINI_API_KEY) throw new Error('GEMINI_API_KEY missing');
  
  const systemPrompt = isJson 
    ? `Translate all the string values in this JSON object to ${targetLocale.toUpperCase()}. DO NOT change any of the JSON keys, only translate the values. Return ONLY valid JSON without any markdown formatting or explanation.`
    : `Translate the following HTML/text content to ${targetLocale.toUpperCase()}. Preserve all HTML tags and attributes exactly as they are. Return ONLY the translated HTML.`;

  const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: systemPrompt }] },
      contents: [{ parts: [{ text: content }] }],
      generationConfig: { temperature: 0.3 }
    })
  });

  if (!res.ok) throw new Error(await res.text());
  const data = await res.json();
  let result = data.candidates[0].content.parts[0].text.trim();
  if (result.startsWith('```json')) result = result.replace(/^```json\n?/, '').replace(/\n?```$/, '');
  if (result.startsWith('```html')) result = result.replace(/^```html\n?/, '').replace(/\n?```$/, '');
  if (result.startsWith('```')) result = result.replace(/^```\n?/, '').replace(/\n?```$/, '');
  return result;
}

export async function POST(req: Request) {
  try {
    const { content, targetLocale, isJson } = await req.json();

    if (!content || !targetLocale) {
      return NextResponse.json({ error: 'Missing content or targetLocale' }, { status: 400 });
    }

    let translatedContent = '';
    let usedProvider = '';

    // Strategy: Try OpenAI -> xAI -> Gemini
    try {
      translatedContent = await translateWithOpenAI(content, targetLocale, isJson);
      usedProvider = 'OpenAI';
    } catch (e1: any) {
      console.warn('OpenAI translation failed:', e1.message);
      try {
        translatedContent = await translateWithXAI(content, targetLocale, isJson);
        usedProvider = 'xAI';
      } catch (e2: any) {
        console.warn('xAI translation failed:', e2.message);
        try {
          translatedContent = await translateWithGemini(content, targetLocale, isJson);
          usedProvider = 'Gemini';
        } catch (e3: any) {
          console.error('All translation providers failed.');
          throw new Error('All AI providers failed to translate the content.');
        }
      }
    }

    // Verify valid JSON if isJson=true
    if (isJson) {
      try {
        JSON.parse(translatedContent);
      } catch (e) {
        throw new Error(`Translated content by ${usedProvider} is not valid JSON.`);
      }
    }

    return NextResponse.json({ success: true, content: translatedContent, provider: usedProvider });
  } catch (error: any) {
    console.error('Translate Route Error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
