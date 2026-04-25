import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import fs from 'fs';

// Load the local .env to get the API keys
if (fs.existsSync('.env.local')) {
  dotenv.config({ path: '.env.local' });
} else {
  dotenv.config();
}

const prisma = new PrismaClient();
const locales = ['en', 'de', 'fr', 'ar']; // Target locales (excluding tr)

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const XAI_API_KEY = process.env.XAI_API_KEY;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

async function translateWithOpenAI(content: string, targetLocale: string): Promise<string> {
  if (!OPENAI_API_KEY) throw new Error('OPENAI_API_KEY missing');
  
  const systemPrompt = `Translate the following HTML/text content to ${targetLocale.toUpperCase()}. Preserve all HTML tags exactly as they are. Return ONLY the translated HTML without markdown backticks.`;

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
  return result.replace(/^```html\n?/, '').replace(/\n?```$/, '').replace(/^```\n?/, '');
}

async function translateWithXAI(content: string, targetLocale: string): Promise<string> {
  if (!XAI_API_KEY) throw new Error('XAI_API_KEY missing');
  
  const systemPrompt = `Translate the following HTML/text content to ${targetLocale.toUpperCase()}. Preserve all HTML tags exactly as they are. Return ONLY the translated HTML without markdown backticks.`;

  const res = await fetch('https://api.x.ai/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${XAI_API_KEY}` },
    body: JSON.stringify({
      model: 'grok-beta',
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
  return result.replace(/^```html\n?/, '').replace(/\n?```$/, '').replace(/^```\n?/, '');
}

async function translateWithGemini(content: string, targetLocale: string): Promise<string> {
  if (!GEMINI_API_KEY) throw new Error('GEMINI_API_KEY missing');
  
  const systemPrompt = `Translate the following HTML/text content to ${targetLocale.toUpperCase()}. Preserve all HTML tags exactly as they are. Return ONLY the translated HTML without markdown backticks.`;

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
  return result.replace(/^```html\n?/, '').replace(/\n?```$/, '').replace(/^```\n?/, '');
}

async function runTranslationFallback(content: string, locale: string) {
  try {
    return await translateWithOpenAI(content, locale);
  } catch (e1: any) {
    console.warn(`[OpenAI Failed] ${e1.message}. Falling back to xAI...`);
    try {
      return await translateWithXAI(content, locale);
    } catch (e2: any) {
      console.warn(`[xAI Failed] ${e2.message}. Falling back to Gemini...`);
      try {
        return await translateWithGemini(content, locale);
      } catch (e3: any) {
        console.error(`[Gemini Failed] ${e3.message}. All AI providers failed.`);
        throw new Error('All translation providers failed');
      }
    }
  }
}

async function main() {
  console.log('🚀 Starting Batch Translation process...');
  
  // 1. Batch Translate FAQs
  console.log('\n--- Processing FAQs ---');
  const trFaqs = await prisma.faq.findMany({ where: { locale: 'tr' } });
  for (const faq of trFaqs) {
    for (const loc of locales) {
      const exists = await prisma.faq.findFirst({ where: { question: faq.question, locale: loc } });
      if (!exists) {
        console.log(`Translating FAQ: "${faq.question.substring(0,30)}..." to ${loc}`);
        try {
          const translatedQ = await runTranslationFallback(faq.question, loc);
          const translatedA = await runTranslationFallback(faq.answer, loc);
          await prisma.faq.create({
            data: { locale: loc, question: translatedQ, answer: translatedA, sortOrder: faq.sortOrder }
          });
          console.log(`✅ Success for ${loc}`);
        } catch (e) {
          console.log(`❌ Failed for ${loc}`);
        }
      }
    }
  }

  // 2. Batch Translate Testimonials
  console.log('\n--- Processing Testimonials ---');
  const trTestimonials = await prisma.testimonial.findMany({ where: { locale: 'tr' } });
  for (const t of trTestimonials) {
    for (const loc of locales) {
      // Find if we already translated this testimonial. We assume same author & locale means translated.
      const exists = await prisma.testimonial.findFirst({ where: { author: t.author, locale: loc } });
      if (!exists) {
        console.log(`Translating Testimonial from ${t.author} to ${loc}`);
        try {
          const translatedText = await runTranslationFallback(t.text, loc);
          await prisma.testimonial.create({
            data: { ...t, id: undefined, locale: loc, text: translatedText, createdAt: undefined }
          });
          console.log(`✅ Success for ${loc}`);
        } catch (e) {
          console.log(`❌ Failed for ${loc}`);
        }
      }
    }
  }

  console.log('\n✨ Batch Translation Completed!');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
