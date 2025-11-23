"use client";

import React from "react";
import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Search, Upload, Download, AlertCircle } from "lucide-react";

import { RiskItemsTable } from "./risk-items-table";
import {
  calculateInherentRisk,
  calculateResidualRisk,
  getRiskScore,
  calculateAggregateScore,
} from "@/lib/risk-calculations";
import { Alert, AlertDescription } from "@/components/ui/alert";

const RISK_CATEGORIES = [
  "Types of Customers",
  "Customer Risk Factors",
  "Product Risk - All Designated Services",
  "Product Risk - Stablecoin Services",
  "Product Risk - Digital Currency Exchange",
  "Product Risk - Remittance Service",
  "Product Risk - Debit Card Issuance",
  "Product Risk - Custody Service",
  "Channel Risk",
  "Jurisdictional Risk",
  "Other Business Risks",
];

export function InstitutionalRiskRegistry() {
  const [riskData, setRiskData] = useState({
    riskItems: [],
    lastUpdated: new Date().toISOString(),
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    if (riskData.riskItems.length > 0) {
      const inherentScores = riskData.riskItems.map(
        (item) => item.inherentRisk.score
      );
      const residualScores = riskData.riskItems.map(
        (item) => item.residualRisk.score
      );

      setRiskData((prev) => ({
        ...prev,
        aggregateScores: {
          inherentRiskScore: calculateAggregateScore(inherentScores),
          residualRiskScore: calculateAggregateScore(residualScores),
        },
      }));
    }
  }, [riskData.riskItems]);

  const handleUploadCSV = async () => {
    try {
      const response = await fetch(
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/CTG%20Risk%20Assessment%2016042025%20%28final%29-xAZHQRqqTUWYvQlmPdZiuWVF0PN3X6.csv"
      );
      const csvText = await response.text();
      console.log("[v0] CSV data loaded successfully");
      // TODO: Implement CSV parsing logic
    } catch (error) {
      console.error("[v0] Error loading CSV:", error);
    }
  };

  const handleExportJSON = () => {
    const dataStr = JSON.stringify(riskData, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `risk-registry-${
      new Date().toISOString().split("T")[0]
    }.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const filteredRisks = riskData.riskItems.filter((risk) => {
    const matchesSearch =
      risk.riskIndicator.toLowerCase().includes(searchTerm.toLowerCase()) ||
      risk.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      filterCategory === "all" || risk.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {riskData.aggregateScores && (
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">
                Aggregate Inherent Risk Score
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {riskData.aggregateScores.inherentRiskScore}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Average score across {riskData.riskItems.length} risk items
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">
                Aggregate Residual Risk Score
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {riskData.aggregateScores.residualRiskScore}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                After controls applied
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>ML/TF Risk Assessment Registry</CardTitle>
              <CardDescription>
                Manage and assess organizational ML/TF risk indicators based on
                AUSTRAC framework
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleUploadCSV}>
                <Upload className="h-4 w-4 mr-2" />
                Import CSV
              </Button>
              <Button variant="outline" size="sm" onClick={handleExportJSON}>
                <Download className="h-4 w-4 mr-2" />
                Export JSON
              </Button>
              <Button size="sm" onClick={() => setShowAddForm(!showAddForm)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Risk Item
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-xs">
              Risk assessment follows a 4-step methodology: (1) Assess inherent
              risk using likelihood and impact, (2) Evaluate control
              effectiveness, (3) Calculate residual risk, (4) Assign risk scores
              (1-5) and aggregate.
            </AlertDescription>
          </Alert>

          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search risk indicators..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-[280px]">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {RISK_CATEGORIES.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {showAddForm && (
            <Card className="border-primary">
              <CardHeader>
                <CardTitle className="text-lg">Add New Risk Item</CardTitle>
              </CardHeader>
              <CardContent>
                <AddRiskForm
                  categories={RISK_CATEGORIES}
                  onAdd={(newRisk) => {
                    setRiskData({
                      ...riskData,
                      riskItems: [...riskData.riskItems, newRisk],
                      lastUpdated: new Date().toISOString(),
                    });
                    setShowAddForm(false);
                  }}
                  onCancel={() => setShowAddForm(false)}
                />
              </CardContent>
            </Card>
          )}

          <RiskItemsTable
            risks={filteredRisks}
            onEdit={(updatedRisk) => {
              setRiskData({
                ...riskData,
                riskItems: riskData.riskItems.map((item) =>
                  item.id === updatedRisk.id ? updatedRisk : item
                ),
                lastUpdated: new Date().toISOString(),
              });
            }}
            onDelete={(riskId) => {
              setRiskData({
                ...riskData,
                riskItems: riskData.riskItems.filter(
                  (item) => item.id !== riskId
                ),
                lastUpdated: new Date().toISOString(),
              });
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}

function AddRiskForm({ categories, onAdd, onCancel }) {
  const [formData, setFormData] = useState({
    category: categories[0],
    riskIndicator: "",
    inherentRisk: {
      likelihood: "Possible",
      impact: "Moderate",
      rating: "High",
      nraRating: "",
      score: 3,
    },
    residualRisk: {
      controls: "",
      controlOwner: "",
      controlAssessment: "Adequate",
      rating: "High",
      score: 3,
    },
  });

  const updateInherentRisk = (likelihood, impact) => {
    const rating = calculateInherentRisk(likelihood, impact);
    const score = getRiskScore(rating);
    setFormData((prev) => ({
      ...prev,
      inherentRisk: {
        ...prev.inherentRisk,
        likelihood,
        impact,
        rating,
        score,
      },
    }));
  };

  const updateResidualRisk = (controlAssessment) => {
    const rating = calculateResidualRisk(
      formData.inherentRisk.rating,
      controlAssessment
    );
    const score = getRiskScore(rating);
    setFormData((prev) => ({
      ...prev,
      residualRisk: {
        ...prev.residualRisk,
        controlAssessment,
        rating,
        score,
      },
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd({
      ...formData,
      id: Date.now().toString(),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label>Category</Label>
          <Select
            value={formData.category}
            onValueChange={(value) =>
              setFormData({ ...formData, category: value })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Risk Indicator</Label>
          <Input
            value={formData.riskIndicator}
            onChange={(e) =>
              setFormData({ ...formData, riskIndicator: e.target.value })
            }
            placeholder="Enter risk indicator"
            required
          />
        </div>
      </div>

      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-sm">Inherent Risk Assessment</h4>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Likelihood</Label>
            <Select
              value={formData.inherentRisk?.likelihood}
              onValueChange={(value) =>
                updateInherentRisk(value, formData.inherentRisk.impact)
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Rare">Rare</SelectItem>
                <SelectItem value="Unlikely">Unlikely</SelectItem>
                <SelectItem value="Possible">Possible</SelectItem>
                <SelectItem value="Likely">Likely</SelectItem>
                <SelectItem value="Almost Certain">Almost Certain</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Impact</Label>
            <Select
              value={formData.inherentRisk?.impact}
              onValueChange={(value) =>
                updateInherentRisk(formData.inherentRisk.likelihood, value)
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Insignificant">Insignificant</SelectItem>
                <SelectItem value="Minor">Minor</SelectItem>
                <SelectItem value="Moderate">Moderate</SelectItem>
                <SelectItem value="Major">Major</SelectItem>
                <SelectItem value="Catastrophic">Catastrophic</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="bg-muted p-3 rounded text-sm">
          <span className="font-medium">Inherent Risk Rating: </span>
          <span className="font-bold">{formData.inherentRisk?.rating}</span>
          <span className="text-muted-foreground ml-2">
            (Score: {formData.inherentRisk?.score})
          </span>
        </div>

        <div className="space-y-2">
          <Label>NRA Rating (Optional)</Label>
          <Input
            value={formData.inherentRisk?.nraRating}
            onChange={(e) =>
              setFormData({
                ...formData,
                inherentRisk: {
                  ...formData.inherentRisk,
                  nraRating: e.target.value,
                },
              })
            }
            placeholder="e.g., High, Medium, Low"
          />
        </div>
      </div>

      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-sm">Residual Risk Assessment</h4>

        <div className="space-y-2">
          <Label>Control Measures</Label>
          <Textarea
            value={formData.residualRisk?.controls}
            onChange={(e) =>
              setFormData({
                ...formData,
                residualRisk: {
                  ...formData.residualRisk,
                  controls: e.target.value,
                },
              })
            }
            placeholder="Describe control measures..."
            rows={3}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Control Owner</Label>
            <Input
              value={formData.residualRisk?.controlOwner}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  residualRisk: {
                    ...formData.residualRisk,
                    controlOwner: e.target.value,
                  },
                })
              }
              placeholder="Enter control owner"
            />
          </div>

          <div className="space-y-2">
            <Label>Control Assessment</Label>
            <Select
              value={formData.residualRisk?.controlAssessment}
              onValueChange={(value) => updateResidualRisk(value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Excellent">Excellent</SelectItem>
                <SelectItem value="Good">Good</SelectItem>
                <SelectItem value="Adequate">Adequate</SelectItem>
                <SelectItem value="Poor">Poor</SelectItem>
                <SelectItem value="Deficient">Deficient</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="bg-muted p-3 rounded text-sm">
          <span className="font-medium">Residual Risk Rating: </span>
          <span className="font-bold">{formData.residualRisk?.rating}</span>
          <span className="text-muted-foreground ml-2">
            (Score: {formData.residualRisk?.score})
          </span>
        </div>
      </div>

      <div className="flex gap-2 justify-end">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">Add Risk Item</Button>
      </div>
    </form>
  );
}
