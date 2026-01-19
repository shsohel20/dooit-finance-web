"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Upload, FileText, User } from "lucide-react";

const riskIndicators = [
  {
    id: 1,
    text: "Does the organization serve customers from high-risk jurisdictions?",
    category: "customer",
    responses: ["Yes", "No", "Partially"],
  },
  {
    id: 2,
    text: "What percentage of your customer base consists of PEPs or high-risk individuals?",
    category: "customer",
    responses: ["0-5%", "5-15%", "15-30%", "30%+"],
  },
  {
    id: 3,
    text: "Are products/services vulnerable to anonymity or identity concealment?",
    category: "product",
    responses: ["Low Risk", "Medium Risk", "High Risk", "Very High Risk"],
  },
];

export function InherentRiskAssessment() {
  const [selectedTab, setSelectedTab] = useState("customer");
  const [responses, setResponses] = useState({});

  return (
    <div className=" max-w-6xl">
      <Card className="mb-6 p-6">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-semibold mb-2">Inherent Risk Assessment</h2>
            <p className="text-sm text-muted-foreground">
              Complete the risk assessment across all categories
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Overall Progress</p>
              <p className="text-2xl font-bold">45%</p>
            </div>
            <div className="h-16 w-16">
              <svg className="rotate-[-90deg]" viewBox="0 0 36 36">
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeDasharray="45, 100"
                  className="text-primary"
                />
              </svg>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        {/* Sidebar Navigation */}
        <Card className="p-4 h-fit">
          <h3 className="font-semibold mb-4 px-2">Risk Categories</h3>
          <Tabs orientation="vertical" value={selectedTab} onValueChange={setSelectedTab}>
            <TabsList className="flex flex-col h-auto bg-transparent gap-1 w-full">
              <TabsTrigger
                value="customer"
                className="w-full justify-start data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <div className="flex items-center justify-between w-full">
                  <span>Customer Risk</span>
                  <Badge variant="secondary" className="ml-2">
                    60%
                  </Badge>
                </div>
              </TabsTrigger>
              <TabsTrigger
                value="product"
                className="w-full justify-start data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <div className="flex items-center justify-between w-full">
                  <span>Product/Service</span>
                  <Badge variant="secondary" className="ml-2">
                    40%
                  </Badge>
                </div>
              </TabsTrigger>
              <TabsTrigger
                value="channel"
                className="w-full justify-start data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <div className="flex items-center justify-between w-full">
                  <span>Delivery Channel</span>
                  <Badge variant="secondary" className="ml-2">
                    25%
                  </Badge>
                </div>
              </TabsTrigger>
              <TabsTrigger
                value="geography"
                className="w-full justify-start data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <div className="flex items-center justify-between w-full">
                  <span>Geographic</span>
                  <Badge variant="secondary" className="ml-2">
                    70%
                  </Badge>
                </div>
              </TabsTrigger>
              <TabsTrigger
                value="environment"
                className="w-full justify-start data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <div className="flex items-center justify-between w-full">
                  <span>Environmental</span>
                  <Badge variant="secondary" className="ml-2">
                    30%
                  </Badge>
                </div>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </Card>

        {/* Main Content */}
        <div className="space-y-6">
          {/* Category Header */}
          <Card className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-xl font-semibold mb-2">Customer Risk Factors</h3>
                <p className="text-sm text-muted-foreground">
                  Assessment of customer demographics and behaviors
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline">Weight: 25%</Badge>
                <Badge className="bg-warning text-warning-foreground">High</Badge>
              </div>
            </div>

            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Assignee:</span>
                <span className="font-medium">Sarah Chen</span>
              </div>
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Status:</span>
                <Badge variant="outline" className="bg-warning/10 text-warning">
                  In Progress
                </Badge>
              </div>
            </div>
          </Card>

          {/* Risk Indicators */}
          <div className="space-y-4">
            {riskIndicators
              .filter((indicator) => indicator.category === selectedTab)
              .map((indicator) => (
                <Card key={indicator.id} className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-medium">
                        {indicator.id}
                      </div>
                      <p className="flex-1 font-medium leading-relaxed">{indicator.text}</p>
                    </div>

                    <RadioGroup
                      value={responses[indicator.id]}
                      onValueChange={(value) =>
                        setResponses({ ...responses, [indicator.id]: value })
                      }
                    >
                      <div className="grid gap-3 sm:grid-cols-2">
                        {indicator.responses.map((response) => (
                          <div
                            key={response}
                            className="flex items-center space-x-2 rounded-lg border border-border p-3 hover:bg-accent/50 transition-colors"
                          >
                            <RadioGroupItem value={response} id={`${indicator.id}-${response}`} />
                            <Label
                              htmlFor={`${indicator.id}-${response}`}
                              className="flex-1 cursor-pointer"
                            >
                              {response}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </RadioGroup>

                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Evidence / Comments</Label>
                      <Textarea
                        placeholder="Add supporting evidence or comments..."
                        className="min-h-[80px]"
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                        <Upload className="h-4 w-4" />
                        Upload Evidence
                      </Button>
                      <span className="text-xs text-muted-foreground">0 files attached</span>
                    </div>
                  </div>
                </Card>
              ))}
          </div>

          {/* Action Buttons */}
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <Button variant="outline">Save Draft</Button>
              <div className="flex gap-3">
                <Button variant="outline">Previous Category</Button>
                <Button>Next Category</Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
