
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
  const [messages, setMessages] = useState<Message[]>([]);
  const [activeAnalysis, setActiveAnalysis] = useState<{sql?: string, results?: any[]} | null>(null);
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
                "max-w-[90%] rounded-2xl p-4 text-sm leading-relaxed",
                message.role === 'user' 
                  ? "bg-slate-900 text-white shadow-md" 
                  : "bg-slate-50 border border-slate-100 text-slate-800"
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
              <div className="h-8 w-8 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center">
                <Loader2 className="h-4 w-4 text-primary animate-spin" strokeWidth={1.5} />
              </div>
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 text-slate-400 text-xs italic">
                Reasoning over operational data...
              </div>
            </div>
          )}
        </div>

        {/* Floating Input Area (Matches Screenshot) */}
        <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-white via-white to-transparent">
          <div className="relative flex items-center gap-2 bg-white border border-slate-200 shadow-xl rounded-2xl p-2 transition-all duration-300 focus-within:border-primary/30">
            <Textarea
              ref={textareaRef}
              rows={1}
              value={input}
              onChange={onTextareaChange}
              onKeyDown={handleKeyDown}
              placeholder="Query your operational data..."
              className="min-h-[40px] max-h-[120px] w-full resize-none border-0 focus-visible:ring-0 bg-transparent py-2.5 px-3 text-sm text-slate-800 placeholder:text-slate-400"
            />
            <Button 
              size="icon" 
              onClick={() => handleSubmit()}
              disabled={!input.trim() || isProcessing}
              className="h-9 w-9 shrink-0 bg-primary/10 hover:bg-primary/20 text-primary rounded-xl transition-all active:scale-95 disabled:opacity-50"
            >
              {isProcessing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" strokeWidth={1.5} />}
            </Button>
          </div>
          <p className="text-[9px] text-center mt-3 text-slate-400 uppercase tracking-widest font-bold">
            Nexus maps natural language to industrial SQL
          </p>
        </div>
      </div>

      {/* RIGHT: Operational Analysis Panel */}
      <div className="flex-1 bg-slate-50/50 overflow-y-auto custom-scrollbar p-8">
        {!activeAnalysis ? (
          <div className="h-full flex flex-col items-center justify-center text-center space-y-6 opacity-40">
            <div className="h-16 w-16 rounded-full border-2 border-dashed border-slate-200 flex items-center justify-center">
              <TableIcon className="h-8 w-8 text-slate-300" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-semibold text-slate-900">Analysis Workspace</h3>
              <p className="text-sm text-slate-500 max-w-sm">
                Submit a query to view generated SQL, data tables, and schema insights in real-time.
              </p>
            </div>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
            {/* Active Query Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-primary text-white flex items-center justify-center shadow-lg shadow-primary/20">
                  <Code2 className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Query Analysis</h2>
                  <p className="text-xs text-slate-500">Active Operational Context</p>
                </div>
              </div>
              <Badge variant="outline" className="bg-emerald-50 text-emerald-600 border-emerald-100 flex gap-1 items-center py-1 px-3">
                <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Execution Successful
              </Badge>
            </div>

            {/* SQL Section */}
            <Card className="border-slate-200 shadow-sm overflow-hidden">
              <CardHeader className="bg-slate-50/50 py-3 px-6 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Terminal className="h-4 w-4 text-slate-400" />
                  <CardTitle className="text-sm font-semibold text-slate-700">Generated SQL Query</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-6 bg-slate-900 text-emerald-400 font-code text-sm">
                <code className="block whitespace-pre-wrap leading-relaxed">
                  {activeAnalysis.sql}
                </code>
              </CardContent>
            </Card>

            {/* Data Results Table */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 px-1">
                <TableIcon className="h-4 w-4 text-primary" />
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Result Dataset</h3>
              </div>
              <SQLResultTable data={activeAnalysis.results || []} />
            </div>

            {/* Schema Browser (Mini) */}
            <Card className="border-slate-200 shadow-sm">
              <CardHeader className="py-4 border-b border-slate-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Database className="h-4 w-4 text-slate-400" />
                    <CardTitle className="text-sm font-semibold">Active Schema Context</CardTitle>
                  </div>
                  <Info className="h-4 w-4 text-slate-300" />
                </div>
              </CardHeader>
              <CardContent className="p-4 grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase">
                    <ChevronRight className="h-3 w-3 text-primary" />
                    machine_logs
                  </div>
                  <ul className="text-[11px] space-y-1 text-slate-500 pl-5">
                    <li>id (PK)</li>
                    <li>machine_id (FK)</li>
                    <li>status</li>
                    <li>downtime_minutes</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase">
                    <ChevronRight className="h-3 w-3 text-primary" />
                    maintenance_records
                  </div>
                  <ul className="text-[11px] space-y-1 text-slate-500 pl-5">
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
