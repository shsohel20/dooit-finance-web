"use client";

import { useState } from "react";
import {
  Building2,
  User,
  Globe,
  Search,
  Settings2,
  Sparkles,
  Ship,
} from "lucide-react";
import { Button } from "@/components/ui/button";

import { Switch } from "@/components/ui/switch";

import { cn } from "@/lib/utils";
import CustomSelect from "@/components/ui/CustomSelect";
import SearchForm from "./SearchForm";
import { CaseManager } from "@/views/pep-screening/case-manager";
import { MonitorCheck } from "lucide-react";

export default function AMLSearchScreeningForm() {
  const [entityType, setEntityType] = useState("organisation");

  const [activeTab, setActiveTab] = useState("screening");

  const [formData, setFormData] = useState({
    name: "",
    caseId: "",
    group: "",
    countryOfResidence: "",
    issuerCountry: "",
    idType: "",
    mode: "single",
    checkTypes: { dooit: true },
    ongoingScreening: false,
  });
  const tabs = [
    {
      name: "Screening",
      icon: <Search className="w-4 h-4" />,
      id: "screening",
    },
    {
      name: "Case Manager",
      icon: <MonitorCheck className="w-4 h-4" />,
      id: "case-manager",
    },
  ];
  return (
    <div className="min-h-screen   ">
      <div className="  gap-4 ">
        {/* tab */}
        <div className=" p-2 rounded-md bg-smoke-200     flex mb-4">
          {/* <h2 className="text-sm text-muted-foreground mb-3  tracking-wider">Settings</h2> */}
          {tabs.map((tab) => (
            <button
              key={tab.name}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ",
                {
                  "bg-white text-primary font-bold ": activeTab === tab.id,
                },
              )}
            >
              {tab.icon}
              {tab.name}
            </button>
          ))}
        </div>
        {/* searchable inputs */}
        <div className="">
          <div className=" w-full   space-y-6 ">
            {activeTab === "screening" && (
              <div className="flex gap-4">
                <div className="max-w-3xl w-full  space-y-4">
                  <div className="flex ">
                    <div className="inline-flex p-1 rounded-md bg-muted/80 border border-border w-full">
                      <button
                        onClick={() => setEntityType("organisation")}
                        className={cn(
                          "flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all",
                          entityType === "organisation"
                            ? "bg-white text-foreground shadow-sm"
                            : "text-muted-foreground hover:text-foreground",
                        )}
                      >
                        <Building2 className="w-4 h-4" />
                        Organisation
                      </button>
                      <button
                        onClick={() => setEntityType("individual")}
                        className={cn(
                          "flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all",
                          entityType === "individual"
                            ? "bg-white text-foreground shadow-sm"
                            : "text-muted-foreground hover:text-foreground",
                        )}
                      >
                        <User className="w-4 h-4" />
                        Individual
                      </button>
                      <button
                        onClick={() => setEntityType("vessel")}
                        className={cn(
                          "flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all",
                          entityType === "vessel"
                            ? "bg-white text-foreground shadow-sm"
                            : "text-muted-foreground hover:text-foreground",
                        )}
                      >
                        <Ship className="w-4 h-4" />
                        Vessel
                      </button>
                    </div>
                  </div>

                  <div className="space-y-4 col-span-2">
                    <SearchForm formData={formData} setFormData={setFormData} type={entityType} />
                  </div>

                  <div className="flex items-center gap-3 max-w-2xl">
                    <Button className="flex-1  " onClick={() => setActiveTab("case-manager")}>
                      <Search className="w-4 h-4 mr-2" />
                      Run Screening
                    </Button>
                    <Button variant="outline" className=" bg-transparent">
                      Save
                    </Button>
                    <Button variant="ghost" className=" text-muted-foreground">
                      Clear
                    </Button>
                  </div>
                </div>
                <div>
                  <ScreeningSettings formData={formData} setFormData={setFormData} />
                </div>
              </div>
            )}
            {activeTab === "case-manager" && (
              <div className="w-full border rounded-md p-4 shadow overflow-hidden">
                <CaseManager formData={formData} />
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}

const ScreeningSettings = ({ formData, setFormData }) => {
  return (
    <div className="rounded-2xl border border-border bg-smoke-200  p-6 space-y-5">
      <div className="flex items-center gap-2">
        <Settings2 className="w-4 h-4 text-muted-foreground" />
        <h2 className="text-sm font-semibold">Screening Settings</h2>
      </div>

      <div className="space-y-1.5">
        <CustomSelect
          label="Mode"
          options={[
            { label: "Single", value: "single" },
            { label: "Batch", value: "batch" },
          ]}
          value={formData.mode}
          onChange={(value) => setFormData({ ...formData, mode: value })}
        />
      </div>

      <div className="grid md:grid-cols-2 grid-cols-1 gap-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between rounded-xl border border-border bg-background p-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-emerald-500/10">
                <Globe className="w-4 h-4 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm font-medium">Dooit Screening</p>
                <p className="text-xs text-muted-foreground">Global sanctions & PEP checks</p>
              </div>
            </div>
            <Switch
              checked={formData?.checkTypes?.dooit}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, checkTypes: { ...formData.checkTypes, dooit: checked } })
              }
            />
          </div>
        </div>

        <div className="flex items-center justify-between rounded-xl border border-border bg-background p-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-blue-500/10">
              <Sparkles className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium">Ongoing Screening</p>
              <p className="text-xs text-muted-foreground">Continuous monitoring</p>
            </div>
          </div>
          <Switch
            checked={formData?.ongoingScreening}
            onCheckedChange={(checked) => setFormData({ ...formData, ongoingScreening: checked })}
          />
        </div>
      </div>
    </div>
  );
};
