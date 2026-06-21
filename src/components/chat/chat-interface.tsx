
"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Send, Terminal, Sparkles, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { generateSqlFromNaturalLanguage } from '@/ai/flows/generate-sql-from-natural-language';
import { SQLResultTable } from './sql-result-table';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  sql?: string;
  results?: any[];
  error?: string;
  createdAt: number;
}

const DEFAULT_SCHEMA = `
CREATE TABLE machine_logs (
    id SERIAL PRIMARY KEY,
    machine_id VARCHAR(50),
    status VARCHAR(20),
    downtime_minutes INT,
    log_timestamp TIMESTAMP
);

CREATE TABLE maintenance_records (
    id SERIAL PRIMARY KEY,
    machine_id VARCHAR(50),
    technician_name VARCHAR(100),
    action_taken TEXT,
    completed_at TIMESTAMP
);
`;

export function ChatInterface() {
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || isProcessing) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      createdAt: Date.now()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsProcessing(true);
    const queryText = input;
    setInput('');
    if (textareaRef.current) textareaRef.current.style.height = 'auto';

    try {
      const result = await generateSqlFromNaturalLanguage({
        naturalLanguageQuery: queryText,
        databaseSchema: DEFAULT_SCHEMA
      });

      const mockResults = [
        { machine_id: 'CNC-01', downtime_minutes: 45, status: 'Completed', technician_name: 'John Doe' },
        { machine_id: 'CNC-02', downtime_minutes: 120, status: 'Maintenance Required', technician_name: 'Sarah Smith' },
        { machine_id: 'LASER-04', downtime_minutes: 15, status: 'Running', technician_name: 'Mike Brown' }
      ];

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `I've translated your request into the following SQL query. Based on our current machine logs, here is the analysis:`,
        sql: result.sqlQuery,
        results: mockResults,
        createdAt: Date.now()
      };

      setMessages(prev => [...prev, assistantMessage]);

    } catch (error: any) {
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "I encountered an error while processing your request.",
        error: error.message,
        createdAt: Date.now()
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const onTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const target = e.target;
    target.style.height = 'auto';
    target.style.height = `${target.scrollHeight}px`;
    setInput(target.value);
  };

  return (
    <div className="flex flex-col h-full max-w-5xl mx-auto w-full relative">
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto pt-10 pb-32 px-4 space-y-8 custom-scrollbar"
      >
        {messages.length === 0 && !isProcessing && (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-6 animate-in fade-in duration-700">
            <div className="h-16 w-16 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center shadow-sm">
              <Sparkles className="h-8 w-8 text-primary" strokeWidth={1.5} />
            </div>
            <div className="space-y-2 max-w-md">
              <h2 className="text-2xl font-semibold text-slate-900 tracking-tight">Industrial Operations Assistant</h2>
              <p className="text-slate-500 text-base leading-relaxed">
                Connect your database and ask natural language questions about maintenance logs, machine uptime, or technician performance.
              </p>
            </div>
          </div>
        )}

        {messages.map((message) => (
          <div 
            key={message.id} 
            className={cn(
              "flex flex-col gap-3 animate-in fade-in slide-in-from-bottom-2 duration-500",
              message.role === 'user' ? "items-end" : "items-start"
            )}
          >
            <div className={cn(
              "max-w-[85%] rounded-2xl p-4 text-sm leading-relaxed",
              message.role === 'user' 
                ? "bg-slate-900 text-white shadow-lg" 
                : "bg-white border border-slate-100 shadow-sm text-slate-800"
            )}>
              <div className="flex items-center gap-2 mb-2">
                {message.role === 'assistant' ? (
                  <Sparkles className="h-4 w-4 text-primary" strokeWidth={1.5} />
                ) : (
                  <div className="h-4 w-4 rounded-full bg-slate-700 flex items-center justify-center text-[8px] font-bold">U</div>
                )}
                <span className="text-xs font-semibold uppercase tracking-wider opacity-60">
                  {message.role === 'assistant' ? 'Nexus AI' : 'Manager'}
                </span>
              </div>
              <p>{message.content}</p>
              
              {message.sql && (
                <div className="mt-4 p-3 bg-slate-50 rounded-lg border border-slate-200 font-code text-xs text-slate-600 overflow-x-auto">
                  <div className="flex items-center gap-2 mb-2 text-slate-400">
                    <Terminal className="h-3 w-3" />
                    <span className="uppercase tracking-tighter text-[10px]">Generated SQL</span>
                  </div>
                  <code className="block whitespace-pre-wrap">{message.sql}</code>
                </div>
              )}

              {message.error && (
                <div className="mt-4 p-3 bg-red-50 text-red-600 rounded-lg border border-red-100 flex items-center gap-2 text-xs">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{message.error}</span>
                </div>
              )}
            </div>

            {message.results && <SQLResultTable data={message.results} />}
          </div>
        ))}

        {isProcessing && (
          <div className="flex items-start gap-3 animate-in fade-in duration-300">
            <div className="h-8 w-8 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center animate-pulse">
              <Loader2 className="h-4 w-4 text-primary animate-spin" strokeWidth={1.5} />
            </div>
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 text-slate-400 text-xs italic">
              Analyzing schema and generating operational insights...
            </div>
          </div>
        )}
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-white via-white to-transparent">
        <div className="max-w-3xl mx-auto relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 rounded-2xl blur-xl opacity-0 group-focus-within:opacity-100 transition duration-500" />
          <div className="relative flex items-end gap-2 bg-white border border-slate-200 shadow-xl rounded-2xl p-2.5 transition-all duration-300 focus-within:border-primary/30">
            <Textarea
              ref={textareaRef}
              rows={1}
              value={input}
              onChange={onTextareaChange}
              onKeyDown={handleKeyDown}
              placeholder="Query your operational data..."
              className="min-h-[44px] max-h-[200px] w-full resize-none border-0 focus-visible:ring-0 bg-transparent py-2.5 px-3 text-slate-800 placeholder:text-slate-400"
            />
            <Button 
              size="icon" 
              onClick={() => handleSubmit()}
              disabled={!input.trim() || isProcessing}
              className="h-10 w-10 shrink-0 bg-primary hover:bg-primary/90 text-white rounded-xl shadow-lg shadow-primary/20 transition-all active:scale-95 disabled:opacity-50 disabled:scale-100"
            >
              {isProcessing ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" strokeWidth={1.5} />}
            </Button>
          </div>
        </div>
        <p className="text-[10px] text-center mt-3 text-slate-400 uppercase tracking-widest font-medium">
          Nexus uses AI reasoning to map natural language to SQL
        </p>
      </div>
    </div>
  );
}
