import { OtpForm } from '@/components/OtpForm'
import React from 'react'
export default function OTPPage({ searchParams }) {
  const { email, token, cid } = searchParams;
  console.log("email", email);
  return (
    <div className='container grid place-items-center min-h-[80vh] py-8'>
      <OtpForm email={email} token={token} cid={cid} />
    </div>
  )
}