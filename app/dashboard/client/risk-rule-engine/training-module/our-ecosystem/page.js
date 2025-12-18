"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  BookOpen,
  Clock,
  LayoutDashboard,
  Flag,
  Users,
  TrendingUp,
  CheckCircle2,
  AlertCircle,
  Zap,
  Target,
  ArrowRight,
  Play,
} from "lucide-react";

export default function DooitEcosystemPage() {
  const [selectedClient, setSelectedClient] = useState("");
  const [suspicionDetails, setSuspicionDetails] = useState("");
  const [dateObserved, setDateObserved] = useState("");
  const [amountInvolved, setAmountInvolved] = useState("");
  const [reportSubmitted, setReportSubmitted] = useState(false);

  const handleSubmitReport = () => {
    if (selectedClient && suspicionDetails && dateObserved && amountInvolved) {
      setReportSubmitted(true);
    }
  };

  const resetWorkflow = () => {
    setSelectedClient("");
    setSuspicionDetails("");
    setDateObserved("");
    setAmountInvolved("");
    setReportSubmitted(false);
  };

  return (
    <div className="min-h-screen bg-background blurry-overlay">
      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-lg bg-gradient-to-br from-teal-500 to-blue-600 flex items-center justify-center">
              <LayoutDashboard className="size-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-foreground">
                The Dooit.ai Ecosystem in Action
              </h1>
              <p className="text-sm text-muted-foreground">
                Your tools for compliance vigilance and reporting
              </p>
            </div>
          </div>
          <div className="text-xs font-mono bg-secondary/10 text-primary px-3 py-1 rounded">
            AML-TR-2023-04-C
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <Card className="mb-12 bg-primary/5 border-primary/20">
          <div className="h-[380px] aspect-video">
            <iframe src="https://www.youtube.com/embed/dQw4w9WgXcQ" className="w-full h-full" />
          </div>
        </Card>
        {/* Module Timeline */}
        <div className="flex items-center gap-2 mb-6">
          <Clock className="size-5 text-muted-foreground" />
          <span className="text-sm font-medium text-muted-foreground">
            Module Timeline: 40:00 - 60:00
          </span>
        </div>

        {/* Section Navigation */}
        <div className="grid gap-4 md:grid-cols-3 mb-8">
          <Card className="p-5 border-l-4 border-l-teal-500 hover:shadow-md transition-shadow">
            <div className="flex items-start gap-3">
              <LayoutDashboard className="size-5 text-teal-600 mt-1 flex-shrink-0" />
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
                  Section 1
                </p>
                <h3 className="text-lg font-semibold text-foreground mb-1">
                  Navigating Your Dashboard
                </h3>
                <p className="text-sm text-muted-foreground">40:00 - 50:00</p>
              </div>
            </div>
          </Card>

          <Card className="p-5 border-l-4 border-l-blue-500 hover:shadow-md transition-shadow">
            <div className="flex items-start gap-3">
              <Flag className="size-5 text-blue-600 mt-1 flex-shrink-0" />
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
                  Section 2
                </p>
                <h3 className="text-lg font-semibold text-foreground mb-1">
                  How to Report a Suspicion
                </h3>
                <p className="text-sm text-muted-foreground">50:00 - 58:00</p>
              </div>
            </div>
          </Card>

          <Card className="p-5 border-l-4 border-l-green-500 hover:shadow-md transition-shadow">
            <div className="flex items-start gap-3">
              <Users className="size-5 text-green-600 mt-1 flex-shrink-0" />
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
                  Section 3
                </p>
                <h3 className="text-lg font-semibold text-foreground mb-1">Recap & Empowerment</h3>
                <p className="text-sm text-muted-foreground">58:00 - 60:00</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Module Objective */}
        <Card className="mb-12 bg-gradient-to-br from-teal-50 via-blue-50 to-green-50 dark:from-teal-950/20 dark:via-blue-950/20 dark:to-green-950/20 border-2 border-primary/20">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
              <BookOpen className="size-5 text-primary" />
              Module Objective
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              This module will introduce you to the Dooit.ai platform, show you how to navigate your
              compliance dashboard, and walk you through the process of reporting suspicious
              activity using our integrated tools.
            </p>
          </div>
        </Card>

        {/* Dashboard Overview Section */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {/* Personal Compliance Score - Takes 2 columns */}
          <Card className="md:col-span-2 border-2 border-teal-200 dark:border-teal-900 bg-gradient-to-br from-teal-50 to-emerald-50 dark:from-teal-950/20 dark:to-emerald-950/20">
            <div className="p-8">
              <h3 className="text-lg font-semibold text-foreground mb-6">
                Personal Compliance Score
              </h3>
              <div className="flex items-end gap-6">
                <div>
                  <div className="text-7xl font-bold text-teal-600 mb-2">92%</div>
                  <p className="text-sm text-muted-foreground mb-4">
                    Your training and task completion are tracked here.
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>Progress</span>
                      <span>Updated: Today</span>
                    </div>
                    <div className="bg-background rounded-full h-3 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-teal-500 to-green-500 h-3 rounded-full"
                        style={{ width: "92%" }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
              <p className="text-xs text-teal-700 dark:text-teal-400 mt-4 italic">
                Keep up! Your Personal Compliance Score tracks your training and task completion.
              </p>
            </div>
          </Card>

          {/* Pending Tasks */}
          <Card className="border-2">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Pending Tasks</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  <AlertCircle className="size-4 text-amber-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-foreground">Policy Acknowledgment Q3</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <AlertCircle className="size-4 text-red-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      Enhanced Due Diligence Review
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <AlertCircle className="size-4 text-amber-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      Annual Compliance Certification
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Learning Center & Report Suspicion */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {/* Learning Center */}
          <Card className="border-2">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Learning Center</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <span className="text-sm font-medium text-foreground">
                    AML Red Flags & Legal Duties
                  </span>
                  <span className="text-xs font-semibold bg-green-100 dark:bg-green-950/30 text-green-700 dark:text-green-400 px-2 py-1 rounded">
                    Completed
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <span className="text-sm font-medium text-foreground">
                    Dooit.ai Ecosystem in Action
                  </span>
                  <span className="text-xs font-semibold bg-amber-100 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 px-2 py-1 rounded">
                    In Progress
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <span className="text-sm font-medium text-foreground">
                    Advanced Transaction Monitoring
                  </span>
                  <span className="text-xs font-semibold bg-slate-100 dark:bg-slate-950/30 text-slate-700 dark:text-slate-400 px-2 py-1 rounded">
                    Not Started
                  </span>
                </div>
              </div>
            </div>
          </Card>

          {/* Report Suspicion Feature Highlight */}
          <Card className="border-2 border-blue-200 dark:border-blue-900 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20">
            <div className="p-6">
              <div className="flex items-start gap-3 mb-4">
                <div className="size-12 rounded-xl bg-blue-600/20 flex items-center justify-center flex-shrink-0">
                  <Flag className="size-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">Report Suspicion</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                    If you identify a red flag, click the{" "}
                    <span className="font-medium text-blue-600">'Report Suspicion'</span> button
                    highlighted.{" "}
                    <span className="font-medium">
                      "This is your most important tool. It's the same whether you're in a bank, a
                      law firm, or a casino."
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Dashboard Key Features */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-foreground mb-6">Dashboard Key Features</h2>
          <div className="grid gap-6 md:grid-cols-4">
            <Card className="p-6 text-center hover:shadow-lg transition-shadow border-2 hover:border-teal-300">
              <div className="size-16 rounded-2xl bg-teal-500/10 flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="size-8 text-teal-600" />
              </div>
              <h4 className="font-semibold text-foreground mb-2">Compliance Score</h4>
              <p className="text-sm text-muted-foreground">
                Real-time tracking of your training and task completion
              </p>
            </Card>

            <Card className="p-6 text-center hover:shadow-lg transition-shadow border-2 hover:border-blue-300">
              <div className="size-16 rounded-2xl bg-blue-500/10 flex items-center justify-center mx-auto mb-4">
                <BookOpen className="size-8 text-blue-600" />
              </div>
              <h4 className="font-semibold text-foreground mb-2">Learning Hub</h4>
              <p className="text-sm text-muted-foreground">
                Access all training modules and resources
              </p>
            </Card>

            <Card className="p-6 text-center hover:shadow-lg transition-shadow border-2 hover:border-purple-300">
              <div className="size-16 rounded-2xl bg-purple-500/10 flex items-center justify-center mx-auto mb-4">
                <Target className="size-8 text-purple-600" />
              </div>
              <h4 className="font-semibold text-foreground mb-2">Task Management</h4>
              <p className="text-sm text-muted-foreground">
                Track pending compliance actions and deadlines
              </p>
            </Card>

            <Card className="p-6 text-center hover:shadow-lg transition-shadow border-2 hover:border-red-300">
              <div className="size-16 rounded-2xl bg-red-500/10 flex items-center justify-center mx-auto mb-4">
                <Zap className="size-8 text-red-600" />
              </div>
              <h4 className="font-semibold text-foreground mb-2">Quick Reporting</h4>
              <p className="text-sm text-muted-foreground">
                One-click access to suspicion reporting
              </p>
            </Card>
          </div>
        </div>

        {/* How to Report a Suspicion Section */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="size-12 rounded-xl bg-blue-600/10 flex items-center justify-center">
              <Flag className="size-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-foreground">
                How to Report a Suspicion - A Walkthrough
              </h2>
              <div className="flex items-center gap-2 mt-1">
                <Clock className="size-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">50:00 - 55:00</span>
              </div>
            </div>
          </div>

          {/* Visual Context Card */}
          <Card className="mb-8 bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-950/20 dark:via-indigo-950/20 dark:to-purple-950/20 border-blue-200 dark:border-blue-900">
            <div className="p-6">
              <div className="flex items-start gap-3">
                <div className="size-10 rounded-lg bg-blue-600/20 flex items-center justify-center flex-shrink-0">
                  <Play className="size-5 text-blue-600" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-foreground mb-2 uppercase tracking-wide">
                    Visual Context: A simulated workflow of the "Report Suspicion" button
                  </h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Let's walk through a report. Say you're an accountant, and your client can't
                    explain the source of funds for a major investment.
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* Reporting Workflow Simulation */}
          <div className="mb-8">
            <h3 className="text-2xl font-bold text-foreground mb-6">
              Reporting Workflow Simulation
            </h3>

            <Card className="border-2 border-slate-200 dark:border-slate-800">
              <div className="p-8 space-y-8">
                {/* Step 1: Select the Client */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="size-8 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-bold text-sm">1</span>
                    </div>
                    <h4 className="text-lg font-bold text-foreground">Select the Client</h4>
                  </div>
                  <p className="text-sm text-muted-foreground ml-11">
                    "Select the client's name from your client list or enter new client details if
                    necessary."
                  </p>
                  <div className="ml-11">
                    <select
                      value={selectedClient}
                      onChange={(e) => setSelectedClient(e.target.value)}
                      className="w-full p-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-background text-foreground focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      disabled={reportSubmitted}
                    >
                      <option value="">Select Client</option>
                      <option value="dooit-trade">Dooit Trade Partners Ltd</option>
                      <option value="global-consulting">Global Consulting Group</option>
                      <option value="metro-investments">Metro Investments Inc</option>
                      <option value="tech-ventures">Tech Ventures LLC</option>
                    </select>
                  </div>
                </div>

                <div className="border-t border-slate-200 dark:border-slate-800" />

                {/* Step 2: Describe the Facts */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="size-8 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-bold text-sm">2</span>
                    </div>
                    <h4 className="text-lg font-bold text-foreground">Describe the Facts</h4>
                  </div>
                  <p className="text-sm text-muted-foreground ml-11">
                    "Describe the facts factually: 'On [date], client X could not provide
                    documentation for the origin of $500,000 used to purchase shares in Company Y'"
                  </p>
                  <div className="ml-11 space-y-4">
                    <div>
                      <label className="text-sm font-medium text-foreground block mb-2">
                        Suspicion Details
                      </label>
                      <textarea
                        value={suspicionDetails}
                        onChange={(e) => setSuspicionDetails(e.target.value)}
                        placeholder="Describe the suspicious activity in detail..."
                        rows={4}
                        className="w-full p-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-background text-foreground focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                        disabled={reportSubmitted}
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-foreground block mb-2">
                          Date of Observation
                        </label>
                        <input
                          type="date"
                          value={dateObserved}
                          onChange={(e) => setDateObserved(e.target.value)}
                          className="w-full p-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-background text-foreground focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          disabled={reportSubmitted}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-foreground block mb-2">
                          Amount Involved
                        </label>
                        <input
                          type="text"
                          value={amountInvolved}
                          onChange={(e) => setAmountInvolved(e.target.value)}
                          placeholder="e.g $500,000"
                          className="w-full p-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-background text-foreground focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          disabled={reportSubmitted}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-t border-slate-200 dark:border-slate-800" />

                {/* Step 3: Submit the Report */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="size-8 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-bold text-sm">3</span>
                    </div>
                    <h4 className="text-lg font-bold text-foreground">Submit the Report</h4>
                  </div>
                  <p className="text-sm text-muted-foreground ml-11">
                    "Submit. The report is now securely with the compliance team."
                  </p>

                  {!reportSubmitted ? (
                    <div className="ml-11">
                      <div className="bg-slate-50 dark:bg-slate-900 p-6 rounded-lg border border-slate-200 dark:border-slate-800">
                        <h5 className="text-center text-lg font-semibold text-blue-600 mb-3">
                          Ready to Submit
                        </h5>
                        <p className="text-center text-sm text-muted-foreground mb-4">
                          Your report will be encrypted and sent directly to the Compliance Team.
                          You will receive a confirmation and reference number.
                        </p>
                        {selectedClient && suspicionDetails && dateObserved && amountInvolved && (
                          <div className="bg-white dark:bg-slate-950 p-4 rounded-lg mb-4 space-y-2 text-sm">
                            <p className="text-muted-foreground">
                              <span className="font-semibold text-foreground">Report Summary</span>
                            </p>
                            <p className="text-muted-foreground">
                              Client:{" "}
                              <span className="text-foreground">
                                {selectedClient === "dooit-trade"
                                  ? "Dooit Trade Partners Ltd"
                                  : selectedClient}
                              </span>
                            </p>
                            <p className="text-muted-foreground">
                              Date: <span className="text-foreground">{dateObserved}</span>
                            </p>
                            <p className="text-muted-foreground">
                              Issue:{" "}
                              <span className="text-foreground">
                                Unable to verify source of {amountInvolved} investment funds
                              </span>
                            </p>
                            <p className="text-muted-foreground">
                              Priority: <span className="text-foreground">Medium</span>
                            </p>
                            <div className="flex items-center gap-2 mt-3">
                              <input type="checkbox" id="confirm-locked" className="size-4" />
                              <label
                                htmlFor="confirm-locked"
                                className="text-xs text-muted-foreground"
                              >
                                I confirm this report is accurate and locked
                              </label>
                            </div>
                          </div>
                        )}
                        <button
                          onClick={handleSubmitReport}
                          disabled={
                            !selectedClient || !suspicionDetails || !dateObserved || !amountInvolved
                          }
                          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                        >
                          Submit Report to Compliance Team
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="ml-11">
                      <div className="bg-green-50 dark:bg-green-950/20 p-6 rounded-lg border-2 border-green-200 dark:border-green-900">
                        <div className="flex items-center gap-3 mb-3">
                          <CheckCircle2 className="size-6 text-green-600" />
                          <h5 className="text-lg font-semibold text-green-700 dark:text-green-400">
                            Report Submitted Successfully
                          </h5>
                        </div>
                        <p className="text-sm text-muted-foreground mb-4">
                          Your report has been encrypted and sent to the Compliance Team. Reference
                          number:{" "}
                          <span className="font-mono font-semibold text-foreground">
                            AML-REP-
                            {Math.floor(Math.random() * 10000)
                              .toString()
                              .padStart(6, "0")}
                          </span>
                        </p>
                        <button
                          onClick={resetWorkflow}
                          className="text-blue-600 hover:text-blue-700 font-medium text-sm underline"
                        >
                          Submit Another Report
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          </div>

          {/* Reporting Best Practices */}
          <div className="mb-8">
            <h3 className="text-2xl font-bold text-foreground mb-6">Reporting Best Practices</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border-2 border-slate-200 dark:border-slate-800 hover:shadow-lg transition-shadow">
                <div className="p-6">
                  <h4 className="text-lg font-bold text-foreground mb-3">
                    Be Factual, Not Accusatory
                  </h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Describe what you observed, not what you suspect. Let the compliance team make
                    the determination.
                  </p>
                </div>
              </Card>

              <Card className="border-2 border-slate-200 dark:border-slate-800 hover:shadow-lg transition-shadow">
                <div className="p-6">
                  <h4 className="text-lg font-bold text-foreground mb-3">Don't Delay</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Report as soon as you identify a red flag. Timely reporting is critical.
                  </p>
                </div>
              </Card>

              <Card className="border-2 border-slate-200 dark:border-slate-800 hover:shadow-lg transition-shadow">
                <div className="p-6">
                  <h4 className="text-lg font-bold text-foreground mb-3">Include All Details</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Dates, amounts, and specific observations help investigators.
                  </p>
                </div>
              </Card>

              <Card className="border-2 border-slate-200 dark:border-slate-800 hover:shadow-lg transition-shadow">
                <div className="p-6">
                  <h4 className="text-lg font-bold text-foreground mb-3">
                    Maintain Confidentiality
                  </h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Never discuss your report with the subject or colleagues outside the compliance
                    team.
                  </p>
                </div>
              </Card>
            </div>
          </div>
        </div>

        {/* Recap & Empowerment Section */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="size-12 rounded-xl bg-green-600/10 flex items-center justify-center flex-shrink-0">
              <Users className="size-6 text-green-600" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-foreground">Recap & Empowerment</h2>
              <div className="flex items-center gap-2 mt-1">
                <Clock className="size-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">58:00 - 60:00</span>
              </div>
            </div>
          </div>

          <Card className="bg-gradient-to-br from-green-50 via-teal-50 to-blue-50 dark:from-green-950/20 dark:via-teal-950/20 dark:to-blue-950/20 border-2 border-green-200 dark:border-green-900">
            <div className="p-8">
              <div className="space-y-4 mb-6">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="size-6 text-green-600 flex-shrink-0 mt-1" />
                  <p className="text-foreground leading-relaxed">
                    <span className="font-semibold">Navigate your compliance dashboard</span> -
                    Track your personal score, manage pending tasks, and access training resources
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="size-6 text-green-600 flex-shrink-0 mt-1" />
                  <p className="text-foreground leading-relaxed">
                    <span className="font-semibold">Report suspicious activity</span> - Use the
                    integrated reporting tools to fulfill your legal obligations confidently
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="size-6 text-green-600 flex-shrink-0 mt-1" />
                  <p className="text-foreground leading-relaxed">
                    <span className="font-semibold">Stay compliant and protected</span> - Your
                    vigilance contributes to our organization's security and the integrity of the
                    financial system
                  </p>
                </div>
              </div>
              <div className="bg-white/60 dark:bg-black/20 rounded-lg p-6 border border-green-200 dark:border-green-900">
                <p className="text-foreground italic text-center leading-relaxed">
                  "The Dooit.ai platform makes compliance simple and accessible. Remember: when you
                  see something suspicious, you now have the tools and knowledge to report it
                  effectively. You're empowered to protect our organization and society."
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Visual Context - Recap Card */}
        <Card className="mb-8 bg-gradient-to-r from-green-50 via-teal-50 to-blue-50 dark:from-green-950/20 dark:via-teal-950/20 dark:to-blue-950/20 border-green-200 dark:border-green-900">
          <div className="p-6">
            <div className="flex items-start gap-3">
              <div className="size-10 rounded-lg bg-green-600/20 flex items-center justify-center flex-shrink-0">
                <Users className="size-5 text-green-600" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-foreground mb-2 uppercase tracking-wide">
                  Visual Context: Mixed media. The Dooit Guide stands with key icons.
                </h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  "You now understand the crime, the red flags, and the tool. You are an essential
                  part of our collective defense."
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Complete Module CTA */}
        <Card className="p-8 bg-gradient-to-br from-primary/10 via-teal-500/10 to-green-500/10 border-2 border-primary/20">
          <div className="text-center max-w-2xl mx-auto">
            <div className="size-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="size-8 text-primary" />
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-3">
              Ready to Complete This Module?
            </h3>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              You've learned how to navigate the Dooit.ai ecosystem and report suspicious activity.
              Complete the module to update your compliance score.
            </p>
            <Link href="/dashboard/client/risk-rule-engine/training-module/our-ecosystem/assessment">
              <Button size="lg" className="group">
                Complete This Module
                <ArrowRight className="ml-2 size-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </Card>

        {/* Back Navigation */}
        <div className="mt-6 text-center">
          <Link
            href="/red-flags"
            className="text-sm text-primary hover:underline inline-flex items-center gap-1"
          >
            ← Back to Red Flags Module
          </Link>
        </div>
      </main>
    </div>
  );
}
