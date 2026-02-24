'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { CalendarIcon, Plus, AlertTriangle, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from '@/components/ui/sheet';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Separator } from '@/components/ui/separator';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

import { currentUser } from './dummyData';
import { cn } from '@/lib/utils';

function FieldLabel({ children, required, tooltip }) {
  return (
    <div className="flex items-center gap-1.5">
      <Label className="text-sm font-medium">
        {children}
        {required && <span className="text-destructive ml-0.5">*</span>}
      </Label>
      {tooltip && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Info className="size-3.5 text-muted-foreground/60 cursor-help" />
            </TooltipTrigger>
            <TooltipContent side="top" className="max-w-xs">
              <p className="text-xs">{tooltip}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </div>
  );
}

export function ExceptionForm({ open, onOpenChange, onSubmit }) {
  const [relatedPolicy, setRelatedPolicy] = useState('');
  const [description, setDescription] = useState('');
  const [riskLevel, setRiskLevel] = useState('');
  const [businessJustification, setBusinessJustification] = useState('');
  const [compensatingControls, setCompensatingControls] = useState('');
  const [approvalStatus, setApprovalStatus] = useState('Pending');
  const [approvedBy, setApprovedBy] = useState('');
  const [expiryDate, setExpiryDate] = useState();
  const [reviewReminder, setReviewReminder] = useState();
  const [errors, setErrors] = useState({});

  function validate() {
    const newErrors = {};
    if (!relatedPolicy.trim())
      newErrors.relatedPolicy = 'Policy/Control is required';
    if (!description.trim()) newErrors.description = 'Description is required';
    if (!riskLevel) newErrors.riskLevel = 'Risk level is required';
    if (!businessJustification.trim())
      newErrors.businessJustification = 'Business justification is required';
    if (!compensatingControls.trim())
      newErrors.compensatingControls = 'Compensating controls are required';
    if (!expiryDate) newErrors.expiryDate = 'Expiry date is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleSubmit() {
    if (!validate()) return;

    const now = new Date();
    const year = now.getFullYear();
    const seq = String(Math.floor(Math.random() * 900) + 100);

    const newException = {
      id: `EXC-${year}-${seq}`,
      relatedPolicy,
      description,
      riskLevel: riskLevel,
      businessJustification,
      compensatingControls,
      approvalStatus,
      approvedBy: approvedBy || null,
      approvalDate:
        approvalStatus === 'Approved' ? format(now, 'yyyy-MM-dd') : null,
      expiryDate: format(expiryDate, 'yyyy-MM-dd'),
      status: 'Active',
      createdAt: format(now, 'yyyy-MM-dd'),
      reviewReminder: reviewReminder
        ? format(reviewReminder, 'yyyy-MM-dd')
        : null,
      requestedBy: currentUser.name,
    };

    onSubmit(newException);
    resetForm();
    onOpenChange(false);
  }

  function resetForm() {
    setRelatedPolicy('');
    setDescription('');
    setRiskLevel('');
    setBusinessJustification('');
    setCompensatingControls('');
    setApprovalStatus('Pending');
    setApprovedBy('');
    setExpiryDate(undefined);
    setReviewReminder(undefined);
    setErrors({});
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-lg overflow-y-auto">
        <SheetHeader className="pb-2">
          <SheetTitle className="text-lg">Create New Exception</SheetTitle>
          <SheetDescription>
            Submit a new policy exception request. All required fields must be
            completed for review.
          </SheetDescription>
        </SheetHeader>

        <div className="flex flex-col gap-5 px-4 pb-4">
          {/* Section: Exception Details */}
          <div className="flex items-center gap-2">
            <div className="size-6 rounded bg-primary/10 flex items-center justify-center">
              <span className="text-xs font-semibold text-primary">1</span>
            </div>
            <span className="text-sm font-semibold text-foreground">
              Exception Details
            </span>
          </div>

          <div className="flex flex-col gap-1.5">
            <FieldLabel required>Related Policy / Control</FieldLabel>
            <Input
              placeholder="e.g., AC-2 Account Management"
              value={relatedPolicy}
              onChange={(e) => setRelatedPolicy(e.target.value)}
              className={cn(errors.relatedPolicy && 'border-destructive')}
            />
            {errors.relatedPolicy && (
              <p className="text-xs text-destructive">{errors.relatedPolicy}</p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <FieldLabel required>Description</FieldLabel>
            <Textarea
              placeholder="Describe the exception being requested..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className={cn(errors.description && 'border-destructive')}
            />
            {errors.description && (
              <p className="text-xs text-destructive">{errors.description}</p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <FieldLabel required>Risk Level</FieldLabel>
            <Select
              value={riskLevel}
              onValueChange={(val) => setRiskLevel(val)}
            >
              <SelectTrigger
                className={cn(errors.riskLevel && 'border-destructive')}
              >
                <SelectValue placeholder="Select risk level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Low">
                  <span className="flex items-center gap-2">
                    <span className="size-2 rounded-full bg-emerald-500" />
                    Low
                  </span>
                </SelectItem>
                <SelectItem value="Medium">
                  <span className="flex items-center gap-2">
                    <span className="size-2 rounded-full bg-amber-500" />
                    Medium
                  </span>
                </SelectItem>
                <SelectItem value="High">
                  <span className="flex items-center gap-2">
                    <span className="size-2 rounded-full bg-red-500" />
                    High
                  </span>
                </SelectItem>
              </SelectContent>
            </Select>
            {errors.riskLevel && (
              <p className="text-xs text-destructive">{errors.riskLevel}</p>
            )}
          </div>

          {riskLevel === 'High' && (
            <div className="flex items-start gap-2 rounded-md border border-amber-200 bg-amber-50 p-3">
              <AlertTriangle className="size-4 text-amber-600 mt-0.5 shrink-0" />
              <div>
                <p className="text-xs font-medium text-amber-800">
                  High Risk Exception
                </p>
                <p className="text-xs text-amber-700 mt-0.5">
                  High risk exceptions require additional review by the CISO and
                  may take longer to process.
                </p>
              </div>
            </div>
          )}

          <Separator />

          {/* Section: Justification */}
          <div className="flex items-center gap-2">
            <div className="size-6 rounded bg-primary/10 flex items-center justify-center">
              <span className="text-xs font-semibold text-primary">2</span>
            </div>
            <span className="text-sm font-semibold text-foreground">
              Justification & Controls
            </span>
          </div>

          <div className="flex flex-col gap-1.5">
            <FieldLabel
              required
              tooltip="Explain why this exception is necessary for business operations."
            >
              Business Justification
            </FieldLabel>
            <Textarea
              placeholder="Explain the business need for this exception..."
              value={businessJustification}
              onChange={(e) => setBusinessJustification(e.target.value)}
              rows={3}
              className={cn(
                errors.businessJustification && 'border-destructive'
              )}
            />
            {errors.businessJustification && (
              <p className="text-xs text-destructive">
                {errors.businessJustification}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <FieldLabel
              required
              tooltip="Describe alternative controls that mitigate the risk of this exception."
            >
              Compensating Controls
            </FieldLabel>
            <Textarea
              placeholder="Describe compensating controls in place..."
              value={compensatingControls}
              onChange={(e) => setCompensatingControls(e.target.value)}
              rows={3}
              className={cn(
                errors.compensatingControls && 'border-destructive'
              )}
            />
            {errors.compensatingControls && (
              <p className="text-xs text-destructive">
                {errors.compensatingControls}
              </p>
            )}
          </div>

          <Separator />

          {/* Section: Approval & Timeline */}
          <div className="flex items-center gap-2">
            <div className="size-6 rounded bg-primary/10 flex items-center justify-center">
              <span className="text-xs font-semibold text-primary">3</span>
            </div>
            <span className="text-sm font-semibold text-foreground">
              Approval & Timeline
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <FieldLabel>Approval Status</FieldLabel>
              <Select
                value={approvalStatus}
                onValueChange={(val) => setApprovalStatus(val)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Under Review">Under Review</SelectItem>
                  <SelectItem value="Approved">Approved</SelectItem>
                  <SelectItem value="Rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-1.5">
              <FieldLabel>Approved By</FieldLabel>
              <Input
                placeholder="Approver name"
                value={approvedBy}
                onChange={(e) => setApprovedBy(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <FieldLabel required>Expiry Date</FieldLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      'w-full justify-start text-left font-normal',
                      !expiryDate && 'text-muted-foreground',
                      errors.expiryDate && 'border-destructive'
                    )}
                  >
                    <CalendarIcon className="size-4" />
                    {expiryDate
                      ? format(expiryDate, 'MMM dd, yyyy')
                      : 'Select date'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={expiryDate}
                    onSelect={setExpiryDate}
                    disabled={(date) => date < new Date()}
                  />
                </PopoverContent>
              </Popover>
              {errors.expiryDate && (
                <p className="text-xs text-destructive">{errors.expiryDate}</p>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <FieldLabel tooltip="Set a reminder date for when this exception should be reviewed before expiry.">
                Review Reminder
              </FieldLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      'w-full justify-start text-left font-normal',
                      !reviewReminder && 'text-muted-foreground'
                    )}
                  >
                    <CalendarIcon className="size-4" />
                    {reviewReminder
                      ? format(reviewReminder, 'MMM dd, yyyy')
                      : 'Set reminder'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={reviewReminder}
                    onSelect={setReviewReminder}
                    disabled={(date) => date < new Date()}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>

        <SheetFooter className="border-t">
          <Button
            variant="outline"
            onClick={() => {
              resetForm();
              onOpenChange(false);
            }}
          >
            Cancel
          </Button>
          <Button onClick={handleSubmit}>
            <Plus className="size-4" />
            Create Exception
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
