const { readFileSync } = require('fs');

const env = readFileSync('.env', 'utf-8');
const openaiKey = env.match(/OPENAI_API_KEY="(.*?)"/)[1];

async function test() {
  const content = '{"Navigation.services":"Hizmetlerimiz"}';
  const targetLocale = 'en';
  const systemPrompt = `Translate all the string values in this JSON object to ${targetLocale.toUpperCase()}. DO NOT change any of the JSON keys, only translate the values. Return ONLY valid JSON without any markdown formatting or explanation.`;

  console.log('Testing xAI with generic prompt...');
  const xaiKey = env.match(/XAI_API_KEY="(.*?)"/)[1];
  const res2 = await fetch('https://api.x.ai/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${xaiKey}` },
    body: JSON.stringify({
      model: 'grok-beta',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content }
      ],
      temperature: 0.3,
    })
  });

  if (!res2.ok) {
    console.error('xAI Error:', await res2.text());
  } else {
    const data2 = await res2.json();
    console.log('xAI Result:', data2.choices[0].message.content);
  }

  console.log('Testing Gemini with generic prompt...');
  const geminiKey = env.match(/GEMINI_API_KEY="(.*?)"/)[1];
  const res3 = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: systemPrompt }] },
      contents: [{ parts: [{ text: content }] }],
      generationConfig: { temperature: 0.3 }
    })
  });

  if (!res3.ok) {
    console.error('Gemini Error:', await res3.text());
  } else {
    const data3 = await res3.json();
    console.log('Gemini Result:', data3.candidates[0].content.parts[0].text);
  }
}

test();
