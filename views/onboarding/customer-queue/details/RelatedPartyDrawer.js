import React from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { PartyTreeView } from "./TreeNode";
export const RelatedPartyDrawer = ({ open, setOpen }) => {
  const handleToggle = () => {
    setOpen(false);
  };
  return (
    <Sheet open={open} onOpenChange={handleToggle}>
      <SheetContent className="w-full sm:max-w-xl overflow-y-auto ">
        <SheetHeader>
          <SheetTitle>Related Parties</SheetTitle>
          <SheetDescription>View the related parties for this customer</SheetDescription>
        </SheetHeader>
        <PartyTreeView />
      </SheetContent>
    </Sheet>
  );
};
