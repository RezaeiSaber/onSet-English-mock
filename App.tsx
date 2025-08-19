import React, { useState, useEffect, useCallback } from 'react';
import SetupScreen from './components/SetupScreen';
import TestScreen from './components/TestScreen';
import SummaryScreen from './components/SummaryScreen';
import { AppState, ClozeTest, Settings, TestResult, ClozeBlank } from './types';
import { createClozeTest, parseTextFile } from './utils/clozeGenerator';
import { MoonIcon, SunIcon } from './components/icons';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.Setup);
  const [clozeTests, setClozeTests] = useState<ClozeTest[]>([]);
  const [currentTestIndex, setCurrentTestIndex] = useState(0);
  const [results, setResults] = useState<TestResult[]>([]);
  const [reviewTestId, setReviewTestId] = useState<number | null>(null);
  const [settings, setSettings] = useState<Settings>({
    numTexts: 3,
    shuffle: true,
    theme: 'light',
    fontSize: 'text-base',
  });
  const [defaultFileContent, setDefaultFileContent] = useState<string>('');

  const calculateSimilarity = (str1: string, str2: string): number => {
    const maxLength = Math.max(str1.length, str2.length);
    if (maxLength === 0) return 1;
    
    let matches = 0;
    const minLength = Math.min(str1.length, str2.length);
    
    for (let i = 0; i < minLength; i++) {
      if (str1[i] === str2[i]) {
        matches++;
      }
    }
    
    return matches / maxLength;
  };

  useEffect(() => {
    fetch('./example.txt')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.text();
      })
      .then(text => {
        setDefaultFileContent(text);
      })
      .catch(error => {
        console.error('Failed to fetch example.txt:', error);
      });
  }, []);

  useEffect(() => {
    const root = window.document.documentElement;
    if (settings.theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    root.style.fontSize = settings.fontSize === 'text-sm' ? '14px' : settings.fontSize === 'text-lg' ? '18px' : '16px';
  }, [settings.theme, settings.fontSize]);

  const handleSettingsChange = (newSettings: Partial<Settings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const toggleTheme = () => {
    handleSettingsChange({ theme: settings.theme === 'light' ? 'dark' : 'light' });
  };
  
  const handleStartTest = (fileContent: string, testSettings: Settings) => {
    const rawTexts = parseTextFile(fileContent);
    let selectedTexts = rawTexts;
    if (testSettings.shuffle) {
      selectedTexts.sort(() => Math.random() - 0.5);
    }
    selectedTexts = selectedTexts.slice(0, testSettings.numTexts);

    const tests = selectedTexts.map((text, index) => createClozeTest(text, index + 1));
    setClozeTests(tests);
    setResults([]);
    setCurrentTestIndex(0);
    setAppState(AppState.Testing);
  };

  const handleUpdateAnswer = useCallback((testId: number, blankId: string, answer: string) => {
    setClozeTests(prevTests => 
      prevTests.map(test => {
        if (test.id === testId) {
          const updatedSentences = test.sentences.map(sentence => 
            sentence.map(segment => {
              if (segment.type === 'blank' && segment.id === blankId) {
                return { ...segment, userAnswer: answer };
              }
              return segment;
            })
          );
          return { ...test, sentences: updatedSentences };
        }
        return test;
      })
    );
  }, []);

  const handleTimeUpdate = useCallback((testId: number, time: number) => {
    setClozeTests(prevTests => 
        prevTests.map(test => 
            test.id === testId ? { ...test, timeRemaining: time } : test
        )
    );
  }, []);

  const calculateFinalResults = () => {
    const finalResults: TestResult[] = [];
    const updatedTestsWithResults = clozeTests.map(test => {
        let correctCount = 0;
        let totalBlanks = 0;
        const incorrectAnswers: ClozeBlank[] = [];

        const checkedSentences = test.sentences.map(sentence => 
          sentence.map(segment => {
            if (segment.type === 'blank') {
              totalBlanks++;
              
              const userAnswer = segment.userAnswer.trim().toLowerCase();
              const originalWord = segment.original.toLowerCase();
              
              const hint = segment.hint || '';
              const visiblePart = hint.split('_')[0] || '';
              const hiddenPart = originalWord.substring(visiblePart.length);
              
              let isCorrect = userAnswer === hiddenPart;
              
              if (!isCorrect && userAnswer.length > 0) {
                const commonVariations = [
                  hiddenPart,
                  hiddenPart + 's',
                  hiddenPart + 'es',
                  hiddenPart.endsWith('s') ? hiddenPart.slice(0, -1) : hiddenPart,
                  hiddenPart.endsWith('es') ? hiddenPart.slice(0, -2) : hiddenPart,
                  hiddenPart + 'ing',
                  hiddenPart + 'ed',
                  hiddenPart + 'd',
                  hiddenPart.endsWith('e') ? hiddenPart.slice(0, -1) + 'ing' : hiddenPart,
                  hiddenPart.replace('ise', 'ize'),
                  hiddenPart.replace('ize', 'ise'),
                  hiddenPart.replace('our', 'or'),
                  hiddenPart.replace('or', 'our'),
                ];
                
                isCorrect = commonVariations.some(variant => 
                  variant === userAnswer && variant.length > 0
                );
                
                if (!isCorrect && userAnswer.length > 1 && hiddenPart.length > 1) {
                  const similarity = calculateSimilarity(userAnswer, hiddenPart);
                  if (similarity >= 0.85 && Math.abs(userAnswer.length - hiddenPart.length) <= 1) {
                    isCorrect = true;
                  }
                }
              }
              
              if (isCorrect) {
                correctCount++;
              } else {
                incorrectAnswers.push(segment);
              }
              return { ...segment, isCorrect };
            }
            return segment;
          })
        );
        
        finalResults.push({
          testId: test.id,
          totalBlanks,
          correctAnswers: correctCount,
          incorrectAnswers,
        });

        return {...test, sentences: checkedSentences};
    });
    
    setClozeTests(updatedTestsWithResults);
    setResults(finalResults);
  };

  const goToNextTestOrFinish = useCallback(() => {
    if (currentTestIndex < clozeTests.length - 1) {
        setCurrentTestIndex(prev => prev + 1);
    } else {
        calculateFinalResults();
        setAppState(AppState.Summary);
    }
  }, [currentTestIndex, clozeTests.length]);

  const handleReviewTest = (testId: number) => {
    setReviewTestId(testId);
    setAppState(AppState.Review);
  };

  const handleBackToSummary = () => {
    setReviewTestId(null);
    setAppState(AppState.Summary);
  };

  const handleRestart = () => {
    setAppState(AppState.Setup);
    setClozeTests([]);
    setCurrentTestIndex(0);
    setResults([]);
    setReviewTestId(null);
  };

  const renderContent = () => {
    switch (appState) {
      case AppState.Testing:
        const currentTest = clozeTests[currentTestIndex];
        return currentTest ? (
          <TestScreen 
            key={currentTest.id}
            test={currentTest}
            testIndex={currentTestIndex}
            totalTests={clozeTests.length}
            onUpdateAnswer={handleUpdateAnswer}
            onTimeUpdate={handleTimeUpdate}
            onNext={goToNextTestOrFinish}
            isReviewMode={false}
          />
        ) : <p>Loading test...</p>;
      case AppState.Summary:
        return <SummaryScreen results={results} onRestart={handleRestart} onReviewTest={handleReviewTest} />;
      case AppState.Review:
        const testToReview = clozeTests.find(t => t.id === reviewTestId);
        const testIndex = clozeTests.findIndex(t => t.id === reviewTestId);
        return testToReview ? (
            <TestScreen
                key={`review-${testToReview.id}`}
                test={testToReview}
                testIndex={testIndex}
                totalTests={clozeTests.length}
                onUpdateAnswer={() => {}} // No-op in review mode
                onTimeUpdate={() => {}}   // No-op in review mode
                onNext={() => {}}         // No-op in review mode
                isReviewMode={true}
                onBackToSummary={handleBackToSummary}
            />
        ) : (
          <div className="text-center">
            <p>Could not find test to review.</p>
            <button onClick={handleBackToSummary} className="mt-4 text-primary-600 dark:text-primary-400 hover:underline">Back to Summary</button>
          </div>
        );
      case AppState.Setup:
      default:
        return <SetupScreen onStartTest={handleStartTest} settings={settings} onSettingsChange={handleSettingsChange} defaultFileContent={defaultFileContent} />;
    }
  };

  return (
    <div className={`min-h-screen ${settings.fontSize} text-slate-800 dark:text-slate-200 transition-colors duration-300`}>
      <div className="absolute top-4 right-4 z-10">
        <button onClick={toggleTheme} className="p-2 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600">
          {settings.theme === 'light' ? <MoonIcon className="h-6 w-6"/> : <SunIcon className="h-6 w-6"/>}
        </button>
      </div>
      <main className="container mx-auto px-4 py-8 md:py-12 flex items-center justify-center min-h-screen">
        {renderContent()}
      </main>
    </div>
  );
};

export default App;