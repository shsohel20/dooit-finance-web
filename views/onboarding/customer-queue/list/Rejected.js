"use client";
import { useCustomerStore } from '@/app/store/useCustomer';
import React, { useEffect } from 'react'
import CustomerQueueList from '.';

export default function Rejected() {
  const { setKycStatus } = useCustomerStore();
  useEffect(() => {
    setKycStatus('rejected');
    return () => {
      setKycStatus('');
    }
  }, []);
  return (
    <div>
      <CustomerQueueList kycStatus='rejected' />
    </div>
  )
}
