
"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";

interface SQLResultTableProps {
  data: any[];
}

export function SQLResultTable({ data }: SQLResultTableProps) {
  if (!data || data.length === 0) return null;

  const headers = Object.keys(data[0]);

  return (
    <Card className="overflow-hidden border-slate-200 shadow-xl bg-white rounded-xl">
      <div className="max-h-[500px] overflow-auto custom-scrollbar">
        <Table>
          <TableHeader className="bg-slate-50/80 sticky top-0 z-10 backdrop-blur-sm">
            <TableRow className="border-slate-200 hover:bg-transparent">
              {headers.map((header) => (
                <TableHead key={header} className="font-bold text-slate-700 text-[11px] uppercase tracking-tighter py-4 px-4 whitespace-nowrap">
                  {header.replace(/_/g, ' ')}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((row, i) => (
              <TableRow key={i} className="hover:bg-slate-50/80 transition-colors border-slate-100 last:border-0">
                {headers.map((header) => (
                  <TableCell key={`${i}-${header}`} className="text-slate-600 px-4 py-3.5 text-xs font-medium">
                    {String(row[header])}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}
