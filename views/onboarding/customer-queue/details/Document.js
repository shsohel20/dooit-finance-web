'use client'
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { FileText, CheckCircle2, Clock, ChevronRight, ImageIcon, Download } from 'lucide-react';

export default function Documents({ details }) {
  const [reviewDocuments, setReviewDocuments] = useState(false);
  return (
    <div> <div className="grid gap-6 lg:grid-cols-3 mt-6">
    {/* Document Verification Status */}
    <Card className="border-border/50 ">
      <div className="p-6">
        <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
          <FileText className="size-5 text-primary" />
          Document Verification Status
        </h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-4 rounded-lg bg-success/5 border border-success/20">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-success/15">
                <CheckCircle2 className="size-4 text-success" />
              </div>
              <span className="font-medium">Identity Proof</span>
            </div>
            <Badge className="bg-success text-success-foreground">Passed</Badge>
          </div>

          <div className="flex items-center justify-between p-4 rounded-lg bg-warning/5 border border-warning/20">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-warning/15">
                <Clock className="size-4 text-warning-foreground" />
              </div>
              <span className="font-medium">Address Proof</span>
            </div>
            <Badge className="bg-warning text-warning-foreground">Pending</Badge>
          </div>

          <div className="flex items-center justify-between p-4 rounded-lg bg-success/5 border border-success/20">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-success/15">
                <CheckCircle2 className="size-4 text-success" />
              </div>
              <span className="font-medium">Source of Funds Declaration</span>
            </div>
            <Badge className="bg-success text-success-foreground">Passed</Badge>
          </div>

          <div className="flex items-center justify-between p-4 rounded-lg bg-primary/5 border border-primary/20">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-primary/15">
                <Clock className="size-4 text-primary" />
              </div>
              <span className="font-medium">Facial Recognition Check</span>
            </div>
            <Badge className="bg-primary text-primary-foreground">Pending</Badge>
          </div>
        </div>

        <Separator className="my-5" />

        <Button variant="outline" className="w-full bg-transparent" onClick={() => setReviewDocuments(prev => !prev)}>
          Review Upload Documents
          <ChevronRight className="size-4 ml-2" />
        </Button>
        {
          reviewDocuments ? <div className="border rounded-md p-4 mt-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {details?.documents.map((doc, index) => (
                <Card
                  key={index}
                  className="overflow-hidden bg-card border-border hover:border-primary/50 transition-colors"
                >
                  {/* Document Preview */}
                  <div className="aspect-video bg-muted/50 relative group">
                    <img src={doc.url || "/placeholder.svg"} alt={doc.name} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Button size="sm" variant="secondary" asChild>
                        <a href={doc.url} target="_blank" rel="noopener noreferrer">
                          <ImageIcon className="h-4 w-4 mr-2" />
                          View Full Size
                        </a>
                      </Button>
                    </div>
                  </div>

                  {/* Document Details */}
                  <div className="p-4 space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-muted-foreground" />
                          <h4 className="font-medium text-foreground">{doc.name}</h4>
                        </div>
                        <p className="text-xs text-muted-foreground">{getDocumentTypeLabel(doc.type)}</p>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {doc.docType.toUpperCase()}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-4 text-xs text-muted-foreground pt-2 border-t border-border">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5" />
                        <span>{dateShowFormat(doc.uploadedAt)}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <FileText className="h-3.5 w-3.5" />
                        <span>{doc.mimeType.split("/")[1].toUpperCase()}</span>
                      </div>
                    </div>

                    <Button variant="outline" size="sm" className="w-full bg-transparent" asChild>
                      <a href={doc.url} download>
                        <Download className="h-3.5 w-3.5 mr-2" />
                        Download
                      </a>
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div> : null
        }
      </div>
    </Card>

  </div></div>
  )
}