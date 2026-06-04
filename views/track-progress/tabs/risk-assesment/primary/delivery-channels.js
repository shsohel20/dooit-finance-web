"use client";
import React, { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";

const channels = [
  {
    key: "in_person",
    label: "In person",
    description:
      "The client is engaged or provided access to a service through direct, face-to-face interactions.",
  },
  {
    key: "email",
    label: "Email",
    description:
      "The client is engaged or provided access to a service through emails.",
  },
  {
    key: "telephone",
    label: "Telephone",
    description:
      "The client is engaged or provided access to a service through the telephone (including calls and text messages).",
  },
  {
    key: "video_conferencing",
    label: "Video conferencing programs",
    description:
      "The client is engaged or provided access to a service through video conferencing programs.",
  },
  {
    key: "online_platforms",
    label: "Online platforms",
    description:
      "The client is engaged or provided access to a service through an online platform. Including your website, a payment platform, or other third-party apps.",
  },
];

export default function DeliveryChannelsStep() {
  const [selected, setSelected] = useState({});

  const toggle = (key) =>
    setSelected((prev) => ({ ...prev, [key]: !prev[key] }));

  return (
    <div>
      <h1 className="text-2xl font-semibold text-foreground mb-1">
        Which of the following ways do your clients interact with you?
      </h1>
      <p className="text-sm text-muted-foreground mb-6">
        Select{" "}
        <span className="text-teal-600 font-medium">all that apply</span>
      </p>

      <div className="space-y-4">
        {channels.map((channel) => (
          <div
            key={channel.key}
            className={`border rounded-lg p-5 cursor-pointer transition-colors ${
              selected[channel.key]
                ? "bg-teal-50 border-teal-400"
                : "bg-white border-border hover:border-teal-300"
            }`}
            onClick={() => toggle(channel.key)}
          >
            <div className="flex items-start gap-3">
              <Checkbox
                id={channel.key}
                checked={!!selected[channel.key]}
                onCheckedChange={() => toggle(channel.key)}
                className="mt-0.5 shrink-0"
              />
              <div>
                <label
                  htmlFor={channel.key}
                  className="text-sm font-semibold text-foreground cursor-pointer"
                >
                  {channel.label}
                </label>
                <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                  {channel.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
