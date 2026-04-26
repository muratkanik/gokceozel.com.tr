import {getRequestConfig} from 'next-intl/server';
import {routing} from './routing';
import { PrismaClient } from '@prisma/client';

const overrideCache: Map<string, { messages: Record<string, unknown>; ts: number }> = new Map();
const CACHE_TTL = 120_000;

function unflattenAndMerge(target: Record<string, any>, source: Record<string, any>) {
  for (const [key, value] of Object.entries(source)) {
    const parts = key.split('.');
    let current = target;
    for (let i = 0; i < parts.length - 1; i++) {
      const part = parts[i];
      if (typeof current[part] !== 'object' || current[part] === null) {
        current[part] = {};
      }
      current = current[part];
    }
    current[parts[parts.length - 1]] = value;
  }
}

export default getRequestConfig(async ({requestLocale}) => {
  let locale = await requestLocale;

  if (!locale || !routing.locales.includes(locale as any)) {
    locale = routing.defaultLocale;
  }

  const cached = overrideCache.get(locale);
  if (cached && Date.now() - cached.ts < CACHE_TTL) {
    return { locale, messages: cached.messages };
  }

  let messages: Record<string, any> = {};
  
  // Also keep fileMessages as fallback
  let fileMessages = {};
  try {
    fileMessages = (await import(`../messages/${locale}.json`)).default as Record<string, unknown>;
    // Deep clone to avoid mutating module
    messages = JSON.parse(JSON.stringify(fileMessages));
  } catch (err) {
    // Fallback if no json file exists
  }

  try {
    const prisma = new PrismaClient();
    const globalUIBlock = await prisma.contentBlock.findFirst({
      where: { componentType: 'global_ui_strings' },
      include: { translations: { where: { locale } } }
    });
    await prisma.$disconnect();

    if (globalUIBlock && globalUIBlock.translations.length > 0) {
      const dbStrings = JSON.parse(globalUIBlock.translations[0].contentData);
      // dbStrings might be flat like {"Navigation.home": "Home"}, unflatten into messages
      unflattenAndMerge(messages, dbStrings);
    }
  } catch (e) {
    console.error('Error fetching global_ui_strings:', e);
  }

  overrideCache.set(locale, { messages, ts: Date.now() });

  return {
    locale,
    messages,
  };
});
