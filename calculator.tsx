'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calculator as CalcIcon, RotateCcw, Copy } from 'lucide-react';

export function Calculator(): JSX.Element {
  const [display, setDisplay] = useState<string>('0');
  const [previousValue, setPreviousValue] = useState<string>('');
  const [operation, setOperation] = useState<string>('');
  const [waitingForNewValue, setWaitingForNewValue] = useState<boolean>(false);
  const [history, setHistory] = useState<string[]>([]);

  const inputNumber = (num: string): void => {
    if (waitingForNewValue) {
      setDisplay(num);
      setWaitingForNewValue(false);
    } else {
      setDisplay(display === '0' ? num : display + num);
    }
  };

  const inputDecimal = (): void => {
    if (waitingForNewValue) {
      setDisplay('0.');
      setWaitingForNewValue(false);
    } else if (display.indexOf('.') === -1) {
      setDisplay(display + '.');
    }
  };

  const clear = (): void => {
    setDisplay('0');
    setPreviousValue('');
    setOperation('');
    setWaitingForNewValue(false);
  };

  const clearHistory = (): void => {
    setHistory([]);
  };

  const performOperation = (nextOperation: string): void => {
    const inputValue = parseFloat(display);

    if (previousValue === '') {
      setPreviousValue(String(inputValue));
    } else if (operation) {
      const currentValue = parseFloat(previousValue);
      const newValue = calculate(currentValue, inputValue, operation);
      
      // Add to history
      const calculation = `${currentValue} ${operation} ${inputValue} = ${newValue}`;
      setHistory(prev => [calculation, ...prev.slice(0, 9)]); // Keep last 10 calculations

      setDisplay(String(newValue));
      setPreviousValue(String(newValue));
    }

    setWaitingForNewValue(true);
    setOperation(nextOperation);
  };

  const calculate = (firstValue: number, secondValue: number, operation: string): number => {
    switch (operation) {
      case '+':
        return firstValue + secondValue;
      case '-':
        return firstValue - secondValue;
      case '×':
        return firstValue * secondValue;
      case '÷':
        return secondValue !== 0 ? firstValue / secondValue : 0;
      case '%':
        return firstValue % secondValue;
      default:
        return secondValue;
    }
  };

  const handleEquals = (): void => {
    if (operation && previousValue) {
      performOperation('');
    }
  };

  const copyToClipboard = (text: string): void => {
    navigator.clipboard.writeText(text).catch(() => {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
    });
  };

  const buttonClass = "h-14 text-lg font-medium transition-colors";
  const numberButtonClass = `${buttonClass} bg-gray-50 hover:bg-gray-100 border-gray-200`;
  const operatorButtonClass = `${buttonClass} bg-blue-500 hover:bg-blue-600 text-white`;
  const specialButtonClass = `${buttonClass} bg-gray-200 hover:bg-gray-300`;

  return (
    <div className="max-w-md mx-auto space-y-4">
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2">
            <CalcIcon className="w-5 h-5 text-blue-600" />
            Calculator
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Display */}
          <div className="bg-gray-900 text-white p-4 rounded-lg">
            <div className="text-right">
              {previousValue && operation && (
                <div className="text-sm text-gray-400 mb-1">
                  {previousValue} {operation}
                </div>
              )}
              <div 
                className="text-3xl font-mono cursor-pointer hover:bg-gray-800 p-2 rounded transition-colors"
                onClick={() => copyToClipboard(display)}
                title="Click to copy"
              >
                {display}
              </div>
            </div>
          </div>

          {/* Button Grid */}
          <div className="grid grid-cols-4 gap-2">
            {/* Row 1 */}
            <Button 
              onClick={clear} 
              className={specialButtonClass}
              variant="outline"
            >
              AC
            </Button>
            <Button 
              onClick={() => performOperation('%')} 
              className={operatorButtonClass}
            >
              %
            </Button>
            <Button 
              onClick={() => setDisplay(String(-parseFloat(display)))} 
              className={specialButtonClass}
              variant="outline"
            >
              ±
            </Button>
            <Button 
              onClick={() => performOperation('÷')} 
              className={operatorButtonClass}
            >
              ÷
            </Button>

            {/* Row 2 */}
            <Button onClick={() => inputNumber('7')} className={numberButtonClass} variant="outline">7</Button>
            <Button onClick={() => inputNumber('8')} className={numberButtonClass} variant="outline">8</Button>
            <Button onClick={() => inputNumber('9')} className={numberButtonClass} variant="outline">9</Button>
            <Button onClick={() => performOperation('×')} className={operatorButtonClass}>×</Button>

            {/* Row 3 */}
            <Button onClick={() => inputNumber('4')} className={numberButtonClass} variant="outline">4</Button>
            <Button onClick={() => inputNumber('5')} className={numberButtonClass} variant="outline">5</Button>
            <Button onClick={() => inputNumber('6')} className={numberButtonClass} variant="outline">6</Button>
            <Button onClick={() => performOperation('-')} className={operatorButtonClass}>-</Button>

            {/* Row 4 */}
            <Button onClick={() => inputNumber('1')} className={numberButtonClass} variant="outline">1</Button>
            <Button onClick={() => inputNumber('2')} className={numberButtonClass} variant="outline">2</Button>
            <Button onClick={() => inputNumber('3')} className={numberButtonClass} variant="outline">3</Button>
            <Button onClick={() => performOperation('+')} className={operatorButtonClass}>+</Button>

            {/* Row 5 */}
            <Button 
              onClick={() => inputNumber('0')} 
              className={`${numberButtonClass} col-span-2`} 
              variant="outline"
            >
              0
            </Button>
            <Button onClick={inputDecimal} className={numberButtonClass} variant="outline">.</Button>
            <Button 
              onClick={handleEquals} 
              className={`${buttonClass} bg-green-500 hover:bg-green-600 text-white`}
            >
              =
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* History */}
      {history.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-medium">History</span>
                <Badge variant="secondary">{history.length}</Badge>
              </div>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={clearHistory}
                className="text-gray-500 hover:text-red-600"
              >
                <RotateCcw className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {history.map((calculation, index) => (
                <div 
                  key={index}
                  className="flex items-center justify-between p-2 bg-gray-50 rounded text-sm font-mono hover:bg-gray-100 transition-colors group"
                >
                  <span className="flex-1">{calculation}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(calculation.split(' = ')[1])}
                    className="opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-0"
                  >
                    <Copy className="w-3 h-3" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent
