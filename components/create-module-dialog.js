'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useModules } from '@/contexts/module-context';
import { Plus } from 'lucide-react';
import { createModule } from '@/app/dashboard/client/knowledge-hub/training-hub/actions';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { toast } from 'sonner';

const statusOptions = [
  { label: 'Draft', value: 'draft' },
  { label: 'Published', value: 'published' },
];

const initialState = {
  title: '',
  description: '',
  status: 'draft',
};

export function CreateModuleDialog({ getAll }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState(initialState);
  const [isLoading, setIsLoading] = useState(false);
  // const { createModule } = useModules();
  const user = { id: '1', role: 'admin' };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    setIsLoading(true);
    try {
      const res = await createModule(formData);
      // console.log('res', res);
      if (res.success) {
        setFormData(initialState);
        setOpen(false);
        toast.success('Module created successfully');
        getAll();
      } else {
        toast.error('Failed to create module');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Create Module
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create New Module</DialogTitle>
          <DialogDescription>
            Create a new training module. You can add parts and questions after
            creation.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleCreate} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Module Title</Label>
            <Input
              id="title"
              placeholder="e.g., AML Compliance Basics"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Describe the purpose and content of this module..."
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows={4}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select
              id="status"
              value={formData.status}
              onValueChange={(value) =>
                setFormData({ ...formData, status: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a status..." />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!formData.title.trim() || isLoading}
            >
              {isLoading ? 'Creating...' : 'Create Module'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
