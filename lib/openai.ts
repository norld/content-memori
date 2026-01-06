import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  timeout: 30000, // 30 seconds
});

/**
 * Generate a scene breakdown from a script using OpenAI
 */
export async function generateSceneBreakdown(
  script: string,
  language: 'english' | 'indonesian' | 'spanish'
): Promise<string> {
  const prompt = buildPrompt(script, language);

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 2000,
    });

    return completion.choices[0].message.content || '';
  } catch (error: any) {
    console.error('OpenAI generation error:', error);
    throw new Error(`Failed to generate scene breakdown: ${error.message}`);
  }
}

/**
 * Build the prompt for scene breakdown generation
 */
function buildPrompt(
  script: string,
  language: 'english' | 'indonesian' | 'spanish'
): string {
  const isIndonesian = language === 'indonesian';

  return `You are a professional video director. ${isIndonesian ? 'Buat' : 'Generate'} a scene breakdown for the following script.

${isIndonesian ? 'Buat dalam Bahasa Indonesia' : 'Generate in English'}

**Requirements**:
- ${isIndonesian ? 'Buat 5-8 scene saja' : 'Create only 5-8 scenes maximum'}
- ${isIndonesian ? 'Fokus pada: lokasi, jenis kamera, dan aksi utama' : 'Focus on: location, camera type, and main action'}
- ${isIndonesian ? 'Jelaskan dengan ringkas dan jelas' : 'Keep descriptions brief and clear'}

**IMPORTANT**: Return ONLY a JSON array. No markdown, no code blocks, just raw JSON like this:
[
  {"scene": 1, "location": "ruang tamu", "camera": "wide shot", "action": "tokoh utama masuk"},
  {"scene": 2, "location": "dapur", "camera": "close-up", "action": "mengambil kopi"}
]

**Script**:
${script}

**JSON Response**:
`;
}
