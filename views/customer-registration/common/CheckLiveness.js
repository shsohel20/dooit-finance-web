"use client"


import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Upload, CheckCircle2, Info } from "lucide-react"
import { useState } from "react"
import CustomDropZone from "@/components/ui/DropZone"
import FormTitle from "./FormTitle"
import { checkImageLiveness } from "@/app/customer/registration/actions"

const getBase64 = (file) => {
  const realFile = file instanceof File ? file : file?.[0] || file.file;
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(realFile);
  });
}

export default function CheckLiveness() {
  const [frontProfile, setFrontProfile] = useState({ file: null, preview: null })
  const [rightProfile, setRightProfile] = useState({ file: null, preview: null })

  const handleFrontChange = (file) => {
    console.log("File:", file);
    getBase64(file).then(base64String => {
      console.log("Base64:", base64String);
      setFrontProfile({ file, preview: base64String });
    });
  };
  const handleRightProfileChange = (file) => {
    getBase64(file).then(base64String => {
      console.log("Base64:", base64String);
      setRightProfile({ file, preview: base64String });
    });
  };






  const requirements = [
    { text: "Clear right profile (90° turned to the right)", icon: CheckCircle2 },
    { text: "Same Person as Image 1", icon: CheckCircle2 },
    { text: "Same lighting and quality requirements as Image 1", icon: CheckCircle2 },
    { text: "Clear frontal face view", icon: CheckCircle2 },
    { text: "Face must be centered and well-lit", icon: CheckCircle2 },
    { text: "Eyes must be open", icon: CheckCircle2 },
    { text: "No glasses, masks, or hands in frame", icon: CheckCircle2 },
    { text: "Good lighting conditions", icon: CheckCircle2 },
    { text: "No blur", icon: CheckCircle2 },
  ]

  const handleSubmit = async () => {
    try {
      const data = {
        img1_base64: frontProfile.preview,
        img2_base64: rightProfile.preview
      }
      console.log('data', JSON.stringify(data))
      //this is server action
      const res = await checkImageLiveness(data)
      console.log('res', res)
    } catch (error) {
      console.log('error', error)
    }
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 mt-4">
      <div className=" space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <FormTitle>Profile Image Upload</FormTitle>
          <p className="text-muted-foreground ">
            Upload clear, high-quality photos for identity verification
          </p>
        </div>

        {/* Requirements Card */}
        <Card className="border-2 border-primary/20 bg-card/50 backdrop-blur">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Info className="w-5 h-5 text-primary" />
              <CardTitle className="text-xl">
                Image Requirements
              </CardTitle>
            </div>
            <CardDescription>
              Please ensure your photos meet these criteria for successful verification
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-3">
              {requirements.map((req, index) => (
                <div key={index} className="flex items-start gap-2">
                  <req.icon className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-sm">{req.text}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Upload Areas */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Front Profile Upload */}
          <Card className="border-2 hover:border-primary/50 transition-colors">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                Front Profile (Image 1)
                <span className="text-xs font-normal text-muted-foreground bg-muted px-2 py-1 rounded">Required</span>
              </CardTitle>
              <CardDescription>Clear frontal face view with centered positioning</CardDescription>
            </CardHeader>
            <CardContent>
              <CustomDropZone
                handleChange={handleFrontChange}
                url={frontProfile.preview || ''}
              >
                <div className="space-y-1">
                  <p className="font-medium">Drag and drop your document here</p>
                  <p className="text-sm text-muted-foreground">or click to upload</p>
                </div>
              </CustomDropZone>
            </CardContent>
          </Card>

          {/* Right Profile Upload */}
          <Card className="border-2 hover:border-primary/50 transition-colors">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                Right Profile (Image 2)
                <span className="text-xs font-normal text-muted-foreground bg-muted px-2 py-1 rounded">Required</span>
              </CardTitle>
              <CardDescription>90° right profile view of the same person</CardDescription>
            </CardHeader>
            <CardContent>
              <CustomDropZone
                handleChange={handleRightProfileChange}
                url={rightProfile.preview || ''}
              >

                <div className="space-y-1">
                  <p className="font-medium">Drag and drop your document here</p>
                  <p className="text-sm text-muted-foreground">or click to upload</p>



                </div>
              </CustomDropZone>
            </CardContent>
          </Card>
        </div>

        {/* Submit Button */}
        <div className="flex justify-center pt-4">
          <Button
            onClick={handleSubmit}
            disabled={!frontProfile.file || !rightProfile.file}
            className="px-12 text-lg h-12 shadow-lg hover:shadow-xl transition-shadow"
          >
            Submit for Verification
          </Button>
        </div>
      </div>
    </div >
  )
}
