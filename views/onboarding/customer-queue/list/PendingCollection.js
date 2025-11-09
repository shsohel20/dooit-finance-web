"use client";
import React, { useEffect } from 'react'
import CustomerQueueList from '.'
import { useCustomerStore } from '@/app/store/useCustomer';

export default function PendingCollection() {
  const { kycStatus, setKycStatus } = useCustomerStore();
  useEffect(() => {
    setKycStatus('pending');
    return () => {
      setKycStatus('');
    }
  }, []);
  return (
    <div>
      <CustomerQueueList />
    </div>
  )
}
