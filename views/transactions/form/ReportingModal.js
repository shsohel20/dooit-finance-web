'use client';
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import CustomDropZone from "@/components/ui/DropZone";
import { useState } from "react";

export const TransactionReportingModal = ({ open, setOpen }) => {
  const [file, setFile] = useState(null);
  const handleFileChange = (file) => {
    setFile(file);
  }
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Reporting</DialogTitle>
          <DialogDescription>Risk Level: Medium</DialogDescription>
        </DialogHeader>
        <div className='flex flex-col gap-2'>
          <Label className={'font-bold'}>Share your insights</Label>
          <Textarea placeholder='Share your insights' />
        </div>
        <div>
          <CustomDropZone
            className=''
            handleChange={handleFileChange}
            file={file}
            setFile={setFile}
          />
        </div>
        <DialogFooter>
          <Button className={'w-full'}>Submit</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
export default TransactionReportingModal;