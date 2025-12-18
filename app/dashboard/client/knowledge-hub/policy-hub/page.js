"use client";

import { useState } from "react";
import { Search, BookOpen, FileText, HelpCircle, Download, Tag } from "lucide-react";

export default function Page() {
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const categories = [
    {
      icon: BookOpen,
      title: "Regulatory Guidelines",
      description: "Stay updated with global KYC regulations",
      count: 24,
    },
    {
      icon: FileText,
      title: "Implementation Guides",
      description: "Step-by-step implementation procedures",
      count: 18,
    },
    {
      icon: Tag,
      title: "Best Practices",
      description: "Industry best practices and case studies",
      count: 15,
    },
    {
      icon: HelpCircle,
      title: "FAQ & Support",
      description: "Answers to common questions and support",
      count: 32,
    },
  ];

  const articles = [
    {
      title: "Understanding AML/KYC Compliance in 2023",
      description:
        "An overview of the latest regulatory changes affecting KYC processes in the financial industry.",
      updated: "2 days ago",
      category: "Regulatory Guidelines",
    },
    {
      title: "Understanding AML/KYC Compliance in 2023",
      description:
        "An overview of the latest regulatory changes affecting KYC processes in the financial industry.",
      updated: "2 days ago",
      category: "Implementation Guides",
    },
    {
      title: "Understanding AML/KYC Compliance in 2023",
      description:
        "An overview of the latest regulatory changes affecting KYC processes in the financial industry.",
      updated: "2 days ago",
      category: "Best Practices",
    },
  ];

  const policies = [
    {
      title: "Customer Identification Program Policy",
      description:
        "Comprehensive guidelines for customer identification and verification processes.",
      updated: "15 Jan 2023",
      size: "2.1 MB",
    },
    {
      title: "Customer Identification Program Policy",
      description:
        "Comprehensive guidelines for customer identification and verification processes.",
      updated: "15 Jan 2023",
      size: "2.1 MB",
    },
  ];

  return (
    <div className="min-h-screen bg-background blurry-overlay">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">Knowledge Base</h1>
          <div className="text-sm text-muted-foreground">Help & Documentation</div>
        </div>
      </header>

      {/* Search Bar */}
      <div className="border-b border-border bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by name, ID, class"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-border bg-card text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Browse by Category */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-foreground mb-8">Browse by Category</h2>
          <div className="grid md:grid-cols-4 gap-6">
            {categories.map((cat, i) => {
              const IconComponent = cat.icon;
              return (
                <div
                  key={i}
                  className="group p-6 rounded-lg border border-border bg-card hover:border-primary/50 hover:shadow-sm transition-all cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <IconComponent className="h-5 w-5 text-primary" />
                    </div>
                    <span className="text-sm font-medium text-muted-foreground bg-muted rounded px-2 py-1">
                      {cat.count}
                    </span>
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">{cat.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{cat.description}</p>
                  <button className="w-full py-2 px-3 rounded-lg border border-border hover:bg-muted text-sm font-medium text-foreground transition-colors">
                    Explore
                  </button>
                </div>
              );
            })}
          </div>
        </section>

        {/* Featured Articles */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-foreground mb-8">Featured Articles</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {articles.map((article, i) => (
              <article
                key={i}
                className="group p-6 rounded-lg border border-border bg-card hover:border-primary/50 hover:shadow-sm transition-all"
              >
                <div className="mb-4">
                  <span className="inline-block px-2 py-1 text-xs font-medium rounded bg-primary/10 text-primary">
                    {article.category}
                  </span>
                </div>
                <h3 className="font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                  {article.title}
                </h3>
                <p className="text-sm text-muted-foreground mb-4">{article.description}</p>
                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <span className="text-xs text-muted-foreground">Updated {article.updated}</span>
                  <button className="px-3 py-1 rounded-full bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity">
                    Read
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Policy Library */}
        <section>
          <h2 className="text-2xl font-bold text-foreground mb-6">Policy Library</h2>

          {/* Tabs */}
          <div className="flex gap-4 border-b border-border mb-8 overflow-x-auto">
            {["All Policies", "Internal Policies", "Regulatory Policy", "Template"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-3 px-2 text-sm font-medium whitespace-nowrap transition-colors ${
                  activeTab === tab
                    ? "text-primary border-b-2 border-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Policy Cards */}
          <div className="grid md:grid-cols-2 gap-6">
            {policies.map((policy, i) => (
              <div
                key={i}
                className="p-6 rounded-lg border border-border bg-card hover:border-primary/50 transition-all"
              >
                <h3 className="font-semibold text-foreground mb-2">{policy.title}</h3>
                <p className="text-sm text-muted-foreground mb-4">{policy.description}</p>
                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <div className="flex flex-col gap-1">
                    <span className="text-xs text-muted-foreground">
                      Last updated: {policy.updated}
                    </span>
                    <span className="text-xs text-muted-foreground">PDF, {policy.size}</span>
                  </div>
                  <button className="px-4 py-2 rounded-lg border border-border text-foreground text-sm font-medium hover:bg-muted transition-colors flex items-center gap-2">
                    <Download className="h-4 w-4" />
                    Download
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
