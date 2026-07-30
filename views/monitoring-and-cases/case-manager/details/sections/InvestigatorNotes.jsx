"use client";

import { useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import CollapsibleSection from "../components/CollapsibleSection";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  IconNotes,
  IconSend,
  IconPin,
  IconPinnedFilled,
  IconAt,
  IconPaperclip,
} from "@tabler/icons-react";
import { dateShowFormatWithTime, getInitials } from "@/lib/utils";
import { analysts } from "@/lib/case-manager-data";

export default function InvestigatorNotes({ notes, onAddNote, onTogglePin, sectionRef }) {
  const [text, setText] = useState("");
  const [mention, setMention] = useState("");
  const [attachmentName, setAttachmentName] = useState("");
  const [pinOnCreate, setPinOnCreate] = useState(false);
  const fileRef = useRef(null);

  const sorted = useMemo(
    () =>
      [...(notes || [])].sort((a, b) => {
        if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      }),
    [notes],
  );

  const handleInsertMention = (name) => {
    setMention(name);
    setText((prev) => (prev ? `${prev.trim()} @${name} ` : `@${name} `));
  };

  const handlePost = () => {
    if (!text.trim()) return;
    onAddNote({
      id: Date.now(),
      author: "You",
      date: new Date().toISOString(),
      text: text.trim(),
      pinned: pinOnCreate,
      mentions: mention ? [mention] : [],
      attachment: attachmentName ? { name: attachmentName } : null,
    });
    setText("");
    setMention("");
    setAttachmentName("");
    setPinOnCreate(false);
    toast.success("Note added");
  };

  return (
    <CollapsibleSection
      id="notes"
      title="Investigator Notes"
      icon={IconNotes}
      badge={notes?.length || 0}
      sectionRef={sectionRef}
    >
      <div className="mb-4 space-y-2.5 rounded-lg border border-border p-3">
        <Textarea
          rows={3}
          placeholder="Add an internal note... use @ to mention a teammate"
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="resize-none text-sm"
        />
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5">
            <IconAt className="size-3.5 text-muted-foreground" />
            <Select value={mention} onValueChange={handleInsertMention}>
              <SelectTrigger className="h-8 w-40 text-xs">
                <SelectValue placeholder="Mention teammate" />
              </SelectTrigger>
              <SelectContent>
                {analysts.map((a) => (
                  <SelectItem key={a.id} value={a.name}>
                    {a.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button
            variant="outline"
            size="sm"
            className="h-8 gap-1.5 text-xs"
            onClick={() => fileRef.current?.click()}
          >
            <IconPaperclip className="size-3.5" />
            {attachmentName || "Attach file"}
          </Button>
          <input
            ref={fileRef}
            type="file"
            className="hidden"
            onChange={(e) => setAttachmentName(e.target.files?.[0]?.name || "")}
          />

          <div className="flex items-center gap-1.5">
            <Checkbox id="pin-on-create" checked={pinOnCreate} onCheckedChange={setPinOnCreate} />
            <Label htmlFor="pin-on-create" className="text-xs font-normal text-muted-foreground">
              Pin this note
            </Label>
          </div>

          <Button size="sm" className="ml-auto h-8 gap-1.5 text-xs" onClick={handlePost} disabled={!text.trim()}>
            <IconSend className="size-3.5" />
            Post Note
          </Button>
        </div>
      </div>

      {sorted.length === 0 ? (
        <p className="py-6 text-center text-sm text-muted-foreground">No notes yet.</p>
      ) : (
        <div className="space-y-2.5">
          {sorted.map((note) => (
            <div
              key={note.id}
              className={`rounded-lg border p-3 ${note.pinned ? "border-primary/30 bg-primary/5" : "border-border bg-muted/10"}`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Avatar className="size-6">
                    <AvatarFallback className="bg-primary/10 text-[0.6rem] font-semibold text-primary">
                      {getInitials(note.author)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-semibold text-heading">{note.author}</p>
                    <p className="text-xs text-muted-foreground">{dateShowFormatWithTime(note.date)}</p>
                  </div>
                </div>
                <button
                  onClick={() => onTogglePin(note.id)}
                  className="shrink-0 rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-heading"
                  title={note.pinned ? "Unpin note" : "Pin note"}
                >
                  {note.pinned ? (
                    <IconPinnedFilled className="size-4 text-primary" />
                  ) : (
                    <IconPin className="size-4" />
                  )}
                </button>
              </div>
              <p className="mt-2 text-sm text-heading">
                {note.text.split(/(@[\w\s]+?(?=\s|$))/).map((part, i) =>
                  part.startsWith("@") ? (
                    <span key={i} className="font-medium text-primary">
                      {part}
                    </span>
                  ) : (
                    <span key={i}>{part}</span>
                  ),
                )}
              </p>
              {note.attachment && (
                <span className="mt-2 inline-flex items-center gap-1 rounded border bg-white px-1.5 py-0.5 text-xs text-muted-foreground">
                  <IconPaperclip className="size-3" />
                  {note.attachment.name}
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </CollapsibleSection>
  );
}
