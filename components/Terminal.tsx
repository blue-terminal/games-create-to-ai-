import React, { useState, useEffect, useRef, useCallback } from 'react';
import { LogEntry } from '../types';
import { processCommandWithGemini } from '../services/geminiService';

interface TerminalProps {
  onActivity: () => void;
}

const Terminal: React.FC<TerminalProps> = ({ onActivity }) => {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<LogEntry[]>([
    {
      id: 'init-1',
      type: 'system',
      content: 'BLUE-TERMINAL v4.2.0 INITIALIZED...',
      timestamp: new Date()
    },
    {
      id: 'init-2',
      type: 'system',
      content: 'CONNECTION ESTABLISHED. WAITING FOR INPUT.',
      timestamp: new Date()
    }
  ]);
  const [isProcessing, setIsProcessing] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [history]);

  // Focus input on click anywhere in terminal
  const handleContainerClick = () => {
    inputRef.current?.focus();
  };

  const handleCommand = async (cmd: string) => {
    const trimmedCmd = cmd.trim();
    if (!trimmedCmd) return;

    // Add user input to history
    const userLog: LogEntry = {
      id: Date.now().toString(),
      type: 'input',
      content: trimmedCmd,
      timestamp: new Date()
    };
    setHistory(prev => [...prev, userLog]);
    setInput('');
    setIsProcessing(true);
    onActivity();

    // Local commands
    if (trimmedCmd.toLowerCase() === 'clear') {
      setTimeout(() => {
        setHistory([]);
        setIsProcessing(false);
      }, 200);
      return;
    }

    if (trimmedCmd.toLowerCase() === 'help') {
      setTimeout(() => {
        setHistory(prev => [...prev, {
          id: Date.now().toString() + '-sys',
          type: 'system',
          content: `AVAILABLE COMMANDS:\n  > analyze [target]  : Run deep scan on target\n  > decrypt [hash]    : Attempt brute-force decryption\n  > connect [ip]      : Establish remote link\n  > clear             : Purge terminal buffer\n  > [query]           : Query mainframe AI`,
          timestamp: new Date()
        }]);
        setIsProcessing(false);
      }, 500);
      return;
    }

    // AI Processing
    try {
      const response = await processCommandWithGemini(trimmedCmd);
      setHistory(prev => [...prev, {
        id: Date.now().toString() + '-ai',
        type: 'output',
        content: response,
        timestamp: new Date()
      }]);
    } catch (error) {
      setHistory(prev => [...prev, {
        id: Date.now().toString() + '-err',
        type: 'error',
        content: 'SYSTEM_ERROR: LINK_SEVERED',
        timestamp: new Date()
      }]);
    } finally {
      setIsProcessing(false);
      onActivity();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !isProcessing) {
      handleCommand(input);
    }
  };

  return (
    <div 
      className="h-full flex flex-col p-4 font-mono text-sm md:text-base overflow-hidden relative"
      onClick={handleContainerClick}
    >
      {/* Screen Overlay Effect */}
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-10 background-size-[100%_2px,3px_100%] opacity-20"></div>
      
      {/* Output Area */}
      <div className="flex-1 overflow-y-auto mb-4 space-y-2 pr-2 scrollbar-hide z-0">
        {history.map((entry) => (
          <div key={entry.id} className={`${entry.type === 'input' ? 'text-white font-bold mt-4' : entry.type === 'error' ? 'text-red-500' : 'text-blue-term'}`}>
            <span className="opacity-50 text-xs mr-2">[{entry.timestamp.toLocaleTimeString()}]</span>
            {entry.type === 'input' && <span className="text-blue-500 mr-2">root@blue-term:~#</span>}
            <span className="whitespace-pre-wrap">{entry.content}</span>
          </div>
        ))}
        {isProcessing && (
          <div className="text-blue-term animate-pulse">
            <span className="opacity-50 text-xs mr-2">[{new Date().toLocaleTimeString()}]</span>
            PROCESSING...
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input Area */}
      <div className="flex items-center bg-blue-900/10 border border-blue-term/30 p-2 rounded z-20">
        <span className="text-blue-500 mr-2 font-bold whitespace-nowrap">root@blue-term:~#</span>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          autoFocus
          className="flex-1 bg-transparent border-none outline-none text-white placeholder-blue-term/30"
          placeholder="Enter command..."
          disabled={isProcessing}
        />
        <div className={`w-2 h-4 bg-blue-term ml-1 ${isProcessing ? 'opacity-0' : 'animate-cursor-blink'}`}></div>
      </div>
    </div>
  );
};

export default Terminal;