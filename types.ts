
export enum AppState {
  Setup,
  Testing,
  Summary,
  Review,
}

export interface ClozeWord {
  type: 'word';
  content: string;
}

export interface ClozeBlank {
  id: string;
  type: 'blank';
  original: string;
  hint: string;
  userAnswer: string;
  isCorrect?: boolean;
}

export type ClozeSegment = ClozeWord | ClozeBlank;

export interface ClozeTest {
  id: number;
  originalText: string;
  sentences: ClozeSegment[][];
  timeRemaining: number;
}

export interface TestResult {
  testId: number;
  totalBlanks: number;
  correctAnswers: number;
  incorrectAnswers: ClozeBlank[];
}

export interface Settings {
    numTexts: number;
    shuffle: boolean;
    theme: 'light' | 'dark';
    fontSize: 'text-sm' | 'text-base' | 'text-lg';
}