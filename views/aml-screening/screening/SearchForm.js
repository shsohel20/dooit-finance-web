import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import CustomSelect from '@/components/ui/CustomSelect'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { cardTypes, getCardTypesByCountryId } from '@/lib/card-type'
import { countries } from '@/lib/country'
import { cn } from '@/lib/utils'
import { SelectContent } from '@radix-ui/react-select'
import { ChevronDown, Globe, Hash, Link2, Search, Settings2, Sparkles } from 'lucide-react'
import React, { useState } from 'react'

export default function SearchForm({ formData, setFormData, type }) {
  const [identificationOpen, setIdentificationOpen] = useState(false)
  const [linkToCaseOpen, setLinkToCaseOpen] = useState(false);
  const isIndividual = type === "individual";
  const isOrganization = type === "organisation";
  const isVessel = type === "vessel";
  const nameBasedOnType = {
    individual: "Full Name",
    organisation: "Entity Name",
    vessel: "Vessel Name",
  }
  return (
    <div className="">
      <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
        {/* Name section */}
        <div className="p-6 space-y-4">
          <div className="space-y-1.5">
            <Label >
              {nameBasedOnType[type]}
              <span className="text-destructive ml-1">*</span>
            </Label>
            <Input
              placeholder="Enter full name"
              className=" bg-background"
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-1.5">
              <Label >Case ID</Label>
              <Input placeholder="Optional" className=" bg-background" />
            </div>
            <div className="space-y-1.5">
              <Label >Group</Label>
              <Input placeholder="Optional" className=" bg-background" />
            </div>
          </div>
          {isIndividual && <div className="space-y-4">
            <div className="space-y-1.5">
              <Label className="">Date of Birth</Label>
              <Input type="date" placeholder="Optional" className=" bg-background" />
            </div>
            <div className="space-y-1.5">
              {/* <Label className="text-sm font-medium">Nationality</Label> */}
              <CustomSelect
                label="Nationality"
                options={countries}
                value={formData.nationality}
                onChange={(value) => setFormData({ ...formData, nationality: value })}
              />
            </div>
            <div className="space-y-1.5">
              <CustomSelect
                label="Gender"
                options={[{ label: "Male", value: "male" }, { label: "Female", value: "female" }]}
                value={formData.gender}
                onChange={(value) => setFormData({ ...formData, gender: value })}
              />
            </div>
          </div>}

          <div className="space-y-1.5">
            {/* <Label className="text-sm font-medium">
              Country of Residence
            </Label>
            <Select>
              <SelectTrigger className=" bg-background">
                <SelectValue placeholder="Select country" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="us">United States</SelectItem>
                <SelectItem value="uk">United Kingdom</SelectItem>
                <SelectItem value="de">Germany</SelectItem>
                <SelectItem value="fr">France</SelectItem>
                <SelectItem value="jp">Japan</SelectItem>
                <SelectItem value="au">Australia</SelectItem>
                <SelectItem value="ca">Canada</SelectItem>
                <SelectItem value="sg">Singapore</SelectItem>
              </SelectContent>
            </Select> */}
            {isOrganization && <CustomSelect
              label="Registered country/jurisdiction"
              options={countries}
              value={formData.countryOfResidence}
              onChange={(value) => setFormData({ ...formData, countryOfResidence: value })}
            />}
            {isVessel && <>
              <div className="space-y-1.5">
                <Label className="">IMO Number</Label>
                <Input placeholder="Optional" className=" bg-background" />
              </div>
              {/* <div className="space-y-1.5">
              <Label className="">Flag State</Label>
              <Input placeholder="Optional" className=" bg-background" />
            </div> */}
            </>}
          </div>
        </div>

        <div className="border-t border-border">
          <Collapsible open={identificationOpen} onOpenChange={setIdentificationOpen}>
            <CollapsibleTrigger className="flex w-full items-center justify-between p-4 px-6 hover:bg-muted/50 transition-colors">
              <div className="flex items-center gap-3">
                <Hash className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium">Identification Number</span>
              </div>
              <ChevronDown
                className={cn(
                  "w-4 h-4 text-muted-foreground transition-transform",
                  identificationOpen && "rotate-180",
                )}
              />
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="px-6 pb-4 pt-0">
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-1.5">
                    <Label className="text-sm font-medium">ID Number</Label>
                    <Input placeholder="Enter ID" className="h-10 bg-background" />
                  </div>
                  <div className="space-y-1.5">
                    {/* <Label className="text-sm font-medium">Issuer Country</Label>
                    <Select>
                      <SelectTrigger className="h-10 bg-background">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="us">United States</SelectItem>
                        <SelectItem value="uk">United Kingdom</SelectItem>
                        <SelectItem value="de">Germany</SelectItem>
                      </SelectContent>
                    </Select> */}
                    <CustomSelect
                      label="Issuer Country/Jurisdiction"
                      options={countries}
                      value={formData.issuerCountry}
                      onChange={(value) => setFormData({ ...formData, issuerCountry: value })}
                    />
                  </div>
                  <div className="space-y-1.5">

                    <CustomSelect
                      label="ID Type"
                      options={getCardTypesByCountryId(formData.issuerCountry?.id) || []}
                      isDisabled={!formData.issuerCountry}
                      value={formData.idType}
                      onChange={(value) => setFormData({ ...formData, idType: value })}
                    />
                  </div>
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>

        <div className="border-t border-border">
          <Collapsible open={linkToCaseOpen} onOpenChange={setLinkToCaseOpen}>
            <CollapsibleTrigger className="flex w-full items-center justify-between p-4 px-6 hover:bg-muted/50 transition-colors">
              <div className="flex items-center gap-3">
                <Link2 className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium">Link to Existing Case</span>
              </div>
              <ChevronDown
                className={cn("w-4 h-4 text-muted-foreground transition-transform", linkToCaseOpen && "rotate-180")}
              />
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="px-6 pb-4 pt-0">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input placeholder="Search by Case ID or Name" className="h-10 pl-10 bg-background" />
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>
      </div>


    </div>
  )
}
