"use client";

import React, { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateFormIntegrations } from "@/actions/updateFormIntegrations";
import { testIntegration } from "@/actions/testIntegration";
import toast from "react-hot-toast";
import { 
  Globe, 
  Sheet, 
  Database, 
  Copy, 
  Check, 
  Loader2, 
  Send, 
  AlertCircle, 
  CheckCircle2, 
  XCircle,
  RefreshCw
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type Log = {
  id: number;
  createdAt: string;
  submissionId: number;
  integrationType: string;
  status: string;
  message: string | null;
};

type Props = {
  formId: number;
  initialSettings: {
    webhookUrl: string;
    webhookEnabled: boolean;
    webhookStatus: string;
    webhookLastSync: string | null;
    webhookLastSuccess: string | null;

    notionApiKey: string;
    notionDatabaseId: string;
    notionEnabled: boolean;
    notionStatus: string;
    notionLastSync: string | null;
    notionLastSuccess: string | null;

    googleSheetUrl: string;
    googleSheetEnabled: boolean;
    googleSheetStatus: string;
    googleSheetLastSync: string | null;
    googleSheetLastSuccess: string | null;
  };
  logs: Log[];
};

const appsScriptCode = `function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var data = JSON.parse(e.postData.contents);
  
  // Headers: Timestamp, Submission ID, Form Title
  var headers = ["Timestamp", "Submission ID", "Form Title"];
  var keys = Object.keys(data.data);
  var fullHeaders = headers.concat(keys);
  
  // Create headers if sheet is empty
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(fullHeaders);
  }
  
  // Append response row
  var row = [new Date(), data.submissionId, data.formTitle];
  keys.forEach(function(key) {
    row.push(data.data[key]);
  });
  
  sheet.appendRow(row);
  return ContentService.createTextOutput("Success");
}`;

const IntegrationsForm: React.FC<Props> = ({ formId, initialSettings, logs }) => {
  const [activeTab, setActiveTab] = useState<"webhook" | "sheets" | "notion">("webhook");
  
  // Webhook State
  const [webhookUrl, setWebhookUrl] = useState(initialSettings.webhookUrl);
  const [webhookEnabled, setWebhookEnabled] = useState(initialSettings.webhookEnabled);
  const [webhookStatus, setWebhookStatus] = useState(initialSettings.webhookStatus);

  // Sheets State
  const [googleSheetUrl, setGoogleSheetUrl] = useState(initialSettings.googleSheetUrl);
  const [googleSheetEnabled, setGoogleSheetEnabled] = useState(initialSettings.googleSheetEnabled);
  const [googleSheetStatus, setGoogleSheetStatus] = useState(initialSettings.googleSheetStatus);

  // Notion State
  const [notionApiKey, setNotionApiKey] = useState(initialSettings.notionApiKey);
  const [notionDatabaseId, setNotionDatabaseId] = useState(initialSettings.notionDatabaseId);
  const [notionEnabled, setNotionEnabled] = useState(initialSettings.notionEnabled);
  const [notionStatus, setNotionStatus] = useState(initialSettings.notionStatus);

  const [copied, setCopied] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [isTesting, setIsTesting] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(appsScriptCode);
    setCopied(true);
    toast.success("Apps Script copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleTestConnection = async (type: "webhook" | "sheets" | "notion") => {
    setIsTesting(true);
    try {
      let res;
      if (type === "webhook") {
        res = await testIntegration("webhook", { webhookUrl });
      } else if (type === "sheets") {
        res = await testIntegration("sheets", { googleSheetUrl });
      } else {
        res = await testIntegration("notion", { notionApiKey, notionDatabaseId });
      }

      if (res.success) {
        toast.success(res.message);
        if (type === "webhook") setWebhookStatus("CONNECTED");
        else if (type === "sheets") setGoogleSheetStatus("CONNECTED");
        else setNotionStatus("CONNECTED");
      } else {
        toast.error(res.message);
        const failStatus = res.message.includes("Unauthorized") || res.message.includes("Not Found") || res.message.includes("Invalid")
          ? "INVALID_CREDENTIALS"
          : "SYNC_FAILED";
          
        if (type === "webhook") setWebhookStatus(failStatus);
        else if (type === "sheets") setGoogleSheetStatus(failStatus);
        else setNotionStatus(failStatus);
      }
    } catch (error) {
      toast.error(`Failed to verify ${type} connection.`);
    } finally {
      setIsTesting(false);
    }
  };

  const handleSave = () => {
    startTransition(async () => {
      const res = await updateFormIntegrations(formId, {
        webhookUrl: webhookUrl || null,
        webhookEnabled,
        googleSheetUrl: googleSheetUrl || null,
        googleSheetEnabled,
        notionApiKey: notionApiKey || null,
        notionDatabaseId: notionDatabaseId || null,
        notionEnabled,
      });

      if (res.success) {
        toast.success(res.message);
      } else {
        toast.error(res.message);
      }
    });
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "Never";
    const date = new Date(dateStr);
    return date.toLocaleString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusBadge = (status: string, enabled: boolean) => {
    if (!enabled) {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-muted text-muted-foreground border border-border">
          <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground" />
          Disabled
        </span>
      );
    }

    switch (status) {
      case "CONNECTED":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Connected
          </span>
        );
      case "INVALID_CREDENTIALS":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-rose-500/10 text-rose-500 border border-rose-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
            Invalid URL/API key
          </span>
        );
      case "SYNC_FAILED":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-500/10 text-amber-500 border border-amber-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            Last sync failed
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-muted text-muted-foreground border border-border">
            <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground" />
            Disconnected
          </span>
        );
    }
  };

  const getTabStatusColor = (status: string, enabled: boolean) => {
    if (!enabled) return "bg-zinc-600";
    if (status === "CONNECTED") return "bg-emerald-500";
    if (status === "INVALID_CREDENTIALS") return "bg-rose-500";
    if (status === "SYNC_FAILED") return "bg-amber-500";
    return "bg-zinc-600";
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Sidebar Navigation */}
        <div className="md:col-span-4 space-y-3">
          {[
            { id: "webhook", label: "Webhooks", desc: "Generic JSON HTTP POSTs", icon: Globe, color: "text-blue-400", status: webhookStatus, enabled: webhookEnabled },
            { id: "sheets", label: "Google Sheets", desc: "Automated row syncing", icon: Sheet, color: "text-emerald-400", status: googleSheetStatus, enabled: googleSheetEnabled },
            { id: "notion", label: "Notion Database", desc: "Create Notion workspace pages", icon: Database, color: "text-purple-400", status: notionStatus, enabled: notionEnabled },
          ].map((tab) => {
            const TabIcon = tab.icon;
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`w-full text-left p-4 rounded-xl border transition-all duration-200 flex items-center justify-between ${
                  isSelected
                    ? "bg-secondary border-primary/20 shadow-sm"
                    : "border-border/40 hover:bg-secondary/40 hover:border-border"
                }`}
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div className={`p-2 rounded-lg bg-background ${tab.color}`}>
                    <TabIcon className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-foreground">{tab.label}</p>
                    <p className="text-xs text-muted-foreground truncate">{tab.desc}</p>
                  </div>
                </div>
                
                {/* Micro Status Dot */}
                <div className={`w-2.5 h-2.5 rounded-full ${getTabStatusColor(tab.status, tab.enabled)}`} />
              </button>
            );
          })}

          <div className="pt-4">
            <Button
              onClick={handleSave}
              disabled={isPending}
              className="w-full bg-violet-600 hover:bg-violet-700 text-white font-semibold rounded-xl h-11 shadow-md shadow-violet-500/10 flex items-center justify-center gap-2"
            >
              {isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                "Save Configurations"
              )}
            </Button>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="md:col-span-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
            >
              {activeTab === "webhook" && (
                <Card className="border-border/50 bg-background/40 backdrop-blur-md rounded-2xl shadow-sm">
                  <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <CardTitle className="text-lg font-bold flex items-center gap-2">
                        <Globe className="w-5 h-5 text-blue-400" />
                        Generic Webhook Settings
                      </CardTitle>
                      <CardDescription>
                        Send real-time JSON payloads to any system on every form submission.
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-3">
                      {getStatusBadge(webhookStatus, webhookEnabled)}
                      
                      {/* Enable/Disable Toggle */}
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={webhookEnabled}
                          onChange={(e) => setWebhookEnabled(e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-secondary peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-border after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-violet-600"></div>
                      </label>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="webhookUrl">Webhook Endpoint URL</Label>
                      <div className="flex gap-2">
                        <Input
                          id="webhookUrl"
                          type="url"
                          placeholder="https://your-webhook-endpoint.com/receive"
                          value={webhookUrl}
                          onChange={(e) => setWebhookUrl(e.target.value)}
                          className="rounded-xl border-border/60 bg-background/50 focus:border-violet-500/50 flex-1"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => handleTestConnection("webhook")}
                          disabled={isTesting || !webhookUrl}
                          className="rounded-xl border-violet-500/20 text-violet-500 hover:bg-violet-500/10 hover:text-violet-600 font-medium flex items-center gap-1.5 min-w-[100px]"
                        >
                          {isTesting ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <>
                              <Send className="w-3.5 h-3.5" />
                              Test Connection
                            </>
                          )}
                        </Button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 py-2 border-y border-border/30 text-xs">
                      <div>
                        <span className="text-muted-foreground">Last Synced:</span>{" "}
                        <span className="font-medium text-foreground">{formatDate(initialSettings.webhookLastSync)}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Last Successful Sync:</span>{" "}
                        <span className="font-medium text-foreground">{formatDate(initialSettings.webhookLastSuccess)}</span>
                      </div>
                    </div>

                    <div className="bg-secondary/30 rounded-xl p-4 border border-border/40 text-xs text-muted-foreground space-y-2">
                      <span className="font-semibold text-foreground">💡 Setup Instructions:</span>
                      <ol className="list-decimal pl-4 space-y-1.5 leading-relaxed">
                        <li>Paste your webhook receiving URL above.</li>
                        <li>Click <strong>&quot;Test Connection&quot;</strong> to verify the URL responds.</li>
                        <li>Toggle the switch to **Enabled** and click <strong>&quot;Save Configurations&quot;</strong>.</li>
                        <li>Failed deliveries will auto-retry up to 3 times in the background with exponential backoff.</li>
                      </ol>
                    </div>
                  </CardContent>
                </Card>
              )}

              {activeTab === "sheets" && (
                <Card className="border-border/50 bg-background/40 backdrop-blur-md rounded-2xl shadow-sm">
                  <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <CardTitle className="text-lg font-bold flex items-center gap-2">
                        <Sheet className="w-5 h-5 text-emerald-400" />
                        Google Sheets Row Sync
                      </CardTitle>
                      <CardDescription>
                        Write responses directly to a Google Sheet automatically.
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-3">
                      {getStatusBadge(googleSheetStatus, googleSheetEnabled)}
                      
                      {/* Enable/Disable Toggle */}
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={googleSheetEnabled}
                          onChange={(e) => setGoogleSheetEnabled(e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-secondary peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-border after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-violet-600"></div>
                      </label>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="sheetUrl">Google Apps Script Web App URL</Label>
                      <div className="flex gap-2">
                        <Input
                          id="sheetUrl"
                          type="url"
                          placeholder="https://script.google.com/macros/s/.../exec"
                          value={googleSheetUrl}
                          onChange={(e) => setGoogleSheetUrl(e.target.value)}
                          className="rounded-xl border-border/60 bg-background/50 focus:border-violet-500/50 flex-1"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => handleTestConnection("sheets")}
                          disabled={isTesting || !googleSheetUrl}
                          className="rounded-xl border-violet-500/20 text-violet-500 hover:bg-violet-500/10 hover:text-violet-600 font-medium flex items-center gap-1.5 min-w-[100px]"
                        >
                          {isTesting ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <>
                              <Send className="w-3.5 h-3.5" />
                              Test Connection
                            </>
                          )}
                        </Button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 py-2 border-y border-border/30 text-xs">
                      <div>
                        <span className="text-muted-foreground">Last Synced:</span>{" "}
                        <span className="font-medium text-foreground">{formatDate(initialSettings.googleSheetLastSync)}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Last Successful Sync:</span>{" "}
                        <span className="font-medium text-foreground">{formatDate(initialSettings.googleSheetLastSuccess)}</span>
                      </div>
                    </div>

                    {/* Apps Script Box */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label className="text-xs font-semibold text-foreground">1. Google Apps Script Code</Label>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={handleCopy}
                          className="h-8 text-xs gap-1.5"
                        >
                          {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
                          {copied ? "Copied" : "Copy Code"}
                        </Button>
                      </div>
                      <pre className="p-4 bg-zinc-950 text-zinc-300 rounded-xl text-xs overflow-x-auto max-h-48 border border-border/40 font-mono leading-relaxed">
                        {appsScriptCode}
                      </pre>
                    </div>

                    <div className="bg-secondary/30 rounded-xl p-4 border border-border/40 text-xs text-muted-foreground space-y-2">
                      <span className="font-semibold text-foreground">2. Installation Guide:</span>
                      <ol className="list-decimal pl-4 space-y-1.5 leading-relaxed">
                        <li>In Google Sheets, click <strong>Extensions &gt; Apps Script</strong>.</li>
                        <li>Paste the code, save, and click <strong>Deploy &gt; New Deployment</strong>.</li>
                        <li>Set type to <strong>Web app</strong>, execute as <strong>&quot;Me&quot;</strong>, access as <strong>&quot;Anyone&quot;</strong>.</li>
                        <li>Copy the Web App URL, paste above, click **Test Connection** then **Save**.</li>
                      </ol>
                    </div>
                  </CardContent>
                </Card>
              )}

              {activeTab === "notion" && (
                <Card className="border-border/50 bg-background/40 backdrop-blur-md rounded-2xl shadow-sm">
                  <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <CardTitle className="text-lg font-bold flex items-center gap-2">
                        <Database className="w-5 h-5 text-purple-400" />
                        Notion Database Integration
                      </CardTitle>
                      <CardDescription>
                        Create pages and append details directly into your Notion database.
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-3">
                      {getStatusBadge(notionStatus, notionEnabled)}
                      
                      {/* Enable/Disable Toggle */}
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={notionEnabled}
                          onChange={(e) => setNotionEnabled(e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-secondary peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-border after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-violet-600"></div>
                      </label>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="notionApiKey">Notion Internal Integration Token</Label>
                        <Input
                          id="notionApiKey"
                          type="password"
                          placeholder="secret_..."
                          value={notionApiKey}
                          onChange={(e) => setNotionApiKey(e.target.value)}
                          className="rounded-xl border-border/60 bg-background/50 focus:border-violet-500/50"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="notionDatabaseId">Notion Database ID</Label>
                        <div className="flex gap-2">
                          <Input
                            id="notionDatabaseId"
                            type="text"
                            placeholder="32-character database string"
                            value={notionDatabaseId}
                            onChange={(e) => setNotionDatabaseId(e.target.value)}
                            className="rounded-xl border-border/60 bg-background/50 focus:border-violet-500/50 flex-1"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => handleTestConnection("notion")}
                            disabled={isTesting || !notionApiKey || !notionDatabaseId}
                            className="rounded-xl border-violet-500/20 text-violet-500 hover:bg-violet-500/10 hover:text-violet-600 font-medium flex items-center gap-1.5 min-w-[100px]"
                          >
                            {isTesting ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <>
                                <Send className="w-3.5 h-3.5" />
                                Test Connection
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 py-2 border-y border-border/30 text-xs">
                      <div>
                        <span className="text-muted-foreground">Last Synced:</span>{" "}
                        <span className="font-medium text-foreground">{formatDate(initialSettings.notionLastSync)}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Last Successful Sync:</span>{" "}
                        <span className="font-medium text-foreground">{formatDate(initialSettings.notionLastSuccess)}</span>
                      </div>
                    </div>

                    <div className="bg-secondary/30 rounded-xl p-4 border border-border/40 text-xs text-muted-foreground space-y-2">
                      <span className="font-semibold text-foreground">💡 Notion Auth Guide:</span>
                      <ol className="list-decimal pl-4 space-y-1.5 leading-relaxed">
                        <li>Go to <a href="https://www.notion.so/my-integrations" target="_blank" rel="noreferrer" className="text-violet-400 hover:underline">notion.so/my-integrations</a> and create an Internal Integration.</li>
                        <li>Add your Integration under <strong>Connections</strong> in your Notion database's three-dot settings menu.</li>
                        <li>Paste the API Token and Database ID above, click **Test Connection** then **Save**.</li>
                      </ol>
                    </div>
                  </CardContent>
                </Card>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Sync Logs and History */}
      <Card className="border-border/50 bg-background/20 backdrop-blur-md rounded-2xl shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-bold flex items-center gap-2">
            <RefreshCw className="w-5 h-5 text-violet-400" />
            Sync History & Logs
          </CardTitle>
          <CardDescription>
            Audit trail of form submissions syncing to external integrations.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {logs.length === 0 ? (
            <div className="text-center py-10 border border-dashed border-border/50 rounded-xl">
              <AlertCircle className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">No sync history logs found for this form.</p>
              <p className="text-xs text-muted-foreground/60 mt-1">Submit responses on the published form to trigger your active integrations.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-border/40 text-muted-foreground text-xs font-semibold uppercase bg-secondary/20">
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Integration</th>
                    <th className="py-3 px-4">Event</th>
                    <th className="py-3 px-4">Result / Message</th>
                    <th className="py-3 px-4 text-right">Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/20">
                  {logs.map((log) => (
                    <tr key={log.id} className="hover:bg-secondary/10 transition-colors">
                      <td className="py-3.5 px-4">
                        {log.status === "SUCCESS" ? (
                          <span className="inline-flex items-center gap-1 text-emerald-500 font-medium">
                            <CheckCircle2 className="w-4 h-4" />
                            Success
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-rose-500 font-medium">
                            <XCircle className="w-4 h-4" />
                            Failed
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 font-medium text-foreground">
                        {log.integrationType === "WEBHOOK" && "Webhook"}
                        {log.integrationType === "GOOGLE_SHEET" && "Google Sheets"}
                        {log.integrationType === "NOTION" && "Notion"}
                      </td>
                      <td className="py-3.5 px-4 text-muted-foreground">
                        Submission #{log.submissionId}
                      </td>
                      <td className="py-3.5 px-4 text-foreground/80 max-w-xs truncate" title={log.message || ""}>
                        {log.message || "N/A"}
                      </td>
                      <td className="py-3.5 px-4 text-right text-muted-foreground text-xs">
                        {new Date(log.createdAt).toLocaleString("en-US", {
                          day: "numeric",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit",
                          second: "2-digit"
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default IntegrationsForm;
