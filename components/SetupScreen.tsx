import React, { useRef, useState, useEffect } from 'react';
import { Settings } from '../types';
import { UploadIcon } from './icons';

interface SetupScreenProps {
  onStartTest: (fileContent: string, settings: Settings) => void;
  settings: Settings;
  onSettingsChange: (newSettings: Partial<Settings>) => void;
  defaultFileContent: string;
}

const SetupScreen: React.FC<SetupScreenProps> = ({ onStartTest, settings, onSettingsChange, defaultFileContent }) => {
  const [fileContent, setFileContent] = useState<string>('');
  const [fileName, setFileName] = useState<string>('');
  const [error, setError] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Pre-load the default file content if it's available and no file has been chosen yet.
    if (defaultFileContent && !fileContent) {
      setFileContent(defaultFileContent);
      setFileName('example.txt');
    }
  }, [defaultFileContent, fileContent]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type === "text/plain") {
        const reader = new FileReader();
        reader.onload = (e) => {
          const content = e.target?.result as string;
          setFileContent(content);
          setFileName(file.name);
          setError('');
        };
        reader.readAsText(file);
      } else {
        setError('Please upload a valid .txt file.');
        setFileName('');
        setFileContent('');
      }
    }
  };

  const handleStartClick = () => {
    if (!fileContent) {
      setError('Please upload a text file to begin.');
      return;
    }
    onStartTest(fileContent, settings);
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6 md:p-8 bg-white dark:bg-slate-800 rounded-2xl shadow-lg flex flex-col items-center">
      <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">Cloze Test Simulator</h1>
      <p className="text-slate-600 dark:text-slate-400 mb-6 text-center">An `example.txt` file is pre-loaded. You can start directly or upload your own file.</p>
      
      <div className="w-full space-y-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Source Text File</label>
          <div 
            className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-300 dark:border-slate-600 border-dashed rounded-md cursor-pointer hover:border-primary-500 dark:hover:border-primary-400 transition-colors"
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="space-y-1 text-center">
              <UploadIcon className="mx-auto h-12 w-12 text-slate-400" />
              <div className="flex text-sm text-slate-600 dark:text-slate-400">
                <span className="relative rounded-md font-medium text-primary-600 dark:text-primary-400 hover:text-primary-500">
                  <span>{fileName ? 'Change file' : 'Upload a file'}</span>
                  <input ref={fileInputRef} id="file-upload" name="file-upload" type="file" accept=".txt" className="sr-only" onChange={handleFileChange} />
                </span>
                <p className="pl-1">or drag and drop</p>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-500">{fileName || 'TXT files only'}</p>
            </div>
          </div>
          {error && <p className="mt-2 text-sm text-red-600 dark:text-red-500">{error}</p>}
        </div>

        <div>
          <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-3 border-b border-slate-200 dark:border-slate-700 pb-2">Configuration</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="num-texts" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Number of Texts (1-8)</label>
              <input 
                type="number" 
                id="num-texts"
                value={settings.numTexts}
                onChange={(e) => onSettingsChange({ numTexts: Math.max(1, Math.min(8, parseInt(e.target.value, 10) || 1)) })}
                className="mt-1 block w-full bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm text-slate-900 dark:text-slate-200"
              />
            </div>
            <div className="flex items-end">
              <div className="flex items-center h-full">
                <input 
                  id="shuffle" 
                  name="shuffle" 
                  type="checkbox" 
                  checked={settings.shuffle}
                  onChange={(e) => onSettingsChange({ shuffle: e.target.checked })}
                  className="h-4 w-4 text-primary-600 border-slate-300 dark:border-slate-600 rounded focus:ring-primary-500"
                />
                <label htmlFor="shuffle" className="ml-2 block text-sm text-slate-900 dark:text-slate-200">Shuffle Text Order</label>
              </div>
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={handleStartClick}
        disabled={!fileContent}
        className="mt-8 w-full inline-flex justify-center py-3 px-4 border border-transparent shadow-sm text-lg font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:bg-slate-400 dark:disabled:bg-slate-600 disabled:cursor-not-allowed transition-all"
      >
        Start Test
      </button>
    </div>
  );
};

export default SetupScreen;