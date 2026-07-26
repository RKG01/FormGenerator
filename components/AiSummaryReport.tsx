"use client";

import React, { useState, useTransition } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Sparkles, RefreshCw, BarChart2 } from "lucide-react";
import { generateSummary } from "@/actions/generateSummary";
import toast from "react-hot-toast";

type Props = {
  formId: number;
  initialSummary: string | null;
};

export const AiSummaryReport: React.FC<Props> = ({ formId, initialSummary }) => {
  const [summary, setSummary] = useState<string | null>(initialSummary);
  const [isPending, startTransition] = useTransition();

  const handleGenerate = () => {
    startTransition(async () => {
      const res = await generateSummary(formId);
      if (res.success && res.data) {
        setSummary(res.data);
        toast.success(res.message);
      } else {
        toast.error(res.message || "Failed to generate AI insights");
      }
    });
  };

  const renderMarkdown = (text: string) => {
    return text.split("\n").map((line, idx) => {
      const trimmed = line.trim();
      if (trimmed.startsWith("### ")) {
        return (
          <h4 key={idx} className="text-md font-semibold text-foreground mt-4 mb-2 flex items-center">
            {trimmed.replace("### ", "")}
          </h4>
        );
      }
      if (trimmed.startsWith("## ")) {
        return (
          <h3 key={idx} className="text-lg font-bold text-primary mt-6 mb-3 border-b pb-1 flex items-center">
            {trimmed.replace("## ", "")}
          </h3>
        );
      }
      if (trimmed.startsWith("# ")) {
        return (
          <h2 key={idx} className="text-xl font-extrabold text-primary mt-8 mb-4 flex items-center">
            {trimmed.replace("# ", "")}
          </h2>
        );
      }
      if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
        const itemContent = trimmed.substring(2);
        // Match bold elements in list item
        const boldRegex = /\*\*(.*?)\*\*/g;
        const parts = itemContent.split(boldRegex);
        return (
          <li key={idx} className="ml-5 list-disc text-muted-foreground my-1 leading-relaxed text-sm">
            {parts.map((part, i) =>
              i % 2 === 1 ? <strong key={i} className="font-bold text-foreground">{part}</strong> : part
            )}
          </li>
        );
      }
      if (trimmed === "") {
        return <div key={idx} className="h-2" />;
      }
      // Bold syntax (**text**)
      const boldRegex = /\*\*(.*?)\*\*/g;
      if (boldRegex.test(trimmed)) {
        const parts = trimmed.split(boldRegex);
        return (
          <p key={idx} className="text-sm leading-relaxed text-muted-foreground my-1.5">
            {parts.map((part, i) =>
              i % 2 === 1 ? <strong key={i} className="font-bold text-foreground">{part}</strong> : part
            )}
          </p>
        );
      }
      return (
        <p key={idx} className="text-sm leading-relaxed text-muted-foreground my-1.5">
          {trimmed}
        </p>
      );
    });
  };

  return (
    <Card className="w-full shadow-lg border-primary/20 mb-8 overflow-hidden bg-gradient-to-br from-background to-secondary/20">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-primary/10 text-primary">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <CardTitle className="text-lg font-bold flex items-center gap-1.5">
              AI-Powered Submission Insights
            </CardTitle>
            <CardDescription>
              Gemini model analysis of all submissions & responses
            </CardDescription>
          </div>
        </div>
        <Button
          onClick={handleGenerate}
          disabled={isPending}
          variant="outline"
          size="sm"
          className="flex items-center gap-1.5 transition-all duration-200"
        >
          {isPending ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              Analyzing...
            </>
          ) : summary ? (
            <>
              <RefreshCw className="w-4 h-4" />
              Refresh Insights
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-purple-500 fill-purple-500" />
              Generate Insights
            </>
          )}
        </Button>
      </CardHeader>
      <CardContent className="pt-2">
        {summary ? (
          <div className="space-y-2 rounded-xl bg-card border border-muted/50 p-6 shadow-inner text-card-foreground">
            {renderMarkdown(summary)}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-10 px-4 text-center rounded-xl border-2 border-dashed border-muted/50 bg-secondary/10">
            <BarChart2 className="w-12 h-12 text-muted-foreground mb-3 opacity-60" />
            <h3 className="font-semibold text-base mb-1">No AI Insights Available Yet</h3>
            <p className="text-sm text-muted-foreground max-w-sm mb-4">
              Click the button above to have Gemini AI analyze your submission response history and generate trends, sentiment, and action items.
            </p>
            <Button onClick={handleGenerate} disabled={isPending} size="sm" className="gap-2">
              <Sparkles className="w-4 h-4" />
              Generate Summary Report
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AiSummaryReport;
