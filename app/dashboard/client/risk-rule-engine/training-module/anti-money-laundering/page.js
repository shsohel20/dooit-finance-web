"use client"

import { Card } from "@/components/ui/card"
import {
  Building2,
  Home,
  ShieldCheck,
  Users,
  Coins,
  AlertTriangle,
  BookOpen,
  Clock,
  DollarSign,
  Scale,
  AlertCircle,
  Heart,
  Shield,
  Globe,
  ArrowRight,
} from "lucide-react"
import { useRouter } from "next/navigation"

export default function AntiMoneyLaunderingPage() {
  const router = useRouter()


  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-lg bg-primary flex items-center justify-center">
              <BookOpen className="size-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-foreground">Financial Crime Training</h1>
              <p className="text-sm text-muted-foreground">Anti-Money Laundering</p>
            </div>
          </div>
          <div className="text-xs font-mono bg-secondary/10 text-primary px-3 py-1 rounded">AML-TR-2023-03-A</div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="size-5 text-muted-foreground" />
            <span className="text-sm font-medium text-muted-foreground">15 minutes</span>
            <span className="text-muted-foreground">•</span>
            <span className="text-sm text-muted-foreground">3 sections</span>
          </div>
          <h2 className="text-lg  font-bold text-foreground  text-balance">
            The Story of Financial Crime
          </h2>
          <p className="text-muted-foreground max-w-3xl text-pretty leading-relaxed">
            Understanding money laundering and why your role matters in protecting our financial system
          </p>
        </div>

        {/* Progress Bar */}
        <Card className="p-6 mb-8 bg-muted/30">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-foreground">Module Progress</span>
            <span className="text-sm text-muted-foreground">0% Complete</span>
          </div>
          <div className="bg-background rounded h-2 overflow-hidden">
            <div className="bg-primary h-2 w-0" style={{ width: "0%" }}></div>
          </div>
        </Card>

        {/* Module Sections Grid */}
        <div className="grid gap-6 md:grid-cols-3 mb-12">
          {/* Section 1: Introduction */}
          <Card className="group hover:shadow-lg transition-shadow duration-200 overflow-hidden">
            <div className="bg-primary/10 p-6 border-b border-border">
              <div className="size-12 rounded-xl bg-primary flex items-center justify-center mb-4">
                <Clock className="size-6 text-primary-foreground" />
              </div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Introduction</span>
                <span className="text-xs text-muted-foreground">• 5 min</span>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Your Frontline Role</h3>
            </div>
            <div className="p-6">
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                Discover how you're on the front line protecting the financial system. Learn about workplace scenarios
                and your critical responsibilities.
              </p>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <ShieldCheck className="size-4 text-muted-foreground" />
                <span>Not started</span>
              </div>
            </div>
          </Card>

          {/* Section 2: Core Content */}
          <Card className="group hover:shadow-lg transition-shadow duration-200 overflow-hidden">
            <div className="bg-accent/10 p-6 border-b border-border">
              <div className="size-12 rounded-xl bg-accent flex items-center justify-center mb-4">
                <AlertTriangle className="size-6 text-accent-foreground" />
              </div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Core Content</span>
                <span className="text-xs text-muted-foreground">• 8 min</span>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Three Stages of ML</h3>
            </div>
            <div className="p-6">
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                Understand placement, layering, and integration. See how money laundering plays out across different
                industries with animated visuals.
              </p>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <ShieldCheck className="size-4 text-muted-foreground" />
                <span>Not started</span>
              </div>
            </div>
          </Card>

          {/* Section 3: Conclusion */}
          <Card className="group hover:shadow-lg transition-shadow duration-200 overflow-hidden">
            <div className="bg-secondary/10 p-6 border-b border-border">
              <div className="size-12 rounded-xl bg-secondary flex items-center justify-center mb-4">
                <ShieldCheck className="size-6 text-secondary-foreground" />
              </div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Conclusion</span>
                <span className="text-xs text-muted-foreground">• 2 min</span>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Why It Matters</h3>
            </div>
            <div className="p-6">
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                Understand the impact of AML controls on protecting organizations and society. See why your vigilance
                makes a difference.
              </p>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <ShieldCheck className="size-4 text-muted-foreground" />
                <span>Not started</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Module Objective */}
        <Card className="mb-12 bg-primary/5 border-primary/20">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
              <BookOpen className="size-5 text-primary" />
              Module Objective
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              This module explains the three stages of money laundering across different industries and demonstrates why
              effective AML controls are critical for protecting our organization and society.
            </p>
          </div>
        </Card>

        {/* Key Industries Section */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold text-foreground mb-6">Key Industries at Risk</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { icon: Building2, label: "Banking" },
              { icon: Coins, label: "Crypto/VASPs" },
              { icon: Home, label: "Real Estate" },
              { icon: Scale, label: "Legal Services" },
              { icon: DollarSign, label: "Accounting" },
              { icon: AlertTriangle, label: "Casinos" },
            ].map((industry) => (
              <Card key={industry.label} className="p-4 text-center hover:shadow-md transition-shadow">
                <industry.icon className="size-8 text-primary mx-auto mb-2" />
                <p className="text-sm font-medium text-foreground">{industry.label}</p>
              </Card>
            ))}
          </div>
        </div>

        {/* Welcome Section */}
        <Card className="bg-gradient-to-br from-primary/10 via-accent/10 to-secondary/10 border-primary/20">
          <div className="p-8">
            <h3 className="text-2xl font-bold text-foreground mb-4">Welcome to the Front Line</h3>
            <p className="text-foreground leading-relaxed mb-6 max-w-3xl">
              Whether you're in a bank, a crypto firm, or a law office, you are now on the front line protecting the
              financial system. This training will show you how. Let's begin.
            </p>
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors cursor-pointer">
              Start Module
              <ShieldCheck className="size-5" />
            </div>
          </div>
        </Card>

        {/* Three Stages Section Header */}
        <div className="mt-16 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="size-12 rounded-xl bg-accent/10 flex items-center justify-center">
              <AlertTriangle className="size-6 text-accent-foreground" />
            </div>
            <div>
              <h3 className="text-3xl font-bold text-foreground">The Three Stages of Money Laundering</h3>
              <div className="flex items-center gap-2 mt-1">
                <Clock className="size-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">1:00 - 10:00</span>
              </div>
            </div>
          </div>

          {/* Visual Context Card */}
          <Card className="mb-8 bg-gradient-to-r from-blue-50 via-purple-50 to-green-50 dark:from-blue-950/20 dark:via-purple-950/20 dark:to-green-950/20 border-accent/30">
            <div className="p-6">
              <div className="flex items-start gap-3">
                <div className="size-10 rounded-lg bg-accent/20 flex items-center justify-center flex-shrink-0">
                  <BookOpen className="size-5 text-accent-foreground" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-foreground mb-2 uppercase tracking-wide">
                    Visual Context: 2D Animation showing different sectors
                  </h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    The scene splits to show how money laundering plays out across different industries. Animated
                    visuals demonstrate placement, layering, and integration.
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Stage 1: Placement */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="size-10 rounded-full bg-blue-500/10 flex items-center justify-center">
              <span className="text-lg font-bold text-blue-600">1</span>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-foreground">Stage 1: Placement</h3>
              <p className="text-sm text-muted-foreground">Introducing Illicit Funds into the Financial System</p>
            </div>
          </div>

          <Card className="mb-6 bg-blue-50/50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900">
            <div className="p-6">
              <p className="text-foreground leading-relaxed">
                Criminals need to get their illegally obtained cash into the financial system without raising suspicion.
                This first stage is where they're most vulnerable to detection.
              </p>
            </div>
          </Card>

          <div className="grid gap-6 md:grid-cols-3">
            <Card className="hover:shadow-lg transition-shadow">
              <div className="p-6">
                <div className="size-12 rounded-xl bg-blue-500/10 flex items-center justify-center mb-4">
                  <Building2 className="size-6 text-blue-600" />
                </div>
                <h4 className="text-lg font-semibold text-foreground mb-3">Banks & Financial Institutions</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  "A criminal deposits just under $10,000 in cash across multiple branches to avoid reporting – this is
                  structuring, a classic placement tactic."
                </p>
              </div>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <div className="p-6">
                <div className="size-12 rounded-xl bg-blue-500/10 flex items-center justify-center mb-4">
                  <Coins className="size-6 text-blue-600" />
                </div>
                <h4 className="text-lg font-semibold text-foreground mb-3">VASPs (Crypto Exchanges)</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  "A criminal uses a stolen credit card to buy Bitcoin, introducing illicit funds into the digital
                  ecosystem through seemingly legitimate transactions."
                </p>
              </div>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <div className="p-6">
                <div className="size-12 rounded-xl bg-blue-500/10 flex items-center justify-center mb-4">
                  <Home className="size-6 text-blue-600" />
                </div>
                <h4 className="text-lg font-semibold text-foreground mb-3">Real Estate & Legal Services</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  "At a law firm, a client uses a briefcase of cash to pay for legal services far beyond the normal
                  cost, placing illicit funds through professional services."
                </p>
              </div>
            </Card>
          </div>
        </div>

        {/* Stage 2: Layering */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="size-10 rounded-full bg-purple-500/10 flex items-center justify-center">
              <span className="text-lg font-bold text-purple-600">2</span>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-foreground">Stage 2: Layering</h3>
              <p className="text-sm text-muted-foreground">Hiding the Source Through Complex Transactions</p>
            </div>
          </div>

          <Card className="mb-6 bg-purple-50/50 dark:bg-purple-950/20 border-purple-200 dark:border-purple-900">
            <div className="p-6">
              <p className="text-foreground leading-relaxed">
                After placement, criminals move money through a series of complex transactions to obscure its origin and
                create distance from the original crime.
              </p>
            </div>
          </Card>

          <div className="grid gap-6 md:grid-cols-2">
            <Card className="hover:shadow-lg transition-shadow">
              <div className="p-6">
                <div className="size-12 rounded-xl bg-purple-500/10 flex items-center justify-center mb-4">
                  <DollarSign className="size-6 text-purple-600" />
                </div>
                <h4 className="text-lg font-semibold text-foreground mb-4">Complex Financial Movements</h4>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                  The criminal uses the money to hide its trail. A bank might see wires to offshore accounts in multiple
                  jurisdictions. A VASP might see crypto being swapped between different currencies and across multiple
                  platforms.
                </p>
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-foreground uppercase tracking-wide mb-2">
                    Layering Techniques:
                  </p>
                  <ul className="space-y-1.5 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="text-purple-600 mt-1">•</span>
                      <span>Multiple international wire transfers</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple-600 mt-1">•</span>
                      <span>Purchasing physical and cryptocurrencies</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple-600 mt-1">•</span>
                      <span>Moving funds through shell companies</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple-600 mt-1">•</span>
                      <span>Using complex corporate structures</span>
                    </li>
                  </ul>
                </div>
              </div>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <div className="p-6">
                <div className="size-12 rounded-xl bg-purple-500/10 flex items-center justify-center mb-4">
                  <Scale className="size-6 text-purple-600" />
                </div>
                <h4 className="text-lg font-semibold text-foreground mb-4">Professional Services Complicity</h4>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                  An accountant might be asked to set up a series of shell companies with no real business purpose. A
                  lawyer might be asked to create complex trust structures that obscure ownership.
                </p>
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-foreground uppercase tracking-wide mb-2">
                    Red Flags for Professionals:
                  </p>
                  <ul className="space-y-1.5 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="text-purple-600 mt-1">•</span>
                      <span>Clients requesting unnecessarily complex structures</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple-600 mt-1">•</span>
                      <span>Businesses set up with no clear business purpose</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple-600 mt-1">•</span>
                      <span>Transactions that don't match stated business activity</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple-600 mt-1">•</span>
                      <span>Refusal to provide source of funds documentation</span>
                    </li>
                  </ul>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Stage 3: Integration */}
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="size-10 rounded-full bg-green-500/10 flex items-center justify-center">
              <span className="text-lg font-bold text-green-600">3</span>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-foreground">Stage 3: Integration</h3>
              <p className="text-sm text-muted-foreground">Making "Dirty" Money Appear Legitimate</p>
            </div>
          </div>

          <Card className="mb-6 bg-green-50/50 dark:bg-green-950/20 border-green-200 dark:border-green-900">
            <div className="p-6">
              <p className="text-foreground leading-relaxed">
                The final stage where 'cleaned' money enters the legitimate economy, appearing to come from legal
                sources. The criminal now enjoys their illicit profits openly.
              </p>
            </div>
          </Card>

          <div className="grid gap-6 md:grid-cols-3">
            <Card className="hover:shadow-lg transition-shadow">
              <div className="p-6">
                <div className="size-12 rounded-xl bg-green-500/10 flex items-center justify-center mb-4">
                  <Home className="size-6 text-green-600" />
                </div>
                <h4 className="text-lg font-semibold text-foreground mb-3">Real Estate Investments</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  "A real estate agent sells a luxury property to a client for cash. The 'purchase' by the crime figure
                  integrates the laundered funds, generating seemingly legitimate income."
                </p>
              </div>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <div className="p-6">
                <div className="size-12 rounded-xl bg-green-500/10 flex items-center justify-center mb-4">
                  <Coins className="size-6 text-green-600" />
                </div>
                <h4 className="text-lg font-semibold text-foreground mb-3">Luxury Goods & Assets</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  "A precious metal dealer sells gold bars to a 'client' with a clean-looking loan documentation. Once
                  sold again, these become 'earnings' with value and are easily transportable."
                </p>
              </div>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <div className="p-6">
                <div className="size-12 rounded-xl bg-green-500/10 flex items-center justify-center mb-4">
                  <DollarSign className="size-6 text-green-600" />
                </div>
                <h4 className="text-lg font-semibold text-foreground mb-3">Gambling Establishments</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  "A gaming house sees a customer 'win' a large jackpot with chips that were originally bought with
                  layered funds. The winnings can now be deposited as seemingly legitimate earnings."
                </p>
              </div>
            </Card>
          </div>
        </div>

        {/* Why It Matters Section */}
        <div className="mt-16 mb-16">
          <div className="flex items-center gap-3 mb-8">
            <div className="size-12 rounded-xl bg-red-500/10 flex items-center justify-center">
              <AlertCircle className="size-6 text-red-600" />
            </div>
            <div>
              <h3 className="text-3xl font-bold text-foreground">Why It Matters To Us</h3>
              <div className="flex items-center gap-2 mt-1">
                <Clock className="size-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">10:00 - 15:00</span>
              </div>
            </div>
          </div>

          {/* Visual Context Card */}
          <Card className="mb-8 bg-gradient-to-br from-amber-50 to-red-50 dark:from-amber-950/20 dark:to-red-950/20 border-red-200 dark:border-red-900">
            <div className="p-6">
              <div className="flex items-start gap-3">
                <div className="size-10 rounded-lg bg-red-500/20 flex items-center justify-center flex-shrink-0">
                  <AlertTriangle className="size-5 text-red-600" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-foreground mb-2 uppercase tracking-wide">
                    Visual Context: Motion graphics with icons of fines, reputation loss, and handcuffs
                  </h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    The consequences are severe and far-reaching, affecting organizations, individuals, and society as a
                    whole.
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* Consequences Grid */}
          <div className="grid gap-6 md:grid-cols-3 mb-12">
            <Card className="bg-red-50/50 dark:bg-red-950/10 border-red-200 dark:border-red-900 hover:shadow-lg transition-shadow">
              <div className="p-6">
                <div className="size-12 rounded-xl bg-red-500/10 flex items-center justify-center mb-4">
                  <DollarSign className="size-6 text-red-600" />
                </div>
                <h4 className="text-lg font-bold text-foreground mb-3">Financial Penalties</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  For a serious AML breach, a firm can face billion-dollar fines and potentially lose its license to
                  operate entirely. The financial costs can cripple organizations.
                </p>
              </div>
            </Card>

            <Card className="bg-amber-50/50 dark:bg-amber-950/10 border-amber-200 dark:border-amber-900 hover:shadow-lg transition-shadow">
              <div className="p-6">
                <div className="size-12 rounded-xl bg-amber-500/10 flex items-center justify-center mb-4">
                  <AlertTriangle className="size-6 text-amber-600" />
                </div>
                <h4 className="text-lg font-bold text-foreground mb-3">Reputational Damage</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Once trust is lost, it's difficult to regain. Customers leave, investors flee, and partnerships
                  dissolve. The damage to brand reputation can be irreversible.
                </p>
              </div>
            </Card>

            <Card className="bg-purple-50/50 dark:bg-purple-950/10 border-purple-200 dark:border-purple-900 hover:shadow-lg transition-shadow">
              <div className="p-6">
                <div className="size-12 rounded-xl bg-purple-500/10 flex items-center justify-center mb-4">
                  <Users className="size-6 text-purple-600" />
                </div>
                <h4 className="text-lg font-bold text-foreground mb-3">Personal Consequences</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  For an accountant or lawyer, it can mean disbarment and jail time for criminal charges. Individuals
                  can face imprisonment for compliance failures.
                </p>
              </div>
            </Card>
          </div>

          {/* Human Cost Section */}
          <Card className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-950 border-slate-300 dark:border-slate-800">
            <div className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="size-10 rounded-full bg-slate-600 flex items-center justify-center">
                  <Heart className="size-5 text-white" />
                </div>
                <h4 className="text-2xl font-bold text-foreground">The Human Cost: This Is Not A Victimless Crime</h4>
              </div>

              <div className="mb-6">
                <p className="text-base font-semibold text-foreground mb-3">Our Vigilance Has Real Impact</p>
                <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                  "The proceeds fund drug trafficking, terrorism, and human exploitation. Our vigilance directly
                  disrupts this. Every suspicious activity report you file could be stopping:"
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-4 bg-background rounded-lg border border-border">
                    <div className="size-8 rounded-lg bg-red-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <AlertTriangle className="size-4 text-red-600" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground mb-1">
                        Drug Trafficking that destroys communities
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-4 bg-background rounded-lg border border-border">
                    <div className="size-8 rounded-lg bg-red-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Users className="size-4 text-red-600" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground mb-1">Human Trafficking and modern slavery</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-4 bg-background rounded-lg border border-border">
                    <div className="size-8 rounded-lg bg-red-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Shield className="size-4 text-red-600" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground mb-1">
                        Terrorist Activities that threaten security
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-4 bg-background rounded-lg border border-border">
                    <div className="size-8 rounded-lg bg-orange-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Building2 className="size-4 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground mb-1">
                        Corruption that undermines institutions
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-4 bg-background rounded-lg border border-border">
                    <div className="size-8 rounded-lg bg-orange-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <AlertCircle className="size-4 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground mb-1">
                        Fraud Schemes that target the vulnerable
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-4 bg-background rounded-lg border border-border">
                    <div className="size-8 rounded-lg bg-orange-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Globe className="size-4 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground mb-1">
                        Environmental Crimes that harm our planet
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Complete Module Button */}
              <div className="flex justify-end mt-8">
                <button
                  className="flex items-center gap-2 px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-semibold transition-colors shadow-lg hover:shadow-xl"
                  onClick={() => {
                    router.push('/dashboard/client/risk-rule-engine/training-module/anti-money-laundering/assessment')
                  }}>
                  Complete This Module
                  <ArrowRight className="size-5" />
                </button>
              </div>
            </div>
          </Card>
        </div>
      </main>
    </div>
  )
}
