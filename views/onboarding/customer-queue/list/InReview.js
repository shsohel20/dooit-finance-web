"use client";
import React, { useEffect } from 'react'
import CustomerQueueList from '.'
import { useCustomerStore } from '@/app/store/useCustomer';

export default function InReview() {
  const { setKycStatus } = useCustomerStore();
  useEffect(() => {
    setKycStatus('in_review');
    return () => {
      setKycStatus('');
    }
  }, []);
  return (
    <div>
      <CustomerQueueList kycStatus='in_review' />
    </div>
  )
}