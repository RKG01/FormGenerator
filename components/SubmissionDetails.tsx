import React from "react";
import { Badge } from "./ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";

type Props = {
  submission: any;
  index: number;
};

const getBadgeStyles = (tag: string) => {
  const t = tag.toLowerCase();
  if (t === "urgent") {
    return "bg-rose-500 hover:bg-rose-600 text-white font-semibold shadow-sm border-none transition-all";
  }
  if (t === "lead") {
    return "bg-emerald-500 hover:bg-emerald-600 text-white font-semibold shadow-sm border-none transition-all";
  }
  if (t === "billing") {
    return "bg-amber-500 hover:bg-amber-600 text-white font-semibold shadow-sm border-none transition-all";
  }
  if (t === "spam") {
    return "bg-gray-400 dark:bg-gray-600 text-white font-semibold border-none transition-all";
  }
  if (t === "feedback") {
    return "bg-sky-500 hover:bg-sky-600 text-white font-semibold shadow-sm border-none transition-all";
  }
  if (t === "question") {
    return "bg-indigo-500 hover:bg-indigo-600 text-white font-semibold shadow-sm border-none transition-all";
  }
  return "bg-secondary text-secondary-foreground font-semibold border-none transition-all";
};

const SubmissionsDetails: React.FC<Props> = ({ submission, index }) => {
  return (
    <div className="p-6 border rounded-xl bg-card shadow-sm">
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <h2 className="font-bold text-xl text-foreground">Response #{index + 1}</h2>
        {submission.tags && submission.tags.length > 0 && (
          <div className="flex items-center gap-1.5 flex-wrap">
            {submission.tags.map((tag: string, idx: number) => (
              <Badge key={idx} className={getBadgeStyles(tag)}>
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Questions</TableHead>
            <TableHead>Answer</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Object.entries(submission?.content).map(([key, value], idx: number) => (
            <TableRow key={idx}>
              <TableCell className="font-medium text-foreground">{key}</TableCell>
              <TableCell className="text-muted-foreground">
                {Array.isArray(value) ? value.join(", ") : String(value)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default SubmissionsDetails;