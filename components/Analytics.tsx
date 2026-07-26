"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import {
  ClipboardList,
  Globe,
  MessageSquare,
  AlertCircle,
  Calendar,
  ArrowRight,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";

type Props = {
  stats: {
    totalForms: number;
    publishedForms: number;
    totalSubmissions: number;
    urgentCount: number;
    recentSubmissions: Array<{
      id: number;
      createdAt: Date;
      formTitle: string;
      tags: string[];
    }>;
    tagDistribution: Array<{
      tag: string;
      count: number;
    }>;
    formsData: Array<{
      id: number;
      title: string;
      submissions: number;
      published: boolean;
    }>;
  };
};

const getBadgeStyles = (tag: string) => {
  const t = tag.toLowerCase();
  if (t === "urgent") return "bg-rose-500 hover:bg-rose-600 text-white border-none shadow-sm";
  if (t === "lead") return "bg-emerald-500 hover:bg-emerald-600 text-white border-none shadow-sm";
  if (t === "billing") return "bg-amber-500 hover:bg-amber-600 text-white border-none shadow-sm";
  if (t === "spam") return "bg-gray-400 dark:bg-gray-600 text-white border-none shadow-sm";
  if (t === "feedback") return "bg-sky-500 hover:bg-sky-600 text-white border-none shadow-sm";
  if (t === "question") return "bg-indigo-500 hover:bg-indigo-600 text-white border-none shadow-sm";
  return "bg-secondary text-secondary-foreground border-none";
};

const getTagProgressColor = (tag: string) => {
  const t = tag.toLowerCase();
  if (t === "urgent") return "[&>div]:bg-rose-500 bg-rose-500/10";
  if (t === "lead") return "[&>div]:bg-emerald-500 bg-emerald-500/10";
  if (t === "billing") return "[&>div]:bg-amber-500 bg-amber-500/10";
  if (t === "spam") return "[&>div]:bg-gray-400 bg-gray-400/10";
  if (t === "feedback") return "[&>div]:bg-sky-500 bg-sky-500/10";
  if (t === "question") return "[&>div]:bg-indigo-500 bg-indigo-500/10";
  return "[&>div]:bg-primary bg-primary/10";
};

