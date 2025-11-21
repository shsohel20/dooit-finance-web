"use client";

import { useEffect, useState } from "react";
import { Plus, MapPin, Phone, Mail, Clock, UsersIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { BranchDialog } from "../form";
import { getBranches } from "@/app/dashboard/client/branch/actions";

const MOCK_BRANCHES = [
  {
    id: "BR001",
    name: "Main Corporate Branch",
    branchCode: "BR001",
    branchType: "Corporate",
    email: "main.branch@company.com",
    phone: "+8801711223333",
    website: "https://company.com/main",
    address: {
      street: "House 10, Road 20, Banani",
      city: "Dhaka",
      state: "Dhaka Division",
      country: "Bangladesh",
      zipcode: "1213",
    },
    contacts: [
      {
        name: "Ahmed Khan",
        title: "Branch Manager",
        email: "ahmed.khan@company.com",
        phone: "+8801711998888",
        primary: true,
      },
    ],
    manager: {
      name: "Ahmed Khan",
      email: "ahmed.khan@company.com",
      phone: "+8801711998888",
      employeeId: "EMP-BR001",
    },
    services: ["Corporate Banking", "Loans", "Investment", "Account Opening"],
    hasATM: true,
    workingHours: {
      monday: { open: "09:00", close: "17:00", closed: false },
      tuesday: { open: "09:00", close: "17:00", closed: false },
      wednesday: { open: "09:00", close: "17:00", closed: false },
      thursday: { open: "09:00", close: "17:00", closed: false },
      friday: { open: "09:00", close: "13:00", closed: false },
      saturday: { closed: true },
      sunday: { closed: true },
    },
    status: "Active",
  },
  {
    id: "BR002",
    name: "Gulshan Corporate Branch",
    branchCode: "BR002",
    branchType: "Corporate",
    email: "gulshan.branch@company.com",
    phone: "+8801711223344",
    website: "https://company.com/gulshan",
    address: {
      street: "House 24, Road 35, Gulshan-2",
      city: "Dhaka",
      state: "Dhaka Division",
      country: "Bangladesh",
      zipcode: "1212",
    },
    contacts: [
      {
        name: "Rafiul Hasan",
        title: "Branch Manager",
        email: "rafiul.hasan@company.com",
        phone: "+8801711998877",
        primary: true,
      },
    ],
    manager: {
      name: "Rafiul Hasan",
      email: "rafiul.hasan@company.com",
      phone: "+8801711998877",
      employeeId: "EMP-BR002",
    },
    services: ["Corporate Banking", "Loans", "Account Opening"],
    hasATM: true,
    workingHours: {
      monday: { open: "09:00", close: "17:00", closed: false },
      tuesday: { open: "09:00", close: "17:00", closed: false },
      wednesday: { open: "09:00", close: "17:00", closed: false },
      thursday: { open: "09:00", close: "17:00", closed: false },
      friday: { open: "09:00", close: "13:00", closed: false },
      saturday: { closed: true },
      sunday: { closed: true },
    },
    status: "Active",
  },
];

export default function BranchList() {
  const [branches, setBranches] = useState( MOCK_BRANCHES );
  const [searchTerm, setSearchTerm] = useState( "" );
  const [isDialogOpen, setIsDialogOpen] = useState( false );

  const filteredBranches = branches

  const handleAddBranch = ( newBranch ) => {
    setBranches( [
      ...branches,
      { ...newBranch, id: `BR${branches.length + 1}` },
    ] );
  };

  useEffect( () => {
    const fetchBranches = async () => {
      const res = await getBranches();
      // setBranches(branches);
      if ( res.success ) {
        setBranches( res.data );
      }
    };
    fetchBranches();
  }, [] );
  const activeCount = branches?.filter( ( b ) => b.status === "Active" ).length;
  const totalStaff = branches?.reduce( ( acc, b ) => acc + b.contacts.length, 0 );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-end">
        {/* <div>
          <h1 className="text-3xl font-bold">Branch & User Management</h1>
          <p className="text-muted-foreground mt-1">
            Manage all branch locations and user access
          </p>
        </div> */}
        <Button onClick={() => setIsDialogOpen( true )} className="gap-2">
          <Plus className="h-4 w-4" />
          Add New Branch
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Total Branches
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{branches.length}</div>
            <p className="text-xs text-muted-foreground">Active locations</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Active Branches
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">{activeCount}</div>
            <p className="text-xs text-muted-foreground">
              Currently operational
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Staff</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStaff}</div>
            <p className="text-xs text-muted-foreground">Branch managers</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Cities Covered
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Set( branches.map( ( b ) => b.city ) ).size}
            </div>
            <p className="text-xs text-muted-foreground">Across regions</p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="flex gap-2">
        <Input
          placeholder="Search by branch name, code, or city..."
          value={searchTerm}
          onChange={( e ) => setSearchTerm( e.target.value )}
          className="flex-1"
        />
      </div>

      {/* Branches List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredBranches.map( ( branch ) => (
          <Card
            key={branch.id}
            className="overflow-hidden hover:shadow-lg transition-shadow"
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg">{branch.name}</CardTitle>
                  <CardDescription>{branch.branchCode}</CardDescription>
                </div>
                <Badge
                  variant={branch.status === "Active" ? "default" : "secondary"}
                >
                  {branch.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {/* Address */}
              <div className="flex gap-2 text-sm">
                <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                <div>
                  <p>{branch.address.street}</p>
                  <p className="text-muted-foreground">
                    {branch.address.city}, {branch.address.state}{" "}
                    {branch.address.zipcode}
                  </p>
                </div>
              </div>

              {/* Contact Info */}
              <div className="space-y-1 text-sm">
                <div className="flex gap-2 items-center">
                  <Phone className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <a href={`tel:${branch.phone}`} className="hover:underline">
                    {branch.phone}
                  </a>
                </div>
                <div className="flex gap-2 items-center">
                  <Mail className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <a
                    href={`mailto:${branch.email}`}
                    className="hover:underline"
                  >
                    {branch.email}
                  </a>
                </div>
              </div>

              {/* Manager */}
              <div className="flex gap-2 text-sm   rounded">
                <UsersIcon className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">{branch.manager.name}</p>
                  <p className="text-muted-foreground text-xs">
                    {branch.manager.employeeId}
                  </p>
                </div>
              </div>

              {/* Services & Hours */}
              <div className="flex gap-2 text-sm">
                <Clock className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="font-medium">Operating Hours</p>
                  <p className="text-muted-foreground text-xs">
                    {branch?.workingHours?.monday?.closed
                      ? "Closed"
                      : `${branch?.workingHours?.monday?.open} - ${branch?.workingHours?.monday?.close}`}
                  </p>
                </div>
              </div>

              {/* Services */}
              <div className="flex flex-wrap gap-1">
                {branch.services.slice( 0, 2 ).map( ( service ) => (
                  <Badge key={service} variant="outline" className="text-xs">
                    {service}
                  </Badge>
                ) )}
                {branch.services.length > 2 && (
                  <Badge variant="outline" className="text-xs">
                    +{branch.services.length - 2}
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        ) )}
      </div>

      {/* Add Branch Dialog */}
      <BranchDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSubmit={handleAddBranch}
      />
    </div>
  );
}
