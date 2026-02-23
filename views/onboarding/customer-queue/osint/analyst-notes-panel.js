"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { MessageSquare, Plus, User, ArrowRight } from "lucide-react";

export function AnalystNotesPanel({ notes: initialNotes }) {
  const [notes, setNotes] = useState(initialNotes);
  const [showForm, setShowForm] = useState(false);
  const [draft, setDraft] = useState("");

  const handleAdd = () => {
    if (!draft.trim()) return;
    const newNote = {
      id: `AN-${Date.now()}`,
      author: "Current User",
      date: new Date().toISOString(),
      content: draft.trim(),
    };
    setNotes([newNote, ...notes]);
    setDraft("");
    setShowForm(false);
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Add note */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          {notes.length} note{notes.length !== 1 ? "s" : ""}
        </span>
        <Button variant="outline" size="sm" onClick={() => setShowForm(!showForm)}>
          <Plus className="size-3.5" />
          Add Note
        </Button>
      </div>

      {showForm && (
        <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
          <Textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Enter analyst observations, findings, or recommended actions..."
            className="min-h-24 bg-card"
          />
          <div className="mt-3 flex items-center justify-end gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setShowForm(false);
                setDraft("");
              }}
            >
              Cancel
            </Button>
            <Button size="sm" onClick={handleAdd} disabled={!draft.trim()}>
              Save Note
            </Button>
          </div>
        </div>
      )}

      {/* Notes list */}
      <div className="flex flex-col gap-3">
        {notes.map((note, i) => (
          <div key={note.id}>
            <div className="flex items-start gap-3">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground mt-0.5">
                <User className="size-3.5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className="text-sm font-semibold text-foreground">{note.author}</span>
                  <span className="text-xs text-muted-foreground font-mono">
                    {new Date(note.date).toLocaleString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                  {note.content}
                </p>
                {note.action && (
                  <Badge
                    variant="outline"
                    className="mt-2 bg-amber-50 text-amber-700 border-amber-200"
                  >
                    <ArrowRight className="size-3" />
                    {note.action}
                  </Badge>
                )}
              </div>
            </div>
            {i < notes.length - 1 && <Separator className="mt-3" />}
          </div>
        ))}

        {notes.length === 0 && (
          <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
            <MessageSquare className="size-8 mb-2 opacity-40" />
            <p className="text-sm">No analyst notes yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
