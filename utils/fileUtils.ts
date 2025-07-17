
import { TestResult } from "../types";

const downloadFile = (content: string, fileName: string, contentType: string) => {
  const a = document.createElement("a");
  const file = new Blob([content], { type: contentType });
  a.href = URL.createObjectURL(file);
  a.download = fileName;
  a.click();
  URL.revokeObjectURL(a.href);
};

export const exportToJson = (data: TestResult[], fileName: string = "cloze_results.json") => {
  const jsonString = JSON.stringify(data, null, 2);
  downloadFile(jsonString, fileName, "application/json");
};

export const exportToCsv = (data: TestResult[], fileName: string = "cloze_results.csv") => {
  if (data.length === 0) return;

  const headers = "TestID,TotalBlanks,CorrectAnswers,Accuracy,IncorrectWord,UserAnswer\n";
  
  let csvContent = headers;

  data.forEach(result => {
    const accuracy = result.totalBlanks > 0 ? ((result.correctAnswers / result.totalBlanks) * 100).toFixed(1) + '%' : 'N/A';
    if(result.incorrectAnswers.length === 0) {
        csvContent += `${result.testId},${result.totalBlanks},${result.correctAnswers},${accuracy},,\n`;
    } else {
        result.incorrectAnswers.forEach((incorrect, index) => {
            if (index === 0) {
                csvContent += `${result.testId},${result.totalBlanks},${result.correctAnswers},${accuracy},${incorrect.original},${incorrect.userAnswer || '""'}\n`;
            } else {
                csvContent += `,,,,${incorrect.original},${incorrect.userAnswer || '""'}\n`;
            }
        });
    }
  });

  downloadFile(csvContent, fileName, "text/csv;charset=utf-8;");
};
