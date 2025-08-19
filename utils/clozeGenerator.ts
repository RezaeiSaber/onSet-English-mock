
import { ClozeTest, ClozeSegment, ClozeWord, ClozeBlank } from '../types';
import { TEST_DURATION_MINUTES } from '../constants';

const splitIntoSentences = (text: string): string[] => {
  const sentences = text.split(/(?<=[.!?])\s+/).filter(s => s.trim().length > 0);
  return sentences.length > 0 ? sentences : [text];
};

const createHint = (word: string): string => {
  const len = word.length;
  
  let prefixLength: number;
  
  if (len <= 3) {
    prefixLength = 1;
  } else if (len <= 5) {
    prefixLength = 2;
  } else if (len <= 7) {
    prefixLength = 3;
  } else {
    prefixLength = 4;
  }
  
  const prefix = word.substring(0, prefixLength);
  const underline = '_'.repeat(len - prefixLength);
  return `${prefix}${underline}`;
};

const isWordEligible = (word: string, wordIndex: number, isFirstSentence: boolean, isLastSentence: boolean): boolean => {
  const cleanedWord = word.replace(/[.,!?;:"'()-]+$/, '');
  const cleanLower = cleanedWord.toLowerCase();
  
  return !isFirstSentence && 
         !isLastSentence && 
         wordIndex > 0 && 
         cleanedWord.length >= 2 && 
         /^[a-zA-Z]+$/.test(cleanedWord) && 
         !(cleanLower === 'a' || cleanLower === 'i' || cleanLower === 'is' || cleanLower === 'be' || cleanLower === 'to');
};

export const createClozeTest = (text: string, id: number): ClozeTest => {
  const sentencesRaw = splitIntoSentences(text.trim());
  if (sentencesRaw.length === 0) {
    return { id, originalText: text, sentences: [], timeRemaining: TEST_DURATION_MINUTES * 60 };
  }

  let blankIdCounter = 0;
  const TARGET_BLANKS = 20;

  const processedSentences = sentencesRaw.map((sentenceStr, sentenceIndex) => {
    const isFirstSentence = sentenceIndex === 0;
    const isLastSentence = sentenceIndex === sentencesRaw.length - 1;
    const words = sentenceStr.trim().split(/\s+/);
    
    const sentenceSegments: ClozeSegment[] = words.map((word, wordIndex) => {
      const cleanedWord = word.replace(/[.,!?;:"'()-]+$/, '');
      const punctuation = word.substring(cleanedWord.length);

      let shouldBlank = false;
      
      if (isWordEligible(word, wordIndex, isFirstSentence, isLastSentence)) {
        let eligibleWordsBefore = 0;
        for (let i = 0; i < wordIndex; i++) {
          if (isWordEligible(words[i], i, isFirstSentence, isLastSentence)) {
            eligibleWordsBefore++;
          }
        }
        
        if (eligibleWordsBefore % 2 === 0) {
          shouldBlank = true;
        }
      }

      if (shouldBlank && blankIdCounter < TARGET_BLANKS) {
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
    return fileContent.split(/\n?###\n?/).filter(text => text.trim().length > 0);
};