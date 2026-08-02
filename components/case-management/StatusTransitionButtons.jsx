'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import ConfirmDialog from './ConfirmDialog';
import { updateCaseStatus } from '@/app/dashboard/client/case-management/actions';
import { useCaseMgmtStore } from '@/app/store/useCaseMgmtStore';

// Valid transitions from each status
const TRANSITIONS = {
  open: ['under_investigation'],
  under_investigation: ['pending_review'],
  pending_review: ['closed', 'escalated'],
  closed: [],
  escalated: [],
};

const LABEL = {
  under_investigation: 'Start Investigation',
  pending_review: 'Send for Review',
  closed: 'Close Case',
  escalated: 'Escalate',
};

const VARIANT = {
  under_investigation: 'default',
  pending_review: 'outline',
  closed: 'outline',
  escalated: 'destructive',
};

// Statuses that require a confirmation dialog
const CONFIRM_STATUSES = new Set(['closed', 'escalated']);

export default function StatusTransitionButtons({ caseDoc, userRole, userId }) {
  const { setSelectedCase } = useCaseMgmtStore();
  const [confirm, setConfirm] = useState(null); // { status }
  const [loading, setLoading] = useState(false);

  const isAdmin = ['admin', 'compliance_officer'].includes(userRole);
  const isAssigned = (caseDoc?.assignedTo || []).some(
    (u) => (u._id ?? u).toString() === userId?.toString()
  );

  const validNext = (TRANSITIONS[caseDoc?.status] || []).filter((s) => {
    if (isAdmin) return true;
    // Investigators can only move to under_investigation
    return isAssigned && s === 'under_investigation';
  });

  if (validNext.length === 0) return null;

  const doTransition = async (status) => {
    setLoading(true);
    try {
      const res = await updateCaseStatus(caseDoc._id, status);
      if (res?.succeed) setSelectedCase(res.data);
    } finally {
      setLoading(false);
      setConfirm(null);
    }
  };

  const handleClick = (status) => {
    if (CONFIRM_STATUSES.has(status)) {
      setConfirm({ status });
    } else {
      doTransition(status);
    }
  };

  return (
    <>
      <div className="flex flex-wrap gap-2">
        {validNext.map((status) => (
          <Button
            key={status}
            variant={VARIANT[status] || 'default'}
            size="sm"
            disabled={loading}
            onClick={() => handleClick(status)}
          >
            {LABEL[status] || status}
          </Button>
        ))}
      </div>

      {confirm && (
        <ConfirmDialog
          open
          onOpenChange={(open) => !open && setConfirm(null)}
          title={`Confirm: ${LABEL[confirm.status]}`}
          description={
            confirm.status === 'closed'
              ? 'This will permanently close the case. Are you sure?'
              : 'This will escalate the case. Are you sure?'
          }
          confirmLabel={LABEL[confirm.status]}
          destructive={confirm.status === 'escalated'}
          onConfirm={() => doTransition(confirm.status)}
        />
      )}
    </>
  );
}
