"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { IconNotes, IconSend, IconLoader2, IconPaperclip } from "@tabler/icons-react";
import { dateShowFormatWithTime } from "@/lib/utils";
import {
  getCaseNotes,
  addNote,
} from "@/app/dashboard/client/monitoring-and-cases/case-manager/actions";
import { useCaseManagerStore } from "@/app/store/useCaseManagerStore";

export default function CaseNotesTab({ caseData }) {
  const { notes, setNotes, prependNote, submitting, setSubmitting } = useCaseManagerStore();
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState("");

  useEffect(() => {
    if (!caseData?._id) return;
    const load = async () => {
      setLoading(true);
      try {
        const res = await getCaseNotes(caseData._id);
        if (res?.succeed) setNotes(res.data);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [caseData?._id, setNotes]);

  const handleSubmit = async () => {
    const text = content.trim();
    if (!text || submitting) return;
    setSubmitting(true);
    try {
      const res = await addNote(caseData._id, { content: text });
      if (res?.succeed) {
        prependNote(res.data);
        setContent("");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Add note */}
      <Card className="border border-border shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <IconNotes className="size-4" />
            Add Note
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Textarea
            rows={3}
            placeholder="Write a note about this case..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="resize-none text-sm"
          />
          <Button
            size="sm"
            className="gap-1.5"
            onClick={handleSubmit}
            disabled={!content.trim() || submitting}
          >
            {submitting ? (
              <IconLoader2 className="size-3.5 animate-spin" />
            ) : (
              <IconSend className="size-3.5" />
            )}
            Post Note
          </Button>
        </CardContent>
      </Card>

      {/* Notes list */}
      <Card className="border border-border shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold">Notes ({notes.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-16 w-full rounded-lg" />
              ))}
            </div>
          ) : notes.length === 0 ? (
            <p className="py-6 text-center text-sm text-muted-foreground">No notes yet.</p>
          ) : (
            <div className="space-y-3">
              {notes.map((note) => (
                <div key={note._id} className="rounded-lg border bg-muted/20 p-3">
                  <div className="flex items-start gap-2.5">
                    <Avatar className="h-7 w-7 shrink-0">
                      <AvatarImage src={note.author?.avatar} />
                      <AvatarFallback className="text-[9px]">
                        {note.author?.name?.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <span className="text-xs font-semibold text-heading">
                          {note.author?.name || "Unknown"}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {dateShowFormatWithTime(note.createdAt)}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-heading whitespace-pre-wrap">{note.content}</p>
                      {note.attachments?.length > 0 && (
                        <div className="mt-1.5 flex flex-wrap gap-1.5">
                          {note.attachments.map((url, i) => (
                            <a
                              key={i}
                              href={url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1 text-xs text-primary hover:underline"
                            >
                              <IconPaperclip className="size-3" />
                              Attachment {i + 1}
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
