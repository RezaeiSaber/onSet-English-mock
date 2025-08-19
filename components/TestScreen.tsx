import React, { useState, useEffect } from 'react';
import { ClozeTest, ClozeSegment } from '../types';
import Timer from './Timer';
import { CheckCircleIcon, XCircleIcon, EyeIcon } from './icons';

interface TestScreenProps {
  test: ClozeTest;
  testIndex: number;
  totalTests: number;
  isReviewMode: boolean;
  onUpdateAnswer: (testId: number, blankId: string, answer: string) => void;
  onTimeUpdate: (testId: number, time: number) => void;
  onNext: () => void;
  onBackToSummary?: () => void;
}

const TestScreen: React.FC<TestScreenProps> = ({ test, testIndex, totalTests, isReviewMode, onUpdateAnswer, onTimeUpdate, onNext, onBackToSummary }) => {
  const [showAnswers, setShowAnswers] = useState(false);

  const handleAnswerChange = (blankId: string, value: string) => {
    if (!isReviewMode) {
      onUpdateAnswer(test.id, blankId, value);
    }
  };

  useEffect(() => {
    if (isReviewMode) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Enter') {
        event.preventDefault();
        onNext();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isReviewMode, onNext]);

  const renderSegment = (segment: ClozeSegment, segmentIndex: number) => {
    if (segment.type === 'word') {
      return <span key={segmentIndex} className="inline">{segment.content} </span>;
    }
    
    const blank = segment;
    const inputId = `blank-${blank.id}-${segmentIndex}`;
    
    const hint = blank.hint;
    const prefixMatch = hint.match(/^([a-zA-Z]+)(_+)$/);
    const prefix = prefixMatch ? prefixMatch[1] : '';
    const underscoreCount = prefixMatch ? prefixMatch[2].length : hint.length;
    
    let borderColor = 'border-slate-300 dark:border-slate-600 focus:border-primary-500 focus:ring-primary-500';
    let icon = null;

    if (isReviewMode) {
      if (blank.isCorrect) {
        borderColor = 'border-green-500';
        icon = <CheckCircleIcon className="absolute right-2 top-1/2 -translate-y-1/2 h-5 w-5 text-green-500" />;
      } else {
        borderColor = 'border-red-500';
        icon = <XCircleIcon className="absolute right-2 top-1/2 -translate-y-1/2 h-5 w-5 text-red-500" />;
      }
    }

    return (
      <span key={segmentIndex} className="inline-flex items-baseline mx-1 my-1 relative">
        {prefix && (
          <span className="text-slate-900 dark:text-slate-200 font-medium">{prefix}</span>
        )}
        <div className="relative inline-block">
          <input
            id={inputId}
            type="text"
            value={blank.userAnswer}
            placeholder={'_'.repeat(underscoreCount)}
            onChange={(e) => handleAnswerChange(blank.id, e.target.value)}
            disabled={isReviewMode}
            style={{ 
              width: `${Math.min(Math.max(3, blank.userAnswer.length * 0.85+0.7 ), 5)}em`,
              minWidth: '3em',
              maxWidth: '12em'
            }}
            className={`bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-200 rounded-md shadow-sm p-2 px-3 text-left transition-all duration-200 ${borderColor} border-2 disabled:bg-slate-200 dark:disabled:bg-slate-800 disabled:cursor-default`}
            autoCapitalize="none"
            autoComplete="off"
            autoCorrect="off"
          />
          {isReviewMode && icon}
        </div>
        {(blank as any).punctuation && (
          <span className="text-slate-900 dark:text-slate-200">{(blank as any).punctuation}</span>
        )}
        {isReviewMode && showAnswers && !blank.isCorrect && (
          <div className="absolute top-full left-0 text-center text-green-600 dark:text-green-400 text-sm font-semibold mt-1 bg-white dark:bg-slate-800 px-2 py-1 rounded shadow-lg z-10">
            {blank.original}
          </div>
        )}
      </span>
    );
  };
  
  return (
    <div className="w-full max-w-4xl mx-auto p-4 sm:p-6 md:p-8 bg-white dark:bg-slate-800 rounded-2xl shadow-lg flex flex-col">
      <div className="flex justify-between items-center mb-4 border-b border-slate-200 dark:border-slate-700 pb-4">
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">
          {isReviewMode ? 'Reviewing' : 'Test'}: Text {testIndex + 1} of {totalTests}
        </h2>
        {!isReviewMode && (
          <Timer initialTime={test.timeRemaining} onTimeUp={onNext} isPaused={false} onTick={(time) => onTimeUpdate(test.id, time)} />
        )}
      </div>
      
      <div className="prose prose-lg dark:prose-invert max-w-none leading-loose text-justify flex-grow">
        {test.sentences.map((sentence, sIndex) => (
          <p key={sIndex}>
            {sentence.map((segment, segIndex) => renderSegment(segment, segIndex))}
          </p>
        ))}
      </div>
      
      <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-center justify-center gap-4">
        {isReviewMode ? (
          <>
            <button
                onClick={() => setShowAnswers(!showAnswers)}
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold py-3 px-6 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-all"
            >
                <EyeIcon className="h-5 w-5" />
                {showAnswers ? 'Hide' : 'Show'} Correct Answers
            </button>
             <button
                onClick={onBackToSummary}
                className="w-full sm:w-auto bg-primary-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-primary-700 transition-all text-lg shadow-md"
              >
                Back to Summary
            </button>
          </>
        ) : (
          <button
            onClick={onNext}
            className="w-full sm:w-auto bg-primary-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-primary-700 transition-all text-lg shadow-md"
          >
            {testIndex < totalTests - 1 ? 'Next Text' : 'Finish Test'}
          </button>
        )}
      </div>
    </div>
  );
};

export default TestScreen;