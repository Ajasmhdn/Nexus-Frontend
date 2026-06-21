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
    <Card className="overflow-hidden border-slate-200 shadow-sm mt-4">
      <div className="max-h-[400px] overflow-auto custom-scrollbar">
        <Table>
          <TableHeader className="bg-slate-50/50">
            <TableRow className="border-slate-200">
              {headers.map((header) => (
                <TableHead key={header} className="font-semibold text-slate-700 capitalize py-3 px-4">
                  {header.replace(/_/g, ' ')}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((row, i) => (
              <TableRow key={i} className="hover:bg-slate-50 transition-colors border-slate-100">
                {headers.map((header) => (
                  <TableCell key={`${i}-${header}`} className="text-slate-600 px-4 py-3">
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