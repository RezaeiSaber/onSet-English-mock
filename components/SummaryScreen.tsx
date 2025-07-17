
import React from 'react';
import { TestResult, ClozeBlank } from '../types';
import { exportToCsv, exportToJson } from '../utils/fileUtils';
import { RefreshCwIcon } from './icons';

interface SummaryScreenProps {
  results: TestResult[];
  onRestart: () => void;
  onReviewTest: (testId: number) => void;
}

const SummaryCard: React.FC<{ title: string, value: string | number, subtext?: string, colorClass?: string }> = ({ title, value, subtext, colorClass = 'text-primary-600 dark:text-primary-400' }) => (
  <div className="bg-slate-100 dark:bg-slate-700 p-4 rounded-lg text-center shadow">
    <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">{title}</p>
    <p className={`text-4xl font-bold ${colorClass}`}>{value}</p>
    {subtext && <p className="text-xs text-slate-400 dark:text-slate-500">{subtext}</p>}
  </div>
);

const IncorrectAnswerItem: React.FC<{ blank: ClozeBlank }> = ({ blank }) => (
    <div className="flex justify-between items-center p-2 bg-slate-50 dark:bg-slate-700/50 rounded">
        <p className="text-slate-700 dark:text-slate-300"><span className="font-semibold">You wrote:</span> "{blank.userAnswer || ' '}"</p>
        <p className="text-green-600 dark:text-green-400"><span className="font-semibold">Correct:</span> "{blank.original}"</p>
    </div>
);


const SummaryScreen: React.FC<SummaryScreenProps> = ({ results, onRestart, onReviewTest }) => {
  if (results.length === 0) {
    return (
      <div className="w-full max-w-2xl mx-auto p-8 bg-white dark:bg-slate-800 rounded-2xl shadow-lg text-center">
        <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-4">No results yet.</h1>
        <p className="text-slate-600 dark:text-slate-400 mb-6">Complete a test to see your summary.</p>
        <button onClick={onRestart} className="bg-primary-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-primary-700 transition-all">
          Start Over
        </button>
      </div>
    );
  }

  const totalBlanks = results.reduce((sum, r) => sum + r.totalBlanks, 0);
  const totalCorrect = results.reduce((sum, r) => sum + r.correctAnswers, 0);
  const overallAccuracy = totalBlanks > 0 ? (totalCorrect / totalBlanks) * 100 : 0;

  return (
    <div className="w-full max-w-4xl mx-auto p-6 md:p-8 bg-white dark:bg-slate-800 rounded-2xl shadow-lg">
      <div className="text-center border-b border-slate-200 dark:border-slate-700 pb-6 mb-6">
        <h1 className="text-4xl font-bold text-slate-800 dark:text-slate-100">Test Complete!</h1>
        <p className="text-lg text-slate-600 dark:text-slate-400 mt-2">Here's your performance summary.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <SummaryCard title="Total Blanks" value={totalBlanks} />
        <SummaryCard title="Correct Answers" value={totalCorrect} colorClass="text-green-600 dark:text-green-400" />
        <SummaryCard title="Overall Accuracy" value={`${overallAccuracy.toFixed(1)}%`} subtext={`${totalCorrect}/${totalBlanks}`} colorClass={overallAccuracy > 70 ? 'text-green-500' : overallAccuracy > 40 ? 'text-yellow-500' : 'text-red-500'} />
      </div>

      <div className="space-y-6">
          <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-200 mb-3">Breakdown & Review</h2>
          {results.map(result => {
              const accuracy = result.totalBlanks > 0 ? (result.correctAnswers / result.totalBlanks) * 100 : 0;
              return (
                  <div key={result.testId} className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
                      <div className="flex justify-between items-center mb-3">
                          <h3 className="font-bold text-lg text-slate-700 dark:text-slate-200">Text {result.testId}</h3>
                          <span className={`font-bold px-3 py-1 rounded-full text-sm ${accuracy > 70 ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300' : accuracy > 40 ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300' : 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300'}`}>{accuracy.toFixed(1)}% Correct</span>
                      </div>
                      {result.incorrectAnswers.length > 0 ? (
                        <div className="space-y-2">
                            {result.incorrectAnswers.map((blank, index) => <IncorrectAnswerItem key={index} blank={blank} />)}
                        </div>
                      ) : (
                        <p className="text-center text-green-600 dark:text-green-400 p-2">Perfect score on this text!</p>
                      )}
                       <div className="mt-3 text-right">
                          <button 
                              onClick={() => onReviewTest(result.testId)}
                              className="text-sm font-semibold text-primary-600 dark:text-primary-400 hover:underline"
                          >
                              Review This Text
                          </button>
                      </div>
                  </div>
              )
          })}
      </div>

      <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-center justify-center gap-4">
        <button
          onClick={onRestart}
          className="w-full sm:w-auto flex items-center justify-center gap-2 bg-primary-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-primary-700 transition-all shadow-md"
        >
          <RefreshCwIcon className="h-5 w-5" />
          Take Another Test
        </button>
        <div className="w-full sm:w-auto flex flex-col sm:flex-row gap-4">
          <button onClick={() => exportToJson(results)} className="w-full sm:w-auto bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold py-3 px-6 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-all">Export JSON</button>
          <button onClick={() => exportToCsv(results)} className="w-full sm:w-auto bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold py-3 px-6 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-all">Export CSV</button>
        </div>
      </div>
    </div>
  );
};

export default SummaryScreen;