"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import {
  BookOpen,
  Clock,
  Flag,
  Scale,
  Users,
  DollarSign,
  AlertTriangle,
  FileText,
  Coins,
  TrendingDown,
  Eye,
  ShieldAlert,
  Info,
  ArrowRight,
} from "lucide-react"

export default function RedFlagsPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-lg bg-red-600 flex items-center justify-center">
              <Flag className="size-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-foreground">AML Red Flags & Legal Duties</h1>
              <p className="text-sm text-muted-foreground">
                Identifying risks and understanding your compliance obligations
              </p>
            </div>
          </div>
          <div className="text-xs font-mono bg-secondary/10 text-primary px-3 py-1 rounded">AML-TR-2023-04-B</div>
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
          <span className="text-sm font-medium text-muted-foreground">Module Timeline: 15:00 - 40:00</span>
        </div>

        {/* Section Navigation */}
        <div className="grid gap-4 md:grid-cols-3 mb-8">
          <Card className="p-5 border-l-4 border-l-red-500 hover:shadow-md transition-shadow">
            <div className="flex items-start gap-3">
              <Flag className="size-5 text-red-600 mt-1 flex-shrink-0" />
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">Section 1</p>
                <h3 className="text-lg font-semibold text-foreground mb-1">Universal Red Flags</h3>
                <p className="text-sm text-muted-foreground">15:00 - 25:00</p>
              </div>
            </div>
          </Card>

          <Card className="p-5 border-l-4 border-l-blue-500 hover:shadow-md transition-shadow">
            <div className="flex items-start gap-3">
              <Scale className="size-5 text-blue-600 mt-1 flex-shrink-0" />
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">Section 2</p>
                <h3 className="text-lg font-semibold text-foreground mb-1">Legal Responsibilities</h3>
                <p className="text-sm text-muted-foreground">25:00 - 35:00</p>
              </div>
            </div>
          </Card>

          <Card className="p-5 border-l-4 border-l-green-500 hover:shadow-md transition-shadow">
            <div className="flex items-start gap-3">
              <Users className="size-5 text-green-600 mt-1 flex-shrink-0" />
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">Section 3</p>
                <h3 className="text-lg font-semibold text-foreground mb-1">Culture of Compliance</h3>
                <p className="text-sm text-muted-foreground">35:00 - 40:00</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Module Objective */}
        <Card className="mb-12 bg-gradient-to-br from-red-50 via-blue-50 to-green-50 dark:from-red-950/20 dark:via-blue-950/20 dark:to-green-950/20 border-2 border-primary/20">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
              <BookOpen className="size-5 text-primary" />
              Module Objective
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              This module will help you recognize common money laundering red flags across different industries,
              understand your legal obligations, and contribute to a strong compliance culture within our organization.
            </p>
          </div>
        </Card>


        {/* Section 1: Universal Red Flags */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="size-12 rounded-xl bg-red-600/10 flex items-center justify-center">
              <Flag className="size-6 text-red-600" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-foreground">Universal Red Flags</h2>
              <div className="flex items-center gap-2 mt-1">
                <Clock className="size-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">15:00 - 25:00</span>
              </div>
            </div>
          </div>

          {/* Visual Context Card */}
          <Card className="mb-8 bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-950/20 dark:to-orange-950/20 border-red-200 dark:border-red-900">
            <div className="p-6">
              <div className="flex items-start gap-3">
                <div className="size-10 rounded-lg bg-red-600/20 flex items-center justify-center flex-shrink-0">
                  <Eye className="size-5 text-red-600" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-foreground mb-2 uppercase tracking-wide">
                    Visual Context: The Dooli Guide Control Room
                  </h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Imagine our Dooli Guide character in a control room with different industry scenarios appearing on
                    monitors. These are the warning signs to look for in your sector.
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* Red Flag Cards */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* Structuring Activity */}
            <Card className="hover:shadow-lg transition-all group border-2 hover:border-red-300">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="size-12 rounded-xl bg-red-600/10 flex items-center justify-center">
                    <DollarSign className="size-6 text-red-600" />
                  </div>
                  <span className="text-xs font-medium bg-red-100 dark:bg-red-950/30 text-red-700 dark:text-red-400 px-2 py-1 rounded">
                    Banks / VASPs
                  </span>
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">Structuring Activity</h3>
                <p className="text-sm text-muted-foreground leading-relaxed italic">
                  "A customer makes multiple transactions just below the $10,000/$1,000 threshold in a single day—a
                  deliberate attempt to evade reporting requirements."
                </p>
              </div>
            </Card>

            {/* Unusual Payment Methods */}
            <Card className="hover:shadow-lg transition-all group border-2 hover:border-red-300">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="size-12 rounded-xl bg-red-600/10 flex items-center justify-center">
                    <Coins className="size-6 text-red-600" />
                  </div>
                  <span className="text-xs font-medium bg-red-100 dark:bg-red-950/30 text-red-700 dark:text-red-400 px-2 py-1 rounded">
                    Real Estate / Legal
                  </span>
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">Unusual Payment Methods</h3>
                <p className="text-sm text-muted-foreground leading-relaxed italic">
                  "A client uses a large amount of cash for a property deposit or legal fee when paying for high-value
                  transactions without clear legitimate source and a significant red flag."
                </p>
              </div>
            </Card>

            {/* Financial Discrepancies */}
            <Card className="hover:shadow-lg transition-all group border-2 hover:border-red-300">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="size-12 rounded-xl bg-red-600/10 flex items-center justify-center">
                    <TrendingDown className="size-6 text-red-600" />
                  </div>
                  <span className="text-xs font-medium bg-red-100 dark:bg-red-950/30 text-red-700 dark:text-red-400 px-2 py-1 rounded">
                    Accountants / Auditors
                  </span>
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">Financial Discrepancies</h3>
                <p className="text-sm text-muted-foreground leading-relaxed italic">
                  "A company's financial statements don't match its actual business activity—for example, a small
                  consulting firm showing millions in revenue with no corresponding client base or services rendered."
                </p>
              </div>
            </Card>

            {/* Minimal Gambling Activity */}
            <Card className="hover:shadow-lg transition-all group border-2 hover:border-red-300">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="size-12 rounded-xl bg-red-600/10 flex items-center justify-center">
                    <AlertTriangle className="size-6 text-red-600" />
                  </div>
                  <span className="text-xs font-medium bg-red-100 dark:bg-red-950/30 text-red-700 dark:text-red-400 px-2 py-1 rounded">
                    Gambling / Casinos
                  </span>
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">Minimal Gambling Activity</h3>
                <p className="text-sm text-muted-foreground leading-relaxed italic">
                  "A customer buys a large number of chips with cash, gambles minimally, and then asks for a check or
                  wire transfer. This converts illicit cash into seemingly legitimate winnings."
                </p>
              </div>
            </Card>
          </div>

          {/* Customer Behavior Red Flags */}
          <Card className="mt-6 border-2 border-orange-200 dark:border-orange-900 bg-orange-50/50 dark:bg-orange-950/20">
            <div className="p-6">
              <div className="flex items-start gap-3 mb-3">
                <ShieldAlert className="size-6 text-orange-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-bold text-foreground mb-2">Customer Behavior Red Flags</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    "Any customer who is unusually secretive, uses multiple or false IDs, provides inconsistent
                    information, or whose story doesn't add up should be treated with enhanced due diligence."
                  </p>
                  <p className="text-xs font-medium text-orange-700 dark:text-orange-400 mt-2">
                    Applicable to: All Industries
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* Key Takeaway */}
          <Card className="mt-6 bg-amber-50 dark:bg-amber-950/20 border-2 border-amber-200 dark:border-amber-900">
            <div className="p-6">
              <div className="flex items-start gap-3">
                <Info className="size-6 text-amber-600 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="text-lg font-semibold text-foreground mb-2">Key Takeaway</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Red flags are warning signs, not proof of illegal activity. Your role is to recognize these
                    indicators and escalate them to the compliance team for further investigation. When in doubt, report
                    it.
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Section 2: Legal Responsibilities */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="size-12 rounded-xl bg-blue-600/10 flex items-center justify-center">
              <Scale className="size-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-foreground">Your Legal Responsibilities</h2>
              <div className="flex items-center gap-2 mt-1">
                <Clock className="size-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">25:00 - 35:00</span>
              </div>
            </div>
          </div>

          {/* Visual Context Card */}
          <Card className="mb-8 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border-blue-200 dark:border-blue-900">
            <div className="p-6">
              <div className="flex items-start gap-3">
                <div className="size-10 rounded-lg bg-blue-600/20 flex items-center justify-center flex-shrink-0">
                  <FileText className="size-5 text-blue-600" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-foreground mb-2 uppercase tracking-wide">
                    Visual Context: Motion Graphics with Clear, Bold Text
                  </h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    The law is clear on your duties. These are non-negotiable obligations that every employee must
                    understand and follow.
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* Legal Duties Cards */}
          <div className="grid gap-6 md:grid-cols-3 mb-8">
            <Card className="border-2 border-rose-200 dark:border-rose-900 bg-rose-50/50 dark:bg-rose-950/20 hover:shadow-lg transition-shadow">
              <div className="p-6">
                <div className="size-12 rounded-xl bg-rose-600/20 flex items-center justify-center mb-4">
                  <BookOpen className="size-6 text-rose-600" />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-3">Comply with AML/CTF Program</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Your organization has an approved Anti-Money Laundering and Counter-Terrorism Financing program. This
                  training is an integral part of that compliance obligation.
                </p>
              </div>
            </Card>

            <Card className="border-2 border-amber-200 dark:border-amber-900 bg-amber-50/50 dark:bg-amber-950/20 hover:shadow-lg transition-shadow">
              <div className="p-6">
                <div className="size-12 rounded-xl bg-amber-600/20 flex items-center justify-center mb-4">
                  <AlertTriangle className="size-6 text-amber-600" />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-3">Report Suspicious Matters</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  You must report any suspicious matters immediately. If you're a precious metal dealer and a customer
                  wants to pay for a gold bar with a duffel bag of cash, that's a reportable suspicion.
                </p>
              </div>
            </Card>

            <Card className="border-2 border-red-200 dark:border-red-900 bg-red-50/50 dark:bg-red-950/20 hover:shadow-lg transition-shadow">
              <div className="p-6">
                <div className="size-12 rounded-xl bg-red-600/20 flex items-center justify-center mb-4">
                  <ShieldAlert className="size-6 text-red-600" />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-3">No Tipping Off</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  You must not "tip off" a customer. If you're a banker investigating them, you must NOT tell the
                  client. Tipping off is itself a crime.
                </p>
              </div>
            </Card>
          </div>
        </div>

        {/* Section 3: Culture of Compliance */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="size-12 rounded-xl bg-green-600/10 flex items-center justify-center">
              <Users className="size-6 text-green-600" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-foreground">The Culture of Compliance</h2>
              <div className="flex items-center gap-2 mt-1">
                <Clock className="size-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">35:00 - 40:00</span>
              </div>
            </div>
          </div>

          {/* Visual Context Card */}
          <Card className="mb-8 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border-green-200 dark:border-green-900">
            <div className="p-6">
              <div className="flex items-start gap-3">
                <div className="size-10 rounded-lg bg-green-600/20 flex items-center justify-center flex-shrink-0">
                  <Users className="size-5 text-green-600" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-foreground mb-2 uppercase tracking-wide">
                    Visual Context: Live-action shot of diverse teams
                  </h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Our organization values and protects those who demonstrate compliance vigilance. Reporting
                    suspicious activity is not just a duty—it's a protected act that contributes to our collective
                    security.
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* Protected Reporting Section */}
          <Card className="mb-8 border-2 border-green-200 dark:border-green-900">
            <div className="bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-950/40 dark:to-emerald-950/40 p-6 border-b border-green-200 dark:border-green-900">
              <h3 className="text-2xl font-bold text-foreground mb-2">Protected Reporting</h3>
              <p className="text-sm text-muted-foreground italic">
                "If you're a real estate agent and you report a suspicious buyer, you are doing your job. We have a
                culture that rewards this vigilance."
              </p>
            </div>
            <div className="p-6">
              <h4 className="font-semibold text-foreground mb-4">What Protection Means:</h4>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <div className="size-6 rounded-full bg-green-600/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-green-600">✓</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    <span className="font-medium text-foreground">Legal Protection:</span> Whistleblower laws protect
                    you from retaliation
                  </p>
                </li>
                <li className="flex items-start gap-3">
                  <div className="size-6 rounded-full bg-green-600/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-green-600">✓</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    <span className="font-medium text-foreground">Internal Support:</span> Our compliance team handles
                    all reports confidentially
                  </p>
                </li>
                <li className="flex items-start gap-3">
                  <div className="size-6 rounded-full bg-green-600/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-green-600">✓</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    <span className="font-medium text-foreground">Career Advancement:</span> Vigilance is recognized in
                    performance evaluations
                  </p>
                </li>
                <li className="flex items-start gap-3">
                  <div className="size-6 rounded-full bg-green-600/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-green-600">✓</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    <span className="font-medium text-foreground">Industry Reputation:</span> We're known for our strong
                    ethical standards
                  </p>
                </li>
              </ul>
            </div>
          </Card>

          {/* Compliance Recognition Program */}
          <div className="grid gap-6 lg:grid-cols-2 mb-8">
            <Card className="border-2 border-blue-200 dark:border-blue-900">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/30 dark:to-blue-900/20 p-6 border-b border-blue-200 dark:border-blue-900">
                <h3 className="text-xl font-bold text-foreground mb-2">Compliance in Action: Recognition Program</h3>
              </div>
              <div className="p-6">
                <h4 className="font-semibold text-foreground mb-3">Quarterly Compliance Champions</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  Each quarter, we recognize employees from different departments who demonstrated exceptional
                  compliance vigilance. Recent winners include:
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3 text-sm">
                    <div className="size-8 rounded-lg bg-amber-100 dark:bg-amber-950/30 flex items-center justify-center flex-shrink-0">
                      <span className="text-base">🏆</span>
                    </div>
                    <div>
                      <p className="font-medium text-foreground">Maria Rodriguez (Retail Banking)</p>
                      <p className="text-muted-foreground text-xs">
                        Identified structuring pattern across multiple accounts
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3 text-sm">
                    <div className="size-8 rounded-lg bg-amber-100 dark:bg-amber-950/30 flex items-center justify-center flex-shrink-0">
                      <span className="text-base">🏆</span>
                    </div>
                    <div>
                      <p className="font-medium text-foreground">David Chen (Commercial Lending)</p>
                      <p className="text-muted-foreground text-xs">Flagged inconsistent business documentation</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3 text-sm">
                    <div className="size-8 rounded-lg bg-amber-100 dark:bg-amber-950/30 flex items-center justify-center flex-shrink-0">
                      <span className="text-base">🏆</span>
                    </div>
                    <div>
                      <p className="font-medium text-foreground">Sarah Johnson (Wealth Management)</p>
                      <p className="text-muted-foreground text-xs">Reported unusual international transfer requests</p>
                    </div>
                  </li>
                </ul>
              </div>
            </Card>

            <Card className="border-2 border-purple-200 dark:border-purple-900 bg-purple-50/30 dark:bg-purple-950/10">
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/30 dark:to-purple-900/20 p-6 border-b border-purple-200 dark:border-purple-900">
                <h3 className="text-xl font-bold text-foreground mb-2">How to Report</h3>
              </div>
              <div className="p-6">
                <p className="text-sm text-muted-foreground mb-4">If you identify a red flag:</p>
                <ol className="space-y-3">
                  <li className="flex items-start gap-3">
                    <div className="size-7 rounded-full bg-purple-600 flex items-center justify-center flex-shrink-0 text-white font-bold text-sm">
                      1
                    </div>
                    <div className="text-sm">
                      <p className="font-medium text-foreground">Document what you observed</p>
                      <p className="text-muted-foreground text-xs">(dates, amounts, details)</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="size-7 rounded-full bg-purple-600 flex items-center justify-center flex-shrink-0 text-white font-bold text-sm">
                      2
                    </div>
                    <div className="text-sm">
                      <p className="font-medium text-foreground">Do NOT discuss with the customer</p>
                      <p className="text-muted-foreground text-xs">(no tipping off)</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="size-7 rounded-full bg-purple-600 flex items-center justify-center flex-shrink-0 text-white font-bold text-sm">
                      3
                    </div>
                    <div className="text-sm">
                      <p className="font-medium text-foreground">Submit a Suspicious Activity Report</p>
                      <p className="text-muted-foreground text-xs">to our internal portal</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="size-7 rounded-full bg-purple-600 flex items-center justify-center flex-shrink-0 text-white font-bold text-sm">
                      4
                    </div>
                    <div className="text-sm">
                      <p className="font-medium text-foreground">Or contact the Compliance Team directly</p>
                      <p className="text-muted-foreground text-xs">at ext. 5555</p>
                    </div>
                  </li>
                </ol>
              </div>
            </Card>
          </div>
        </div>

        {/* Call to Action */}
        <div className="flex justify-end">
          <Link href="/dashboard/client/risk-rule-engine/training-module/aml-red-flags/assessment">
            <Button
              size="lg"
              className="bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white shadow-lg hover:shadow-xl transition-all"
            >
              Complete This Module
              <ArrowRight className="ml-2 size-5" />
            </Button>
          </Link>
        </div>
      </main>
    </div>
  )
}
