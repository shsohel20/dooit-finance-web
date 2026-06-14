"use client";

import React, { useState } from "react";

import { Search, MoreVertical, Loader2 } from "lucide-react";

import { Input } from "@/components/ui/input";

import { Button } from "@/components/ui/button";

import { Badge } from "@/components/ui/badge";

import { Label } from "@/components/ui/label";

import { Checkbox } from "@/components/ui/checkbox";

import {

  Dialog,

  DialogClose,

  DialogContent,

  DialogDescription,

  DialogFooter,

  DialogHeader,

  DialogTitle,

} from "@/components/ui/dialog";

import {

  Select,

  SelectContent,

  SelectItem,

  SelectTrigger,

  SelectValue,

} from "@/components/ui/select";

import {

  DropdownMenu,

  DropdownMenuContent,

  DropdownMenuItem,

  DropdownMenuTrigger,

} from "@/components/ui/dropdown-menu";

import { Controller, useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import { z } from "zod";

import { toast } from "sonner";



const INITIAL_STAFF_DATA = [

  {

    id: 1,

    name: "Jack Guthrie",

    roles: ["Compliance officer"],

    training: "NOT STARTED",

    onboarded: "IN PROGRESS",

    hasViewed: true,

  },

  {

    id: 2,

    name: "Steve Short",

    roles: ["Client facing", "Governing body"],

    training: "NOT STARTED",

    onboarded: "IN PROGRESS",

    hasViewed: false,

  },

  {

    id: 3,

    name: "Penelope Peterson",

    roles: ["Client facing"],

    training: "NOT STARTED",

    onboarded: "IN PROGRESS",

    hasViewed: false,

  },

  {

    id: 4,

    name: "David Marshall",

    roles: ["Client facing"],

    training: "NOT STARTED",

    onboarded: "IN PROGRESS",

    hasViewed: false,

  },

  {

    id: 5,

    name: "Michael Manager",

    roles: ["Client facing", "Senior manager"],

    training: "NOT STARTED",

    onboarded: "IN PROGRESS",

    hasViewed: false,

  },

  {

    id: 6,

    name: "Oliver Ownerson",

    roles: [],

    training: "NOT STARTED",

    onboarded: "IN PROGRESS",

    hasViewed: false,

  },

];



const FILTER_OPTIONS = ["All", "In Progress", "Completed", "Not Started"];



const DUE_DILIGENCE_TYPES = [

  { value: "personnel", label: "Personnel" },

  { value: "compliance", label: "Compliance Officer" },

  { value: "compliance-officer-and-governing-body", label: "Compliance Officer & Governing Body" },

];



const onboardingFormSchema = z.object({

  email: z.string().email("Invalid email address"),

  phone: z.string().min(1, "Phone is required"),

  startDate: z.string().min(1, "Start date is required"),

  position: z.string().min(1, "Position is required"),

  dueDiligenceType: z.string().min(1, "Due diligence type is required"),

  assignTraining: z.boolean(),

  runBackgroundCheck: z.boolean(),

  notes: z.string().optional(),

});



const StaffOnboardingForm = ({ open, setOpen, staff, onComplete }) => {

  const [loading, setLoading] = useState(false);



  const {

    control,

    handleSubmit,

    formState: { errors },

    reset,

  } = useForm({

    resolver: zodResolver(onboardingFormSchema),

    defaultValues: {

      email: "",

      phone: "",

      startDate: "",

      position: "",

      dueDiligenceType: "",

      assignTraining: true,

      runBackgroundCheck: true,

      notes: "",

    },

  });



  const handleOpenChange = (nextOpen) => {

    setOpen(nextOpen);

    if (!nextOpen) reset();

  };



  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 600));
      toast.success(`${staff?.name} onboarding started successfully`);
      onComplete(staff?.id, data);
      setOpen(false);
      reset();
    } catch {
      toast.error("Failed to start staff onboarding");
    } finally {
      setLoading(false);
    }
  };



  if (!staff) return null;



  return (

    <Dialog open={open} onOpenChange={handleOpenChange}>

      <DialogContent className="sm:max-w-[480px] max-h-[90vh] overflow-y-auto">

        <DialogHeader>

          <DialogTitle>Staff Onboarding</DialogTitle>

          <DialogDescription>

            Complete onboarding details for {staff.name}

          </DialogDescription>

        </DialogHeader>



        {staff.roles.length > 0 && (

          <div className="flex flex-wrap gap-1">

            {staff.roles.map((role) => (

              <Badge key={role} variant="outline" className="text-[0.65rem] px-2 py-0.5 font-normal">

                {role}

              </Badge>

            ))}

          </div>

        )}



        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">

          <Controller

            control={control}

            name="email"

            render={({ field }) => (

              <div className="grid gap-2">

                <Label htmlFor="staff-onboard-email">Work email</Label>

                <Input

                  id="staff-onboard-email"

                  type="email"

                  placeholder="name@company.com"

                  error={errors.email?.message}

                  {...field}

                />

              </div>

            )}

          />



          <Controller

            control={control}

            name="phone"

            render={({ field }) => (

              <div className="grid gap-2">

                <Label htmlFor="staff-onboard-phone">Phone</Label>

                <Input

                  id="staff-onboard-phone"

                  placeholder="Enter phone number"

                  error={errors.phone?.message}

                  {...field}

                />

              </div>

            )}

          />



          <div className="grid grid-cols-2 gap-3">

            <Controller

              control={control}

              name="startDate"

              render={({ field }) => (

                <div className="grid gap-2">

                  <Label htmlFor="staff-onboard-start-date">Start date</Label>

                  <Input

                    id="staff-onboard-start-date"

                    type="date"

                    error={errors.startDate?.message}

                    {...field}

                  />

                </div>

              )}

            />



            <Controller

              control={control}

              name="position"

              render={({ field }) => (

                <div className="grid gap-2">

                  <Label htmlFor="staff-onboard-position">Position</Label>

                  <Input

                    id="staff-onboard-position"

                    placeholder="Job title"

                    error={errors.position?.message}

                    {...field}

                  />

                </div>

              )}

            />

          </div>



          <Controller

            control={control}

            name="dueDiligenceType"

            render={({ field }) => (

              <div className="grid gap-2">

                <Label>Due diligence type</Label>

                <Select value={field.value} onValueChange={field.onChange}>

                  <SelectTrigger className="text-xs h-9">

                    <SelectValue placeholder="Select type" />

                  </SelectTrigger>

                  <SelectContent>

                    {DUE_DILIGENCE_TYPES.map((type) => (

                      <SelectItem key={type.value} value={type.value}>

                        {type.label}

                      </SelectItem>

                    ))}

                  </SelectContent>

                </Select>

                {errors.dueDiligenceType && (

                  <p className="text-red-500 text-xs">{errors.dueDiligenceType.message}</p>

                )}

              </div>

            )}

          />



          <Controller

            control={control}

            name="assignTraining"

            render={({ field }) => (

              <div className="flex items-center gap-2">

                <Checkbox

                  id="staff-onboard-training"

                  checked={field.value}

                  onCheckedChange={field.onChange}

                />

                <Label htmlFor="staff-onboard-training" className="font-normal cursor-pointer">

                  Assign mandatory training modules

                </Label>

              </div>

            )}

          />



          <Controller

            control={control}

            name="runBackgroundCheck"

            render={({ field }) => (

              <div className="flex items-center gap-2">

                <Checkbox

                  id="staff-onboard-background"

                  checked={field.value}

                  onCheckedChange={field.onChange}

                />

                <Label htmlFor="staff-onboard-background" className="font-normal cursor-pointer">

                  Initiate personnel due diligence check

                </Label>

              </div>

            )}

          />



          <Controller

            control={control}

            name="notes"

            render={({ field }) => (

              <div className="grid gap-2">

                <Label htmlFor="staff-onboard-notes">Notes</Label>

                <Input

                  id="staff-onboard-notes"

                  type="textarea"

                  rows={3}

                  placeholder="Additional onboarding notes (optional)"

                  {...field}

                />

              </div>

            )}

          />



          <DialogFooter>

            <DialogClose asChild>

              <Button type="button" variant="outline">

                Cancel

              </Button>

            </DialogClose>

            <Button type="submit" disabled={loading}>

              {loading ? (

                <span className="flex items-center gap-2">

                  <Loader2 className="w-4 h-4 animate-spin" />

                  Starting...

                </span>

              ) : (

                "Start Onboarding"

              )}

            </Button>

          </DialogFooter>

        </form>

      </DialogContent>

    </Dialog>

  );

};



