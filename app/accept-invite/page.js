import React from 'react'
import { inviteTokenValidation } from './actions';
import TokenValidation from '@/components/TokenValidation';
export default async function AcceptInvite({ searchParams }) {
  //query params
  const { token, cid } = searchParams;

  return (
    <div>
      <h1>Accept Invite</h1>
      <TokenValidation token={token} cid={cid} />
    </div>
  )
}