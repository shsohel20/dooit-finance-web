"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import CustomDropZone from "@/components/ui/DropZone";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { riskLevelVariants } from "@/lib/utils";
import { toast } from "sonner";
import { createInstantReport } from "@/app/dashboard/client/onboarding/customer-queue/actions";
import { ArrowRight } from "lucide-react";

export const TransactionReportingModal = ({ open, setOpen, currentItem, setCurrentItem }) => {
  const [file, setFile] = useState(null);
  const [formData, setFormData] = useState({
    insights: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleFileChange = (file) => {
    setFile(file);
  };
  const onSubmit = async () => {
    setIsSubmitting(true);
    try {
      const payload = {
        notifyFor: "Transaction",
        notes: formData?.insights,
        resourceType: "Transaction",
        resourceId: currentItem?.id,
        isActive: true,
        metadata: {
          priority: "high",
          origin: "automated-rule"
        },
        documents: [
          // {
          //   name: file?.name,
          //   url: fileUrl,
          //   mimeType: file?.type,
          //   type: "invoice",
          //   docType: "billing"
          // }
        ]
      }
      const response = await createInstantReport(payload);
      if (response.succeed) {
        setOpen(false);
        toast.success('Reporting submitted successfully');
      } else {
        toast.error('Failed to submit report');
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to submit reporting");
    } finally {
      setIsSubmitting(false);
      setCurrentItem(null);
    }
  };
  console.log('currentItem', currentItem);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className='md:max-w-2xl'>
        <DialogHeader>
          <DialogTitle>Reporting</DialogTitle>
          <div className="flex gap-2 items-center bg-smoke-200 border p-4 rounded-md">
            <div>
              <h4 className=" font-semibold capitalize">{currentItem?.sender?.name}</h4>
              <p className=" text-md">{currentItem?.sender?.account}</p>
            </div>
            <div>
              <ArrowRight className="size-4 text-green-500" />
            </div>
            <div>
              <h4 className=" font-semibold capitalize">{currentItem?.receiver?.name}</h4>
              <p className=" ">{currentItem?.receiver?.account}</p>
            </div>
          </div>
        </DialogHeader>
        <div className="flex flex-col gap-2">
          <Label className={"font-bold"}>Share your insights</Label>
          <Textarea className='min-h-40' placeholder="Share your insights" onChange={(e) => setFormData({ ...formData, insights: e.target.value })} />
        </div>
        <div>
          <CustomDropZone
            className=""
            handleChange={handleFileChange}
            file={file}
            setFile={setFile}
            fileTypes={['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx']}
          />
        </div>
        <DialogFooter>
          <Button className={"w-full"} onClick={onSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
export default TransactionReportingModal;