const StaffOnboardingTab = () => {

  const [search, setSearch] = useState("");

  const [filter, setFilter] = useState("All");

  const [staffData, setStaffData] = useState(INITIAL_STAFF_DATA);

  const [modalOpen, setModalOpen] = useState(false);

  const [selectedStaff, setSelectedStaff] = useState(null);



  const filtered = staffData.filter((s) => {

    const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase());

    const matchesFilter =

      filter === "All" ||

      (filter === "In Progress" && s.onboarded === "IN PROGRESS") ||

      (filter === "Completed" && s.onboarded === "COMPLETED") ||

      (filter === "Not Started" && s.onboarded === "NOT STARTED");

    return matchesSearch && matchesFilter;

  });



  const handleOnboardClick = (staff) => {

    setSelectedStaff(staff);

    setModalOpen(true);

  };



  const handleOnboardingComplete = (staffId) => {

    setStaffData((prev) =>

      prev.map((s) =>

        s.id === staffId ? { ...s, hasViewed: true, onboarded: "IN PROGRESS" } : s

      )

    );

  };



  return (

    <div className="p-4">

      <h2 className="text-base font-semibold mb-4">Staff Onboarding</h2>



      <div className="flex items-center justify-between mb-4">

        <div className="relative w-56">

          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />

          <Input

            placeholder="Search staff"

            className="pl-8 h-8 text-xs"

            value={search}

            onChange={(e) => setSearch(e.target.value)}

          />

        </div>



        <div className="flex items-center gap-2">

          <DropdownMenu>

            <DropdownMenuTrigger asChild>

              <Button variant="outline" size="sm" className="text-xs h-8">

                Filter by ▾

              </Button>

            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">

              {FILTER_OPTIONS.map((opt) => (

                <DropdownMenuItem key={opt} onClick={() => setFilter(opt)}>

                  {opt}

                </DropdownMenuItem>

              ))}

            </DropdownMenuContent>

          </DropdownMenu>



          <Button variant="ghost" size="icon" className="h-8 w-8">

            <MoreVertical className="h-4 w-4" />

          </Button>

        </div>

      </div>



      <div className="border rounded-md overflow-hidden">

        <table className="w-full text-xs">

          <thead>

            <tr className="bg-gray-50 border-b">

              <th className="text-left font-medium text-gray-500 px-4 py-2.5 w-1/4">Staff</th>

              <th className="text-left font-medium text-gray-500 px-4 py-2.5 w-1/3">Role</th>

              <th className="text-left font-medium text-gray-500 px-4 py-2.5 w-1/5">Training</th>

              <th className="text-left font-medium text-gray-500 px-4 py-2.5 w-1/5">Onboarded</th>

              <th className="px-4 py-2.5 w-24" />

            </tr>

          </thead>

          <tbody>

            {filtered.map((staff, idx) => (

              <tr

                key={staff.id}

                className={`border-b last:border-0 ${idx % 2 === 0 ? "bg-white" : "bg-white"}`}

              >

                <td className="px-4 py-3">

                  <span className="text-primary font-medium cursor-pointer hover:underline">

                    {staff.name}

                  </span>

                </td>

                <td className="px-4 py-3">

                  <div className="flex flex-wrap gap-1">

                    {staff.roles.map((role) => (

                      <Badge key={role} variant="outline" className="text-[0.65rem] px-2 py-0.5 font-normal">

                        {role}

                      </Badge>

                    ))}

                  </div>

                </td>

                <td className="px-4 py-3">

                  <span className="font-semibold text-gray-700 text-[0.65rem] tracking-wide">

                    {staff.training}

                  </span>

                </td>

                <td className="px-4 py-3">

                  <span className="font-semibold text-orange-500 text-[0.65rem] tracking-wide">

                    {staff.onboarded}

                  </span>

                </td>

                <td className="px-4 py-3 text-right">

                  {staff.hasViewed ? (

                    <Button variant="ghost" size="sm" className="text-xs h-7 px-3 text-gray-500 border border-gray-200">

                      View

                    </Button>

                  ) : (

                    <Button

                      variant="outline"

                      size="sm"

                      className="text-xs h-7 px-3 text-primary border-primary hover:bg-primary/5"

                      onClick={() => handleOnboardClick(staff)}

                    >

                      Onboard

                    </Button>

                  )}

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>



      <StaffOnboardingForm

        open={modalOpen}

        setOpen={setModalOpen}

        staff={selectedStaff}

        onComplete={handleOnboardingComplete}

      />

    </div>

  );

};



export default StaffOnboardingTab;

