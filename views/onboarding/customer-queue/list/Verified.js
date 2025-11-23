"use client";
import React, { useEffect } from 'react'
import CustomerQueueList from '.';
import { useCustomerStore } from '@/app/store/useCustomer';

export default function Verified() {
  const { setKycStatus } = useCustomerStore();
  useEffect(() => {
    setKycStatus('verified');
    return () => {
      setKycStatus('');
    }
  }, []);
  return (
    <div>
      <CustomerQueueList kycStatus='verified' />
    </div>
  )
}
