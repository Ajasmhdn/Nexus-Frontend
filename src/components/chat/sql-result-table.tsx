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
    <Card className="overflow-hidden border-slate-200 shadow-md bg-white rounded-2xl">
      <div className="max-h-[500px] overflow-auto custom-scrollbar">
        <Table>
          <TableHeader className="bg-slate-50/50 sticky top-0 z-10">
            <TableRow className="border-slate-100 hover:bg-transparent">
              {headers.map((header) => (
                <TableHead key={header} className="font-bold text-slate-900 text-[10px] uppercase tracking-wider py-5 px-6 whitespace-nowrap">
                  {header.replace(/_/g, ' ')}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((row, i) => (
              <TableRow key={i} className="hover:bg-slate-50/50 transition-colors border-slate-50 last:border-0">
                {headers.map((header) => (
                  <TableCell key={`${i}-${header}`} className="text-slate-600 px-6 py-4 text-xs font-medium">
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
