'use client';

import { useEffect, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { getCaseNotes, addNote } from '@/app/dashboard/client/case-management/actions';
import { useCaseMgmtStore } from '@/app/store/useCaseMgmtStore';
import { formatDateTime } from '@/lib/utils';
import { IconPaperclip, IconX, IconPlus } from '@tabler/icons-react';

function NoteCard({ note }) {
  return (
    <div className="rounded-lg border bg-white p-4 shadow-sm">
      <div className="mb-2 flex items-center gap-2">
        <Avatar className="h-7 w-7">
          <AvatarImage src={note.author?.avatar} />
          <AvatarFallback className="text-[10px]">
            {note.author?.name?.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="text-sm font-medium leading-tight">{note.author?.name}</p>
          <p className="text-xs text-muted-foreground">
            {formatDateTime(note.createdAt)?.date} {formatDateTime(note.createdAt)?.time}
          </p>
        </div>
      </div>

      <p className="whitespace-pre-wrap text-sm">{note.content}</p>

      {note.attachments?.length > 0 && (
        <div className="mt-3 space-y-1">
          <p className="text-xs font-medium text-muted-foreground">Evidence</p>
          {note.attachments.map((url, i) => (
            <a
              key={i}
              href={url}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1 truncate text-xs text-primary hover:underline"
            >
              <IconPaperclip className="h-3 w-3 shrink-0" />
              {url}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

function AddNoteForm({ caseId, canAddNote }) {
  const { prependNote, submitting, setSubmitting } = useCaseMgmtStore();
  const [content, setContent] = useState('');
  const [urls, setUrls] = useState([]);
  const [urlInput, setUrlInput] = useState('');

  const addUrl = () => {
    const trimmed = urlInput.trim();
    if (trimmed) {
      setUrls((prev) => [...prev, trimmed]);
      setUrlInput('');
    }
  };

  const removeUrl = (i) => setUrls((prev) => prev.filter((_, idx) => idx !== i));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    setSubmitting(true);
    try {
      const res = await addNote(caseId, { content, attachments: urls });
      if (res?.succeed) {
        prependNote(res.data);
        setContent('');
        setUrls([]);
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (!canAddNote) return null;

  return (
    <form onSubmit={handleSubmit} className="rounded-lg border bg-muted/30 p-4">
      <p className="mb-3 text-sm font-medium">Add Note</p>

      <Textarea
        placeholder="Write your note here…"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={3}
        className="resize-none"
        required
      />

      {/* Evidence URLs */}
      <div className="mt-3 space-y-1.5">
        <Label className="text-xs text-muted-foreground">Evidence URLs (optional)</Label>
        <div className="flex gap-2">
          <Input
            placeholder="https://…"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            className="h-8 text-xs"
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addUrl())}
          />
          <Button type="button" size="sm" variant="outline" onClick={addUrl} className="h-8">
            <IconPlus className="h-3.5 w-3.5" />
          </Button>
        </div>
        {urls.map((url, i) => (
          <div key={i} className="flex items-center gap-1">
            <span className="truncate text-xs text-primary">{url}</span>
            <button type="button" onClick={() => removeUrl(i)}>
              <IconX className="h-3 w-3 text-muted-foreground hover:text-destructive" />
            </button>
          </div>
        ))}
      </div>

      <div className="mt-3 flex justify-end">
        <Button type="submit" size="sm" disabled={submitting || !content.trim()}>
          {submitting ? 'Saving…' : 'Save Note'}
        </Button>
      </div>
    </form>
  );
}

export default function CaseNotesTab({ caseId, canAddNote = false }) {
  const { notes, setNotes, fetching, setFetching } = useCaseMgmtStore();

  useEffect(() => {
    if (!caseId) return;
    const load = async () => {
      setFetching(true);
      try {
        const res = await getCaseNotes(caseId);
        if (res?.succeed) setNotes(res.data);
      } finally {
        setFetching(false);
      }
    };
    load();
  }, [caseId]);

  return (
    <div className="space-y-4 py-4">
      <AddNoteForm caseId={caseId} canAddNote={canAddNote} />

      {fetching ? (
        Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="space-y-2 rounded-lg border p-4">
            <div className="flex items-center gap-2">
              <Skeleton className="h-7 w-7 rounded-full" />
              <Skeleton className="h-4 w-32" />
            </div>
            <Skeleton className="h-12 w-full" />
          </div>
        ))
      ) : notes.length === 0 ? (
        <p className="py-8 text-center text-sm text-muted-foreground">No notes yet.</p>
      ) : (
        notes.map((note) => <NoteCard key={note._id} note={note} />)
      )}
    </div>
  );
}
