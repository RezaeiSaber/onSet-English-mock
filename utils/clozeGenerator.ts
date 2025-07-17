
import { ClozeTest, ClozeSegment, ClozeWord, ClozeBlank } from '../types';
import { STOP_WORDS, TEST_DURATION_MINUTES } from '../constants';

// A simple sentence splitter. It's not perfect but works for many cases.
const splitIntoSentences = (text: string): string[] => {
  return text.match(/[^.!?]+[.!?]+/g) || [text];
};

const createHint = (word: string): string => {
  const len = word.length;
  let prefixLength = 0;
  if (len >= 7) {
    prefixLength = 3;
  } else if (len >= 5) {
    prefixLength = 2;
  } else if (len >= 4) {
    prefixLength = 1;
  } else {
    return '___';
  }
  const prefix = word.substring(0, prefixLength);
  const underline = '_'.repeat(len - prefixLength);
  return `${prefix}${underline}`;
};

export const createClozeTest = (text: string, id: number): ClozeTest => {
  const sentencesRaw = splitIntoSentences(text.trim());
  if (sentencesRaw.length === 0) {
    return { id, originalText: text, sentences: [], timeRemaining: TEST_DURATION_MINUTES * 60 };
  }

  let wordToBlankCounter = 0;
  let blankIdCounter = 0;

  const processedSentences = sentencesRaw.map((sentenceStr, sentenceIndex) => {
    const isFirstOrLastSentence = sentenceIndex === 0 || sentenceIndex === sentencesRaw.length - 1;
    const words = sentenceStr.trim().split(/\s+/);
    
    const sentenceSegments: ClozeSegment[] = words.map((word) => {
      const cleanedWord = word.replace(/[.,!?;:"]+$/, '');
      const punctuation = word.substring(cleanedWord.length);

      if (isFirstOrLastSentence || STOP_WORDS.has(cleanedWord.toLowerCase()) || cleanedWord.length < 4) {
        return { type: 'word', content: word } as ClozeWord;
      }

      wordToBlankCounter++;
      if (wordToBlankCounter % 2 === 0) {
        blankIdCounter++;
        return {
          id: `${id}-${blankIdCounter}`,
          type: 'blank',
          original: cleanedWord,
          hint: createHint(cleanedWord),
          userAnswer: '',
          punctuation: punctuation,
        } as ClozeBlank;
      } else {
        return { type: 'word', content: word } as ClozeWord;
      }
    });

    return sentenceSegments;
  });

  return {
    id,
    originalText: text,
    sentences: processedSentences,
    timeRemaining: TEST_DURATION_MINUTES * 60,
  };
};

export const parseTextFile = (fileContent: string): string[] => {
    if (!fileContent) return [];
    // Split by ###, remove empty strings from result
    return fileContent.split(/\n?###\n?/).filter(text => text.trim().length > 0);
};
