import React, { useEffect, useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { FormField } from "@/components/ui/FormField";
import { createPart } from "../../actions";
import { toast } from "sonner";

const initialState = {
  title: "",
  description: "",
  order: 1,
  video: {
    url: "",
    provider: "self-hosted",
    durationSec: 0,
  },
  minWatchPercent: 0,
  passAllRequired: false,
  maxRetries: 0,
  estimatedTimeMin: 0,
};
const getVideoProvider = (url) => {
  if (url.includes("youtube.com")) {
    return "youtube";
  } else if (url.includes("vimeo.com")) {
    return "vimeo";
  } else if (url.includes("tiktok.com")) {
    return "tiktok";
  } else if (url.includes("instagram.com")) {
    return "instagram";
  } else if (url.includes("facebook.com")) {
    return "facebook";
  } else if (url.includes("twitter.com")) {
    return "twitter";
  } else if (url.includes("linkedin.com")) {
    return "linkedin";
  } else {
    return "self-hosted";
  }
};
export default function PartModal({ openDialog, setOpenDialog, moduleId, fetchParts }) {
  const form = useForm({
    defaultValues: initialState,
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleAddPart = async (data) => {
    if (!data.video.url) {
      toast.error("Video URL is required");
      return;
    }
    const payload = {
      ...data,
      video: {
        url: data.video.url,
        provider: getVideoProvider(data.video.url),
        durationSec: 0,
      },
    };
    console.log("payload", JSON.stringify(payload, null, 2));

    setIsLoading(true);
    const res = await createPart(payload, moduleId);
    if (res.success) {
      toast.success("Part created successfully");
      setOpenDialog(false);
      fetchParts();
    } else {
      toast.error("Failed to create part");
    }
    setIsLoading(false);
  };

  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <DialogTrigger asChild>
        <Button size="sm" className="gap-2">
          <Plus className="w-4 h-4" />
          Add Part
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Part</DialogTitle>
          <DialogDescription>Create a new part with a video URL</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <FormField
              form={form}
              name="title"
              label="Part Title"
              type="text"
              placeholder="e.g., Introduction to KYC"
            />
          </div>
          <div>
            <FormField
              form={form}
              name="description"
              label="Description"
              type="text"
              placeholder="e.g., Overview of KYC principles and regulations"
            />
          </div>
          <div className="space-y-2">
            <FormField
              form={form}
              name="video.url"
              label="Video URL"
              type="text"
              placeholder="e.g., https://example.com/video.mp4"
            />
          </div>
          <div>
            <FormField
              form={form}
              name="minWatchPercent"
              label="Min Watch Percent"
              type="number"
              placeholder="e.g., 80"
            />
          </div>
          <div>
            <FormField
              form={form}
              name="passAllRequired"
              label="Pass All Required"
              type="checkbox"
            />
          </div>
          <div>
            <FormField
              form={form}
              name="maxRetries"
              label="Max Retries"
              type="number"
              placeholder="e.g., 2"
            />
          </div>
          <div>
            <FormField
              form={form}
              name="estimatedTimeMin"
              label="Estimated Time Min"
              type="number"
              placeholder="e.g., 10"
            />
          </div>

          <Button disabled={isLoading} onClick={form.handleSubmit(handleAddPart)} type="submit">
            {isLoading ? "Adding..." : "Add Part"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
