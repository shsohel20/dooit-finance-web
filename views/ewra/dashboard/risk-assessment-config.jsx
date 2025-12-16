"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChevronLeft, ChevronRight, Check } from "lucide-react"

const steps = ["Assessment Setup", "Risk Rating Scale", "Risk Factors", "Controls Framework"]

const riskTypes = ["AML", "CTF", "Sanctions", "Fraud", "ABAC", "Custom"]
const riskFactors = [
  { id: "customer", name: "Customer Risk Factors", weight: 25 },
  { id: "product", name: "Product/Service Risk", weight: 20 },
  { id: "channel", name: "Delivery Channel Risk", weight: 15 },
  { id: "geography", name: "Geographic Risk", weight: 25 },
  { id: "environment", name: "Environmental Risk", weight: 15 },
]

export function RiskAssessmentConfig() {
  const [currentStep, setCurrentStep] = useState(0)
  const [selectedFactors, setSelectedFactors] = useState(["customer", "product", "geography"])

  const toggleFactor = (id) => {
    setSelectedFactors((prev) => (prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]))
  }

  return (
    <div className="mx-auto max-w-4xl">
      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={index} className="flex flex-1 items-center">
              <div className="flex flex-col items-center">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition-colors ${
                    index < currentStep
                      ? "border-primary bg-primary text-primary-foreground"
                      : index === currentStep
                        ? "border-primary bg-background text-primary"
                        : "border-border bg-background text-muted-foreground"
                  }`}
                >
                  {index < currentStep ? <Check className="h-5 w-5" /> : index + 1}
                </div>
                <span className="mt-2 text-xs font-medium">{step}</span>
              </div>
              {index < steps.length - 1 && (
                <div className={`h-0.5 flex-1 ${index < currentStep ? "bg-primary" : "bg-border"}`} />
              )}
            </div>
          ))}
        </div>
      </div>

      <Card className="p-8">
        {/* Step 1: Assessment Setup */}
        {currentStep === 0 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-semibold mb-2">Assessment Setup</h2>
              <p className="text-sm text-muted-foreground">Configure the basic parameters for your risk assessment</p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Assessment Name</Label>
                <Input id="name" placeholder="Q1 2025 Enterprise Risk Assessment" />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="type">Risk Type</Label>
                  <Select defaultValue="AML">
                    <SelectTrigger id="type">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {riskTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="version">Version</Label>
                  <Input id="version" placeholder="2025.1" />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="start">Period Start</Label>
                  <Input id="start" type="date" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="end">Period End</Label>
                  <Input id="end" type="date" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Risk Rating Scale */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-semibold mb-2">Risk Rating Scale</h2>
              <p className="text-sm text-muted-foreground">
                Define the rating scale and thresholds for your assessment
              </p>
            </div>

            <div className="space-y-4">
              <div className="rounded-lg border border-border p-4">
                <h3 className="font-medium mb-4">Rating Matrix (5×5)</h3>
                <div className="grid grid-cols-5 gap-2">
                  {["Low", "Medium", "High", "Extreme", "Critical"].map((level, i) => (
                    <div
                      key={level}
                      className={`flex h-16 items-center justify-center rounded-md text-sm font-medium ${
                        i === 0
                          ? "bg-chart-2/80 text-card"
                          : i === 1
                            ? "bg-chart-2 text-card"
                            : i === 2
                              ? "bg-chart-3 text-card"
                              : i === 3
                                ? "bg-chart-4 text-card"
                                : "bg-destructive text-destructive-foreground"
                      }`}
                    >
                      {level}
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Risk Appetite Threshold</Label>
                <Select defaultValue="medium">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low (0-1.5)</SelectItem>
                    <SelectItem value="medium">Medium (1.6-2.5)</SelectItem>
                    <SelectItem value="high">High (2.6-3.5)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Risk Factors */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-semibold mb-2">Risk Factors</h2>
              <p className="text-sm text-muted-foreground">Select the risk factors to include in your assessment</p>
            </div>

            <div className="space-y-3">
              {riskFactors.map((factor) => (
                <div key={factor.id} className="flex items-center justify-between rounded-lg border border-border p-4">
                  <div className="flex items-center gap-3">
                    <Checkbox
                      checked={selectedFactors.includes(factor.id)}
                      onCheckedChange={() => toggleFactor(factor.id)}
                    />
                    <div>
                      <p className="font-medium">{factor.name}</p>
                      <p className="text-sm text-muted-foreground">Default weight: {factor.weight}%</p>
                    </div>
                  </div>
                  <Input
                    type="number"
                    className="w-20"
                    defaultValue={factor.weight}
                    disabled={!selectedFactors.includes(factor.id)}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 4: Controls Framework */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-semibold mb-2">Controls Framework</h2>
              <p className="text-sm text-muted-foreground">Choose a controls template or create a custom framework</p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {["ISO 31000", "FATF Recommendations", "COSO ERM", "Custom"].map((template) => (
                <Card key={template} className="cursor-pointer p-6 hover:border-primary transition-colors">
                  <h3 className="font-semibold mb-2">{template}</h3>
                  <p className="text-sm text-muted-foreground">
                    {template === "Custom" ? "Build your own controls framework" : "Industry standard framework"}
                  </p>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="mt-8 flex justify-between border-t border-border pt-6">
          <Button
            variant="outline"
            onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
            disabled={currentStep === 0}
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            Previous
          </Button>
          <Button
            onClick={() => {
              if (currentStep < steps.length - 1) {
                setCurrentStep(currentStep + 1)
              }
            }}
          >
            {currentStep === steps.length - 1 ? (
              <>
                <Check className="mr-2 h-4 w-4" />
                Complete Setup
              </>
            ) : (
              <>
                Next
                <ChevronRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      </Card>
    </div>
  )
}
