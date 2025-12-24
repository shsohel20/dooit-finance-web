'use client';
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import CustomDropZone from "@/components/ui/DropZone";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { riskLevelVariants } from "@/lib/utils";

export const TransactionReportingModal = ({ open, setOpen, currentItem, setCurrentItem }) => {
  const [file, setFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleFileChange = (file) => {
    setFile(file);
  }
  const onSubmit = async () => {
    setIsSubmitting(true);
    try {
      // const response = await submitReporting(file);
      //sleep for 1 second
      await new Promise(resolve => setTimeout(resolve, 1000));
      setOpen(false);
      toast.success('Reporting submitted successfully');
    } catch (error) {
      console.error(error);
      toast.error('Failed to submit reporting');
    } finally {
      setIsSubmitting(false);
      setCurrentItem(null);
    }
  }
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Reporting</DialogTitle>
          <DialogDescription>Risk Level: <Badge variant={riskLevelVariants[currentItem?.riskLabel ?? '']}>{currentItem?.riskLabel}</Badge></DialogDescription>
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
          <Button className={'w-full'} onClick={onSubmit} disabled={isSubmitting}>{isSubmitting ? 'Submitting...' : 'Submit'}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
export default TransactionReportingModal;