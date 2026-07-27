"use client";

import React, { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateFormIntegrations } from "@/actions/updateFormIntegrations";
import toast from "react-hot-toast";
import { Globe, Sheet, Database, Copy, Check, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type Props = {
  formId: number;
  initialSettings: {
    webhookUrl: string;
    notionApiKey: string;
    notionDatabaseId: string;
    googleSheetUrl: string;
  };
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

const IntegrationsForm: React.FC<Props> = ({ formId, initialSettings }) => {
  const [activeTab, setActiveTab] = useState<"webhook" | "sheets" | "notion">("webhook");
  const [webhookUrl, setWebhookUrl] = useState(initialSettings.webhookUrl);
  const [googleSheetUrl, setGoogleSheetUrl] = useState(initialSettings.googleSheetUrl);
  const [notionApiKey, setNotionApiKey] = useState(initialSettings.notionApiKey);
  const [notionDatabaseId, setNotionDatabaseId] = useState(initialSettings.notionDatabaseId);
  const [copied, setCopied] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleCopy = () => {
    navigator.clipboard.writeText(appsScriptCode);
    setCopied(true);
    toast.success("Apps Script copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = () => {
    startTransition(async () => {
      const res = await updateFormIntegrations(formId, {
        webhookUrl: webhookUrl || null,
        googleSheetUrl: googleSheetUrl || null,
        notionApiKey: notionApiKey || null,
        notionDatabaseId: notionDatabaseId || null,
      });

      if (res.success) {
        toast.success(res.message);
      } else {
        toast.error(res.message);
      }
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
      {/* Sidebar Navigation (Col Span 4) */}
      <div className="md:col-span-4 space-y-3">
        {[
          { id: "webhook", label: "Webhooks", desc: "Generic JSON HTTP POSTs", icon: Globe, color: "text-blue-400" },
          { id: "sheets", label: "Google Sheets", desc: "Automated row syncing", icon: Sheet, color: "text-emerald-400" },
          { id: "notion", label: "Notion Database", desc: "Create Notion workspace pages", icon: Database, color: "text-purple-400" },
        ].map((tab) => {
          const TabIcon = tab.icon;
          const isSelected = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`w-full text-left p-4 rounded-xl border transition-all duration-200 flex items-center gap-4 ${
                isSelected
                  ? "bg-secondary border-primary/20 shadow-sm"
                  : "border-border/40 hover:bg-secondary/40 hover:border-border"
              }`}
            >
              <div className={`p-2 rounded-lg bg-background ${tab.color}`}>
                <TabIcon className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-foreground">{tab.label}</p>
                <p className="text-xs text-muted-foreground truncate">{tab.desc}</p>
              </div>
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

      {/* Main Content Area (Col Span 8) */}
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
                <CardHeader>
                  <CardTitle className="text-lg font-bold flex items-center gap-2">
                    <Globe className="w-5 h-5 text-blue-400" />
                    Generic Webhook Settings
                  </CardTitle>
                  <CardDescription>
                    Send real-time JSON payloads to any system (Zapier, Make, custom APIs) on every form submission.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="webhookUrl">Webhook Endpoint URL</Label>
                    <Input
                      id="webhookUrl"
                      type="url"
                      placeholder="https://your-webhook-endpoint.com/receive"
                      value={webhookUrl}
                      onChange={(e) => setWebhookUrl(e.target.value)}
                      className="rounded-xl border-border/60 bg-background/50 focus:border-violet-500/50"
                    />
                  </div>

                  <div className="bg-secondary/30 rounded-xl p-4 border border-border/40 text-xs text-muted-foreground space-y-2">
                    <span className="font-semibold text-foreground">💡 How to use Webhooks with Zapier/Make:</span>
                    <ol className="list-decimal pl-4 space-y-1.5 leading-relaxed">
                      <li>Create a new automation in Zapier or Make, and choose <strong>&quot;Catch Webhook&quot;</strong> as the trigger.</li>
                      <li>Copy the generated Webhook URL.</li>
                      <li>Paste it into the input above and click <strong>&quot;Save Configurations&quot;</strong>.</li>
                      <li>Submit a test response on your form to test the mapping!</li>
                    </ol>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === "sheets" && (
              <Card className="border-border/50 bg-background/40 backdrop-blur-md rounded-2xl shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg font-bold flex items-center gap-2">
                    <Sheet className="w-5 h-5 text-emerald-400" />
                    Google Sheets row sync
                  </CardTitle>
                  <CardDescription>
                    Write responses directly to a Google Sheet automatically without database credentials.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="sheetUrl">Google Apps Script Web App URL</Label>
                    <Input
                      id="sheetUrl"
                      type="url"
                      placeholder="https://script.google.com/macros/s/.../exec"
                      value={googleSheetUrl}
                      onChange={(e) => setGoogleSheetUrl(e.target.value)}
                      className="rounded-xl border-border/60 bg-background/50 focus:border-violet-500/50"
                    />
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
                      <li>Open your Google Sheet and click <strong>Extensions &gt; Apps Script</strong>.</li>
                      <li>Paste the copied script code (overwrite default content) and save.</li>
                      <li>Click <strong>Deploy &gt; New Deployment</strong>.</li>
                      <li>Select <strong>Web app</strong> type. Set Execute as to <strong>&quot;Me&quot;</strong>, and Who has access to <strong>&quot;Anyone&quot;</strong>.</li>
                      <li>Click Deploy, approve the permissions, copy the Web App URL, and paste it above!</li>
                    </ol>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === "notion" && (
              <Card className="border-border/50 bg-background/40 backdrop-blur-md rounded-2xl shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg font-bold flex items-center gap-2">
                    <Database className="w-5 h-5 text-purple-400" />
                    Notion Database Integration
                  </CardTitle>
                  <CardDescription>
                    Automatically create pages and append submission details directly into your Notion database.
                  </CardDescription>
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
                      <Input
                        id="notionDatabaseId"
                        type="text"
                        placeholder="32-character database string"
                        value={notionDatabaseId}
                        onChange={(e) => setNotionDatabaseId(e.target.value)}
                        className="rounded-xl border-border/60 bg-background/50 focus:border-violet-500/50"
                      />
                    </div>
                  </div>

                  <div className="bg-secondary/30 rounded-xl p-4 border border-border/40 text-xs text-muted-foreground space-y-2">
                    <span className="font-semibold text-foreground">💡 How to find details & authorize Notion:</span>
                    <ol className="list-decimal pl-4 space-y-1.5 leading-relaxed">
                      <li>Go to <a href="https://www.notion.so/my-integrations" target="_blank" className="text-violet-400 hover:underline">notion.so/my-integrations</a> and create an Internal Integration. Copy the API token and paste it above.</li>
                      <li>Open your Notion database, click the three dots icon (top-right), select <strong>Connections</strong>, search/add your Integration.</li>
                      <li>Copy the Database ID from the URL (the 32-character code in the URL: <code>notion.so/workspace/{"{databaseId}"}?v=...</code>).</li>
                      <li>Make sure your database has at least a Title field named <strong>&quot;Name&quot;</strong> (created by default on all databases). The submission details will append to the page body automatically!</li>
                    </ol>
                  </div>
                </CardContent>
              </Card>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default IntegrationsForm;
