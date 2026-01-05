"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Search,
  Upload,
  User,
  Building2,
  Ship,
  Plane,
  AlertTriangle,
  CheckCircle2,
  Info,
} from "lucide-react";
import { MatchCard } from "@/components/match-card";

const mockResults = [
  {
    id: "1",
    name: "PETROV, Vladimir Alexandrovich",
    matchScore: 94,
    riskTier: "critical",
    listType: "OFAC SDN",
    matchedFields: ["Name", "DOB", "Nationality"],
    dob: "1965-03-15",
    nationality: "Russian Federation",
    designation: "Specially Designated National",
    aliases: ["Vladimir A. Petrov", "V. Petrov"],
  },
  {
    id: "2",
    name: "PETROVA, Vladimir",
    matchScore: 72,
    riskTier: "high",
    listType: "EU Consolidated",
    matchedFields: ["Name"],
    dob: "1978-11-22",
    nationality: "Belarus",
    designation: "Sanctioned Person",
    aliases: [],
  },
  {
    id: "3",
    name: "PETROV, Victor",
    matchScore: 45,
    riskTier: "medium",
    listType: "PEP Database",
    matchedFields: ["Name"],
    dob: "1980-06-10",
    nationality: "Ukraine",
    designation: "Politically Exposed Person - Former Government Official",
    aliases: ["Viktor Petrov"],
  },
];

export function SearchScreen() {
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [entityType, setEntityType] = useState("individual");
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = () => {
    setIsSearching(true);
    setTimeout(() => {
      setIsSearching(false);
      setSearchPerformed(true);
    }, 800);
  };

  return (
    <div className="space-y-6">
      {/* Search Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Entity Screening
          </CardTitle>
          <CardDescription>
            Screen individuals or organizations against global sanctions lists, PEP databases, and
            adverse media
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Entity Type Selection */}
          <div className="flex gap-2">
            {[
              { value: "individual", label: "Individual", icon: User },
              { value: "organization", label: "Organization", icon: Building2 },
              { value: "vessel", label: "Vessel", icon: Ship },
              { value: "aircraft", label: "Aircraft", icon: Plane },
            ].map((type) => (
              <Button
                key={type.value}
                variant={entityType === type.value ? "default" : "outline"}
                size="sm"
                onClick={() => setEntityType(type.value)}
                className="flex items-center gap-2"
              >
                <type.icon className="h-4 w-4" />
                {type.label}
              </Button>
            ))}
          </div>

          {/* Search Fields */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name / Entity Name</Label>
              <Input id="name" placeholder="e.g., Vladimir Petrov" defaultValue="Vladimir Petrov" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dob">Date of Birth</Label>
              <Input id="dob" type="date" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="nationality">Nationality / Country</Label>
              <Select>
                <SelectTrigger id="nationality">
                  <SelectValue placeholder="Select country" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ru">Russian Federation</SelectItem>
                  <SelectItem value="cn">China</SelectItem>
                  <SelectItem value="ir">Iran</SelectItem>
                  <SelectItem value="kp">North Korea</SelectItem>
                  <SelectItem value="by">Belarus</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="idNumber">ID / Passport Number</Label>
              <Input id="idNumber" placeholder="e.g., AB1234567" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="alias">Known Aliases</Label>
              <Input id="alias" placeholder="e.g., V. Petrov" />
            </div>
            <div className="space-y-2">
              <Label>Match Threshold</Label>
              <Select defaultValue="70">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="90">Strict (90%+)</SelectItem>
                  <SelectItem value="70">Standard (70%+)</SelectItem>
                  <SelectItem value="50">Broad (50%+)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* List Selection */}
          <div className="space-y-3">
            <Label>Screening Lists</Label>
            <div className="flex flex-wrap gap-4">
              {[
                { id: "ofac", label: "OFAC (US)" },
                { id: "un", label: "UN Security Council" },
                { id: "eu", label: "EU Consolidated" },
                { id: "uk", label: "UK HMT" },
                { id: "pep", label: "PEP Database" },
                { id: "adverse", label: "Adverse Media" },
              ].map((list) => (
                <div key={list.id} className="flex items-center gap-2">
                  <Checkbox id={list.id} defaultChecked />
                  <Label htmlFor={list.id} className="text-sm font-normal cursor-pointer">
                    {list.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 pt-2">
            <Button onClick={handleSearch} disabled={isSearching} className="min-w-[140px]">
              {isSearching ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent mr-2" />
                  Screening...
                </>
              ) : (
                <>
                  <Search className="mr-2 h-4 w-4" />
                  Screen Entity
                </>
              )}
            </Button>
            <Button variant="outline">
              <Upload className="mr-2 h-4 w-4" />
              Bulk Upload
            </Button>
            <Button variant="ghost" size="sm" className="ml-auto text-muted-foreground">
              Clear Form
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      {searchPerformed && (
        <div className="space-y-4">
          {/* Results Summary */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h2 className="text-lg font-semibold">Screening Results</h2>
              <Badge variant="secondary" className="font-mono">
                3 matches found
              </Badge>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Info className="h-4 w-4" />
              Screened against 6 lists in 0.847s
            </div>
          </div>

          {/* Risk Summary Cards */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card className="border-red-200 bg-red-50">
              <CardContent className="pt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-red-600">Critical</p>
                    <p className="text-2xl font-bold text-red-700">1</p>
                  </div>
                  <AlertTriangle className="h-8 w-8 text-red-400" />
                </div>
              </CardContent>
            </Card>
            <Card className="border-orange-200 bg-orange-50">
              <CardContent className="pt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-orange-600">High</p>
                    <p className="text-2xl font-bold text-orange-700">1</p>
                  </div>
                  <AlertTriangle className="h-8 w-8 text-orange-400" />
                </div>
              </CardContent>
            </Card>
            <Card className="border-amber-200 bg-amber-50">
              <CardContent className="pt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-amber-600">Medium</p>
                    <p className="text-2xl font-bold text-amber-700">1</p>
                  </div>
                  <Info className="h-8 w-8 text-amber-400" />
                </div>
              </CardContent>
            </Card>
            <Card className="border-emerald-200 bg-emerald-50">
              <CardContent className="pt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-emerald-600">Low</p>
                    <p className="text-2xl font-bold text-emerald-700">0</p>
                  </div>
                  <CheckCircle2 className="h-8 w-8 text-emerald-400" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Match Cards */}
          <div className="space-y-4">
            {mockResults.map((result) => (
              <MatchCard key={result.id} match={result} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
