
// A set of common English function words to avoid turning into blanks.
// This helps in targeting content words (nouns, verbs, adjectives, adverbs).
export const STOP_WORDS = new Set([
  'a', 'an', 'the', 'and', 'but', 'or', 'for', 'nor', 'so', 'yet',
  'in', 'on', 'at', 'by', 'to', 'of', 'with', 'from', 'into', 'onto',
  'is', 'am', 'are', 'was', 'were', 'be', 'being', 'been',
  'have', 'has', 'had', 'do', 'does', 'did',
  'will', 'would', 'shall', 'should', 'can', 'could', 'may', 'might', 'must',
  'i', 'you', 'he', 'she', 'it', 'we', 'they',
  'me', 'him', 'her', 'us', 'them',
  'my', 'your', 'his', 'its', 'our', 'their',
  'that', 'which', 'who', 'whom', 'whose',
  'this', 'these', 'those',
  'not',
]);

export const TEST_DURATION_MINUTES = 5;
