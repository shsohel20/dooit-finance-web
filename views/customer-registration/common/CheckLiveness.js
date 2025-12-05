"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Info } from "lucide-react";
import { useState } from "react";
import CustomDropZone from "@/components/ui/DropZone";
import FormTitle from "./FormTitle";
import { checkImageLiveness } from "@/app/customer/registration/actions";
import { toast } from "sonner";
import { Alert, AlertTitle } from "@/components/ui/alert";
import FaceCapture from "./FaceCapture";


const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

export default function CheckLiveness() {
  const [frontProfile, setFrontProfile] = useState(null); // base64 only
  const [rightProfile, setRightProfile] = useState(null); // base64 only
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const extractFile = (file) => {
    // ensures compatibility with DropZone/FileWithPath/Drag&Drop
    if (file instanceof File) return file;
    if (Array.isArray(file)) return file[0];
    if (file?.file instanceof File) return file.file;
    return null;
  };

  const handleFrontChange = async (src) => {
    console.log("Front change", src);
    // const realFile = extractFile(file);
    // if (!realFile) return;

    // const base64 = await getBase64(realFile);
    // setFrontProfile(base64);
    setFrontProfile(src);
  };

  const handleRightChange = async (src) => {
    console.log("Right change", src);
    setRightProfile(src);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await checkImageLiveness({
        img1_base64: frontProfile,
        img2_base64: rightProfile,
      });
console.log("res", res);
      if (res.error) {
        toast.error(res.error);
        setError(res.error);
      }
    } catch (err) {
      console.error("Submit error:", err);
    }
    setLoading(false);
  };

  const requirements = [
    "Sit in a bright area with a clean background.",
    "Hold your phone straight at eye level.",
    "Make sure your entire face is visible (remove hats, masks, or glasses).",
    "Keep your face centered inside the frame shown.",
    "When the first 3-second countdown begins, look directly at the camera and remain still.",
    "When the second 3-second countdown starts, slowly turn your head to the right and hold that position.",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 mt-4 pb-10">
      <div className="space-y-8">

        {/* Header */}
        <div className="space-y-2">
          <FormTitle>Profile Image Upload</FormTitle>
          <p className="text-muted-foreground">
            Upload clear, high-quality photos for identity verification
          </p>
        </div>

        {/* Requirements */}
        <Card className="border-2 border-primary/20 bg-card/50 backdrop-blur">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Info className="w-5 h-5 text-primary" />
              <CardTitle className="text-xl">Image Requirements</CardTitle>
            </div>
            <CardDescription>
              Ensure your images meet these criteria for verification
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 list-disc pl-5">
              {requirements.map((req, i) => (
                <li key={i} className="text-sm">{req}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
        <div>
          {error && <Alert variant="destructive">
            <AlertTitle>{error}</AlertTitle>
          </Alert>}
        </div>
        {/* Upload Section */}
        <div className="grid lg:grid-cols-2 gap-6">

          {/* Front */}
          <Card className="border-2 hover:border-primary/50 transition-colors">
            <CardHeader>
              <CardTitle className="text-lg">Front Profile (Required)</CardTitle>
              <CardDescription>Clear frontal face view</CardDescription>
            </CardHeader>
            <CardContent>
              {/* <CustomDropZone
                handleChange={handleFrontChange}
                url={frontProfile || ""}
              >
                <p className="font-medium">Drag & drop or click to upload</p>
              </CustomDropZone> */}
              <FaceCapture
                image={frontProfile}
                onCapture={handleFrontChange}
              />
            </CardContent>
          </Card>

          {/* Right */}
          <Card className="border-2 hover:border-primary/50 transition-colors">
            <CardHeader>
              <CardTitle className="text-lg">Right Profile (Required)</CardTitle>
              <CardDescription>90° turn to the right</CardDescription>
            </CardHeader>
            <CardContent>
                {/* <CustomDropZone
                  handleChange={handleRightChange}
                  url={rightProfile || ""}
                >
                  <p className="font-medium">Drag & drop or click to upload</p>
                </CustomDropZone> */}
                <FaceCapture
                  image={rightProfile}
                  onCapture={handleRightChange}
                />
            </CardContent>
          </Card>
        </div>

        {/* Submit Button */}
        <div className="flex justify-center pt-4">
          <Button
            onClick={handleSubmit}
            disabled={!frontProfile || !rightProfile || loading}
            className=""
          >
            {loading ? "Processing..." : "Submit for Verification"}
          </Button>
        </div>

      </div>
    </div>
  );
}
