"use client";

import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Terminal, 
  Sparkles, 
  Loader2, 
  AlertCircle, 
  Database, 
  Table as TableIcon, 
  ChevronRight,
  Code2,
  Info
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { generateSqlFromNaturalLanguage } from '@/ai/flows/generate-sql-from-natural-language';
import { SQLResultTable } from './sql-result-table';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

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
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'initial-1',
      role: 'user',
      content: 'assad',
      createdAt: Date.now() - 10000
    },
    {
      id: 'initial-2',
      role: 'assistant',
      content: "Analysis complete. I've generated the SQL query and retrieved the corresponding operational data.",
      sql: "SELECT 'Error: Invalid or uninterpretable query provided' AS status_message;",
      results: [
        { MACHINE_ID: 'CNC-01', DOWNTIME_MINUTES: 45, STATUS: 'Completed', TECHNICIAN_NAME: 'John Doe' },
        { MACHINE_ID: 'CNC-02', DOWNTIME_MINUTES: 120, STATUS: 'Maintenance Required', TECHNICIAN_NAME: 'Sarah Smith' },
        { MACHINE_ID: 'LASER-04', DOWNTIME_MINUTES: 15, STATUS: 'Running', TECHNICIAN_NAME: 'Mike Brown' }
      ],
      createdAt: Date.now() - 5000
    }
  ]);
  const [activeAnalysis, setActiveAnalysis] = useState<{sql?: string, results?: any[]} | null>({
    sql: "SELECT 'Error: Invalid or uninterpretable query provided' AS status_message;",
    results: [
      { MACHINE_ID: 'CNC-01', DOWNTIME_MINUTES: 45, STATUS: 'Completed', TECHNICIAN_NAME: 'John Doe' },
      { MACHINE_ID: 'CNC-02', DOWNTIME_MINUTES: 120, STATUS: 'Maintenance Required', TECHNICIAN_NAME: 'Sarah Smith' },
      { MACHINE_ID: 'LASER-04', DOWNTIME_MINUTES: 15, STATUS: 'Running', TECHNICIAN_NAME: 'Mike Brown' }
    ]
  });
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
        { MACHINE_ID: 'CNC-01', DOWNTIME_MINUTES: 45, STATUS: 'Completed', TECHNICIAN_NAME: 'John Doe' },
        { MACHINE_ID: 'CNC-02', DOWNTIME_MINUTES: 120, STATUS: 'Maintenance Required', TECHNICIAN_NAME: 'Sarah Smith' },
        { MACHINE_ID: 'LASER-04', DOWNTIME_MINUTES: 15, STATUS: 'Running', TECHNICIAN_NAME: 'Mike Brown' }
      ];

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `Analysis complete. I've generated the SQL query and retrieved the corresponding operational data.`,
        sql: result.sqlQuery,
        results: mockResults,
        createdAt: Date.now()
      };

      setMessages(prev => [...prev, assistantMessage]);
      setActiveAnalysis({ sql: result.sqlQuery, results: mockResults });

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
    <div className="flex h-full w-full bg-white overflow-hidden">
      {/* LEFT: Chat Conversation Column */}
      <div className="flex flex-col w-full max-w-[500px] border-r border-slate-100 relative bg-white shrink-0">
        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto pt-10 pb-32 px-6 space-y-6 custom-scrollbar"
        >
          {messages.length === 0 && !isProcessing && (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-6 animate-in fade-in duration-700">
              <div className="h-14 w-14 rounded-2xl bg-white border border-slate-100 flex items-center justify-center shadow-sm">
                <Sparkles className="h-7 w-7 text-primary/60" strokeWidth={1.5} />
              </div>
              <div className="space-y-2">
                <h2 className="text-xl font-bold text-slate-900 tracking-tight">Industrial Operations Assistant</h2>
                <p className="text-slate-500 text-sm leading-relaxed max-w-[280px] mx-auto">
                  Connect your database and ask natural language questions about maintenance logs or technician performance.
                </p>
              </div>
            </div>
          )}

          {messages.map((message) => (
            <div 
              key={message.id} 
              className={cn(
                "flex flex-col gap-2 animate-in fade-in slide-in-from-bottom-2 duration-400",
                message.role === 'user' ? "items-end" : "items-start"
              )}
            >
              <div className={cn(
                "max-w-[85%] rounded-2xl p-4 text-sm leading-relaxed",
                message.role === 'user' 
                  ? "bg-[#111827] text-white shadow-lg font-medium" 
                  : "bg-slate-50 border border-slate-100 text-slate-700 font-medium"
              )}>
                <p>{message.content}</p>
                {message.error && (
                  <div className="mt-3 p-2 bg-red-50 text-red-600 rounded-lg border border-red-100 flex items-center gap-2 text-xs">
                    <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                    <span>{message.error}</span>
                  </div>
                )}
              </div>
            </div>
          ))}

          {isProcessing && (
            <div className="flex items-start gap-3 animate-in fade-in duration-300">
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 text-slate-400 text-xs italic">
                Reasoning over operational data...
              </div>
            </div>
          )}
        </div>

        {/* Floating Input Area */}
        <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-white via-white to-transparent">
          <div className="relative flex items-center gap-2 bg-white border border-slate-200 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.1)] rounded-full p-2 transition-all duration-300 focus-within:border-primary/30">
            <Textarea
              ref={textareaRef}
              rows={1}
              value={input}
              onChange={onTextareaChange}
              onKeyDown={handleKeyDown}
              placeholder="Query your operational data..."
              className="min-h-[44px] max-h-[120px] w-full resize-none border-0 focus-visible:ring-0 bg-transparent py-3 px-6 text-sm text-slate-800 placeholder:text-slate-400"
            />
            <Button 
              size="icon" 
              onClick={() => handleSubmit()}
              disabled={!input.trim() || isProcessing}
              className="h-10 w-10 shrink-0 bg-transparent hover:bg-slate-50 text-primary rounded-full transition-all"
            >
              {isProcessing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-5 w-5 rotate-45" strokeWidth={1.5} />}
            </Button>
          </div>
          <p className="text-[10px] text-center mt-3 text-slate-400 uppercase tracking-widest font-bold">
            Nexus maps natural language to industrial SQL
          </p>
        </div>
      </div>

      {/* RIGHT: Operational Analysis Panel */}
      <div className="flex-1 bg-slate-50/30 overflow-y-auto custom-scrollbar p-10">
        {!activeAnalysis ? (
          <div className="h-full flex flex-col items-center justify-center text-center space-y-6 opacity-40">
            <div className="h-16 w-16 rounded-full border-2 border-dashed border-slate-200 flex items-center justify-center">
              <TableIcon className="h-8 w-8 text-slate-300" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-semibold text-slate-900">Analysis Workspace</h3>
              <p className="text-sm text-slate-500 max-w-sm">
                Submit a query to view generated SQL, data tables, and schema insights.
              </p>
            </div>
          </div>
        ) : (
          <div className="max-w-5xl mx-auto space-y-10 animate-in fade-in slide-in-from-right-4 duration-500">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-[#9603ff] text-white flex items-center justify-center shadow-lg shadow-primary/20">
                  <Code2 className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">Query Analysis</h2>
                  <p className="text-sm text-slate-400 font-medium">Active Operational Context</p>
                </div>
              </div>
              <Badge variant="outline" className="bg-emerald-50 text-emerald-600 border-emerald-100 flex gap-2 items-center py-1.5 px-4 rounded-full font-bold">
                <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Execution Successful
              </Badge>
            </div>

            {/* SQL Card */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 px-1 text-slate-400 font-bold text-sm uppercase tracking-wider">
                <ChevronRight className="h-4 w-4 text-primary" />
                Generated SQL Query
              </div>
              <Card className="border-slate-200 shadow-sm overflow-hidden rounded-2xl">
                <CardContent className="p-10 bg-[#0f172a] text-[#10b981] font-code text-base">
                  <code className="block whitespace-pre-wrap leading-relaxed">
                    {activeAnalysis.sql}
                  </code>
                </CardContent>
              </Card>
            </div>

            {/* Table Card */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 px-1 text-slate-900 font-bold text-sm uppercase tracking-wider">
                <TableIcon className="h-4 w-4 text-[#9603ff]" />
                Result Dataset
              </div>
              <SQLResultTable data={activeAnalysis.results || []} />
            </div>

            {/* Schema Card */}
            <Card className="border-slate-200 shadow-sm rounded-2xl bg-white">
              <CardHeader className="py-5 px-8 border-b border-slate-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Database className="h-5 w-5 text-slate-400" />
                    <CardTitle className="text-base font-bold text-slate-800">Active Schema Context</CardTitle>
                  </div>
                  <Info className="h-4 w-4 text-slate-300" />
                </div>
              </CardHeader>
              <CardContent className="p-8 grid gap-8 sm:grid-cols-2">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
                    <ChevronRight className="h-3.5 w-3.5 text-primary" />
                    machine_logs
                  </div>
                  <ul className="text-xs space-y-2 text-slate-500 font-medium pl-6">
                    <li>id (PK)</li>
                    <li>machine_id (FK)</li>
                    <li>status</li>
                    <li>downtime_minutes</li>
                  </ul>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
                    <ChevronRight className="h-3.5 w-3.5 text-primary" />
                    maintenance_records
                  </div>
                  <ul className="text-xs space-y-2 text-slate-500 font-medium pl-6">
                    <li>id (PK)</li>
                    <li>machine_id (FK)</li>
                    <li>technician_name</li>
                    <li>completed_at</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
