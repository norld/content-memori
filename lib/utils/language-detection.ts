/**
 * Detect the language of a script using heuristic keyword matching
 * Supports: English, Indonesian, Spanish
 * Defaults to English if uncertain
 */
export function detectLanguage(text: string): 'english' | 'indonesian' | 'spanish' {
  // Simple keyword matching for common words
  const indonesianKeywords = ['yang', 'dan', 'untuk', 'adalah', 'dengan', 'di', 'ke', 'dari'];
  const spanishKeywords = ['el', 'la', 'de', 'que', 'y', 'en', 'por', 'para'];

  const lowerText = text.toLowerCase();

  // Count keyword matches
  const indoCount = indonesianKeywords.filter(kw => lowerText.includes(kw)).length;
  const spanishCount = spanishKeywords.filter(kw => lowerText.includes(kw)).length;

  // Determine language based on keyword density
  if (indoCount >= 2) {
    return 'indonesian';
  }

  if (spanishCount >= 2) {
    return 'spanish';
  }

  // Default to English
  return 'english';
}