export const Analytics: React.FC<Props> = ({ stats }) => {
  const {
    totalForms,
    publishedForms,
    totalSubmissions,
    urgentCount,
    recentSubmissions,
    tagDistribution,
    formsData,
  } = stats;

  return (
    <div className="space-y-8 max-w-7xl mx-auto py-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
          <TrendingUp className="w-8 h-8 text-primary" />
          Analytics Dashboard
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Performances, AI classification distributions, and response timelines.
        </p>
      </div>

      {/* Metrics Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Total Forms */}
        <Card className="shadow-md border-blue-500/10 hover:border-blue-500/20 transition-all bg-gradient-to-br from-background to-blue-500/5">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-semibold">Total Forms</CardTitle>
            <ClipboardList className="w-4 h-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-extrabold">{totalForms}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Active forms created in your workspace
            </p>
          </CardContent>
        </Card>

        {/* Published Forms */}
        <Card className="shadow-md border-emerald-500/10 hover:border-emerald-500/20 transition-all bg-gradient-to-br from-background to-emerald-500/5">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-semibold">Published Live</CardTitle>
            <Globe className="w-4 h-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-extrabold">{publishedForms}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Forms actively accepting public submissions
            </p>
          </CardContent>
        </Card>

        {/* Total Submissions */}
        <Card className="shadow-md border-indigo-500/10 hover:border-indigo-500/20 transition-all bg-gradient-to-br from-background to-indigo-500/5">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-semibold">Submissions</CardTitle>
            <MessageSquare className="w-4 h-4 text-indigo-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-extrabold">{totalSubmissions}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Total responses collected from users
            </p>
          </CardContent>
        </Card>

        {/* Urgent Actions */}
        <Card
          className={`shadow-md transition-all ${
            urgentCount > 0
              ? "border-rose-500/30 bg-gradient-to-br from-background to-rose-500/10 shadow-rose-500/5"
              : "border-muted-foreground/10 bg-gradient-to-br from-background to-secondary/5"
          }`}
        >
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-semibold">Urgent Issues</CardTitle>
            <AlertCircle className={`w-4 h-4 ${urgentCount > 0 ? "text-rose-500 animate-pulse" : "text-muted-foreground"}`} />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-extrabold ${urgentCount > 0 ? "text-rose-500" : ""}`}>
              {urgentCount}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Submissions flagged as urgent by AI
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Dashboard Panels */}
      <div className="grid gap-6 md:grid-cols-7">
        {/* Left Column - Submissions and Breakdown */}
        <div className="md:col-span-4 space-y-6">
          {/* Recent Submissions Feed */}
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-bold">Recent Submissions</CardTitle>
              <CardDescription>The latest responses collected across all forms</CardDescription>
            </CardHeader>
            <CardContent>
              {recentSubmissions.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-6">
                  No submissions collected yet.
                </p>
              ) : (
                <div className="space-y-4">
                  {recentSubmissions.map((sub) => (
                    <div
                      key={sub.id}
                      className="flex items-center justify-between p-4 border rounded-xl bg-secondary/5 hover:bg-secondary/10 transition-colors gap-4"
                    >
                      <div className="space-y-1 min-w-0">
                        <p className="text-sm font-semibold truncate text-foreground">
                          {sub.formTitle}
                        </p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5" />
                          {new Date(sub.createdAt).toLocaleDateString()} at{" "}
                          {new Date(sub.createdAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        {sub.tags && sub.tags.length > 0 && (
                          <div className="flex gap-1 flex-wrap justify-end">
                            {sub.tags.slice(0, 2).map((tag, idx) => (
                              <Badge key={idx} className={getBadgeStyles(tag)}>
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        )}
                        <Link href={`/dashboard/forms/${sub.id}/submissions`}>
                          <ArrowRight className="w-4 h-4 text-muted-foreground hover:text-foreground cursor-pointer transition-colors" />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Forms Performance List */}
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-bold">Forms Overview</CardTitle>
              <CardDescription>Overview of submissions per form</CardDescription>
            </CardHeader>
            <CardContent>
              {formsData.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-6">
                  No forms created yet.
                </p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Form Name</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Submissions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {formsData.map((f) => (
                      <TableRow key={f.id} className="hover:bg-secondary/5">
                        <TableCell className="font-medium">
                          <Link
                            href={`/dashboard/forms/${f.id}/submissions`}
                            className="text-primary hover:underline truncate block max-w-[200px]"
                          >
                            {f.title}
                          </Link>
                        </TableCell>
                        <TableCell>
                          <Badge variant={f.published ? "default" : "secondary"}>
                            {f.published ? "Published" : "Draft"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right font-semibold">
                          {f.submissions}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Tag Distribution */}
        <div className="md:col-span-3">
          <Card className="shadow-sm h-full">
            <CardHeader>
              <CardTitle className="text-lg font-bold">AI Response Categories</CardTitle>
              <CardDescription>Classification frequency of all submissions</CardDescription>
            </CardHeader>
            <CardContent>
              {tagDistribution.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <AlertCircle className="w-10 h-10 text-muted-foreground opacity-50 mb-2" />
                  <p className="text-sm text-muted-foreground">
                    Wait for submissions to collect AI classification tags.
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {tagDistribution.map((item, idx) => {
                    const percentage = totalSubmissions > 0 ? (item.count / totalSubmissions) * 100 : 0;
                    return (
                      <div key={idx} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Badge className={`${getBadgeStyles(item.tag)} capitalize`}>
                            {item.tag}
                          </Badge>
                          <span className="text-sm font-bold text-muted-foreground">
                            {item.count} ({Math.round(percentage)}%)
                          </span>
                        </div>
                        <Progress value={percentage} className={`h-2.5 rounded-full ${getTagProgressColor(item.tag)}`} />
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
