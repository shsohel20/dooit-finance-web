"use client";
import { Button } from "@/components/ui/button";
import useGetUser from "@/hooks/useGetUser";
import { Plus } from "lucide-react";
import Link from "next/link";
import React from "react";

const VerificationSuccess = () => {
  return (
    <div className="flex flex-col gap-4 items-center justify-center ">
      <div className="size-20">
        <img
          src="/VerificationSuccess.svg"
          alt="verification"
          className="w-full h-full object-cover"
        />
      </div>
      <p className="text-2xl font-bold tracking-tighter">You are Verified!</p>
      <p className="text-success">You got three points</p>
      <p className="text-yellow-400 text-2xl">⭐⭐⭐</p>
      <p>You can now access all the features of your account.</p>
    </div>
  );
};

const VerificationReview = () => {
  return (
    <div className="flex flex-col gap-4 items-center justify-center ">
      <div className="size-20">
        <img
          src="/verificationReview.svg"
          alt="verification"
          className="w-full h-full object-cover"
        />
      </div>
      <p className="text-2xl font-bold tracking-tighter">Verification In Review</p>
    </div>
  );
};
const VerificationFailed = () => {
  return (
    <div className="flex flex-col gap-4 items-center justify-center ">
      <div className="size-20">
        <img
          src="/VerificationFailed.svg"
          alt="verification"
          className="w-full h-full object-cover"
        />
      </div>
      <p className="text-2xl font-bold tracking-tighter">We could not verify your passport</p>
      <p>
        Reason: <span className="font-semibold">The image was too blurry</span>
      </p>
      <Button variant="secondary" className="w-[200px] font-bold">
        Retry Verification
      </Button>
    </div>
  );
};

export const ProfileCard = () => {
  const { loggedInUser } = useGetUser();
  return (
    <div className="flex items-center gap-4 bg-brown flex-shrink-0 max-w-[400px] py-8 px-8 rounded-md">
      <div className="size-20 rounded-full bg-white text-white"></div>
      <div>
        <h4 className="text-2xl font-bold tracking-tighter">{loggedInUser?.name}</h4>
        <p>{loggedInUser?.email}</p>
      </div>
    </div>
  );
};

const Dashboard = () => {
  //dummy verification promise
  const verificationPromise = new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve({
        //a random number between 0 and 1
        progress: Math.random(),
      });
    }, 1000);
  });

  return (
    <div className="container pt-8">
      <div className="flex justify-between items-center">
        <div>
          <h4 className="text-2xl font-bold">Dashboard</h4>
          <p>Welcome back, Sarah! Here&apos;s an overview of your KYC activities.</p>
        </div>
        <div className="flex gap-4">
          <Button className={"w-[200px] bg-[#4ED7F1] text-black"}>Share KYC</Button>
          <Link href="/customer/dashboard/application/new">
            <Button className={" bg-[#402E7A]"}>
              <Plus /> Start New Application
            </Button>
          </Link>
        </div>
      </div>

      <div className="mt-8 flex items-start gap-4">
        <ProfileCard />
        <div className="min-h-[500px] w-full border flex flex-col justify-center items-center">
          {/* <VerificationReview /> */}
          {/* <VerificationFailed /> */}
          <VerificationSuccess />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
