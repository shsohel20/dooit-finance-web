'use client'
import { useSearchParams } from 'next/navigation';
import React, { useState } from 'react'
import { forms } from '../page';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { HelpCircle } from 'lucide-react';

function FormDetailPage() {
    const id = useSearchParams().get('id');
    console.log('id', id);
    const [showAdvanced, setShowAdvanced] = useState(false);
    const router = useRouter();
    const form = forms.find((form) => form.id == id);
    console.log('form', form);

    const onBack = () => {
        router.push('/dashboard/client/grc/forms-hub');
    }
    return (
      <> 
      <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-foreground">{form.title}</h2>
            <p className="text-sm text-muted-foreground">Governance Regulatory Form</p>
          </div>
          <Button variant="ghost" size="icon">
            <HelpCircle className="h-4 w-4" />
          </Button>
        </div>
      {form.component ? form.component : <div>
        <div className="flex flex-col gap-6">
        
  
        <Card className="border-border bg-card">
          <CardContent className="p-6">
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Section 1: General Information
            </h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="flex flex-col gap-1.5">
                <Label className="text-sm text-muted-foreground">Reporting Entity Name</Label>
                <Input placeholder="Enter entity name" />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label className="text-sm text-muted-foreground">ABN/ACN</Label>
                <Input placeholder="Enter ABN or ACN" />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label className="text-sm text-muted-foreground">Reporting Period Start</Label>
                <Input type="date" />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label className="text-sm text-muted-foreground">Reporting Period End</Label>
                <Input type="date" />
              </div>
            </div>
          </CardContent>
        </Card>
  
        <Card className="border-border bg-card">
          <CardContent className="p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                Enhanced Fields
              </h3>
              <div className="flex items-center gap-2">
                <Label className="text-sm text-muted-foreground">Show Advanced Fields</Label>
                <Switch checked={showAdvanced} onCheckedChange={setShowAdvanced} />
              </div>
            </div>
  
            {showAdvanced && (
              <div className="flex flex-col gap-6">
                <div>
                  <h4 className="mb-3 text-sm font-medium text-foreground">
                    Enterprise Control Mapping
                  </h4>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="flex flex-col gap-1.5">
                      <Label className="text-sm text-muted-foreground">Control ID</Label>
                      <div className="flex gap-2">
                        <Input placeholder="Auto-generated" readOnly className="flex-1" />
                        <Button variant="outline" size="sm">
                          Generate
                        </Button>
                      </div>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <Label className="text-sm text-muted-foreground">Regulatory Obligation</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select section" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="s36">Section 36 - CDD</SelectItem>
                          <SelectItem value="s41">Section 41 - SMR</SelectItem>
                          <SelectItem value="s81">Section 81 - Compliance</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="mb-3 text-sm font-medium text-foreground">Testing Impact</h4>
                  <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1.5">
                      <Label className="text-sm text-muted-foreground">Interim Controls</Label>
                      <Textarea placeholder="Describe any interim control measures..." rows={3} />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
        {/* <SMReffectiveness /> */}
  
        <div className="flex justify-end gap-3">
          <Button variant="outline">Save as Draft</Button>
          <Button>Submit for Approval</Button>
        </div>
      </div>
        </div>}</>
    );
  }

export default FormDetailPage