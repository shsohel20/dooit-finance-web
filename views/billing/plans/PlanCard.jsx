"use client";

import React from "react";
import { Check, Loader2, MoreVertical, UserPlus } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  headlinePrice,
  planBullets,
  money,
  STATUS_STYLES,
  VISIBILITY_STYLES,
} from "./planFormat";

/**
 * A single plan card, following the AML Billing prototype's pricing card:
 * accent top border, MOST POPULAR badge, big price, checkmark bullets, CTA.
 *
 * `actions` are dooit-only and rendered in an overflow menu so the card reads
 * the same for a client, who sees only the marketing face of the plan.
 */
export default function PlanCard({ plan, isDooit, busy, onAction, currentSubscription }) {
  const { price, suffix } = headlinePrice(plan);
  const { shown, more } = planBullets(plan);
  const accent = plan.accentColor || "#0e766a";
  const isDraft = plan.status === "draft";
  const isArchived = plan.status === "archived";

  // Three distinct states, not one.
  //
  // Matching on planCode alone badged EVERY version of that code as CURRENT —
  // so after moving v1 → v2, the archived v1 card still read "CURRENT · v2" and
  // offered "Move to v1". The subscriber appeared to still be on v1.
  //
  //   sameCode    — this card is some version of the plan I subscribe to
  //   isCurrent   — this card is EXACTLY the version I am on   → CURRENT badge
  //   isNewer     — this card is a later version than mine     → "Move to vN"
  //
  // Older versions get neither: they are history, not an offer.
  const sameCode =
    !!currentSubscription && currentSubscription.planCode === plan.code;
  const isCurrent = sameCode && currentSubscription.planVersion === plan.version;
  const isNewer = sameCode && plan.version > currentSubscription.planVersion;

  const act = (a) => () => onAction?.(a, plan);

  return (
    <div
      className={`relative flex flex-col rounded-2xl border bg-white p-5 transition dark:bg-card ${
        plan.popular
          ? "border-2 shadow-[0_8px_24px_rgba(14,118,106,.12)]"
          : "border-[#e9ebef] dark:border-border"
      } ${isArchived ? "opacity-60" : ""}`}
      style={plan.popular ? { borderColor: accent } : undefined}
    >
      {/* Accent strip — the prototype's borderTop: 4px solid accent */}
      <span
        className="absolute inset-x-0 top-0 h-1 rounded-t-2xl"
        style={{ background: accent }}
      />

      {plan.popular && !isCurrent && !isNewer && (
        <span
          className="absolute -top-2.5 left-4 rounded-full px-2.5 py-0.5 text-[10.5px] font-extrabold tracking-[0.3px] text-white"
          style={{ background: accent }}
        >
          MOST POPULAR
        </span>
      )}
      {isCurrent && (
        <span className="absolute -top-2.5 left-4 rounded-full bg-[#12151a] px-2.5 py-0.5 text-[10.5px] font-extrabold tracking-[0.3px] text-white">
          CURRENT
        </span>
      )}
      {isNewer && (
        <span className="absolute -top-2.5 left-4 rounded-full bg-amber-500 px-2.5 py-0.5 text-[10.5px] font-extrabold tracking-[0.3px] text-white">
          NEWER VERSION
        </span>
      )}

      <div className="mt-2 flex items-start justify-between gap-2">
        {/* The whole title block opens the plan's details page, where its
            volume tiers, entitlements and limits live. `preview` is the
            builder's live preview and has no page to open. */}
        <button
          type="button"
          disabled={plan._id === "preview"}
          onClick={() => onAction?.("open", plan)}
          className="min-w-0 text-left disabled:cursor-default"
        >
          <div className="truncate text-[15px] font-extrabold text-[#12151a] hover:underline disabled:no-underline dark:text-foreground">
            {plan.name}
          </div>
          <div className="mt-0.5 font-mono text-[10.5px] text-[#9aa0a8]">
            {plan.code} · v{plan.version}
          </div>
        </button>

        <div className="flex shrink-0 items-center gap-1">
          <span
            className={`rounded-full px-2 py-0.5 text-[10.5px] font-bold capitalize ${
              STATUS_STYLES[plan.status] || ""
            }`}
          >
            {plan.status}
          </span>
          {isDooit && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="size-7" disabled={busy}>
                  <MoreVertical className="size-4 text-[#8a919b]" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={act("open")}>View details</DropdownMenuItem>
                <DropdownMenuSeparator />
                {isDraft && (
                  <>
                    <DropdownMenuItem onClick={act("edit")}>Edit draft</DropdownMenuItem>
                    <DropdownMenuItem onClick={act("publish")}>Publish</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="text-destructive focus:text-destructive"
                      onClick={act("delete")}
                    >
                      Delete draft
                    </DropdownMenuItem>
                  </>
                )}
                {plan.status === "published" && (
                  <>
                    <DropdownMenuItem onClick={act("new-version")}>
                      New version
                    </DropdownMenuItem>
                    {plan.visibility === "private" && (
                      <DropdownMenuItem onClick={act("eligibility")}>
                        Manage access
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={act("archive")}>Archive</DropdownMenuItem>
                  </>
                )}
                {isArchived && (
                  <DropdownMenuItem onClick={act("new-version")}>
                    New version from this
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>

      <p className="mt-1 min-h-[34px] text-[12.5px] text-[#8a919b]">
        {plan.tagline || plan.description || "—"}
      </p>

      <div className="mb-3.5 mt-2 flex items-baseline gap-1">
        <span className="text-[28px] font-extrabold tracking-[-1px] text-[#12151a] dark:text-foreground">
          {price}
        </span>
        <span className="text-[13px] font-semibold text-[#9aa0a8]">{suffix}</span>
      </div>

      {plan.pricingModel === "hybrid" && Number(plan.overagePrice) > 0 && (
        <div className="-mt-2 mb-2 text-xs text-[#9aa0a8]">
          then {money(plan.overagePrice)} / {plan.includedUnit} over{" "}
          {Number(plan.includedUsage || 0).toLocaleString("en-AU")}
        </div>
      )}

      {plan.annualDiscountPercent > 0 && (
        <div className="mb-3 inline-flex w-fit items-center gap-1.5 rounded-lg bg-emerald-500/10 px-2 py-1 text-[11.5px] font-bold text-emerald-700 dark:text-emerald-400">
          Save {plan.annualDiscountPercent}% annually
        </div>
      )}

      <div className="flex flex-1 flex-col gap-2">
        {shown.map((f, i) => (
          <div key={i} className="flex gap-2 text-[12.5px] text-[#4a515b] dark:text-muted-foreground">
            <Check className="mt-0.5 size-3.5 shrink-0" style={{ color: accent }} />
            <span className="min-w-0 truncate">{f}</span>
          </div>
        ))}
        {more > 0 && (
          <div className="pl-[22px] text-xs font-semibold text-[#9aa0a8]">
            + {more} more
          </div>
        )}
      </div>

      <div className="mt-4">
        {plan.visibility === "private" && (
          <span
            className={`mb-2 inline-block rounded-full px-2 py-0.5 text-[10.5px] font-bold ${VISIBILITY_STYLES.private}`}
          >
            Private
          </span>
        )}
        {/* dooit never BUYS a plan — it sells them, so its CTA is to put a
            client account onto this plan. Quote-only plans are included
            deliberately: selfServe:false means "only dooit can provision this",
            so this is the sole route by which an Enterprise plan is ever sold.
            A client gets the buying CTA instead: Subscribe, Change to this
            plan, or the sales route. */}
        <Button
          className="w-full rounded-[10px] font-bold"
          style={
            isCurrent
              ? undefined
              : { background: accent, color: "#fff" }
          }
          variant={isCurrent ? "outline" : "default"}
          disabled={isDraft || isArchived || busy || (!isDooit && isCurrent)}
          /* "Move to vN" and "Change to this plan" are the same operation — a
             change-plan to this document. Only the wording differs, because
             moving to a newer version of the plan you are already on reads
             differently from switching plans. */
          onClick={act(
            isDooit
              ? "assign"
              : isCurrent
                ? "manage"
                : currentSubscription
                  ? "change"
                  : "subscribe"
          )}
        >
          {busy ? (
            <Loader2 className="size-4 animate-spin" />
          ) : isDooit ? (
            <>
              <UserPlus className="size-4" />
              Assign to client
            </>
          ) : isCurrent ? (
            "Current plan"
          ) : isNewer ? (
            `Move to v${plan.version}`
          ) : !plan.selfServe ? (
            plan.salesCta || "Contact sales"
          ) : currentSubscription ? (
            "Change to this plan"
          ) : (
            "Subscribe"
          )}
        </Button>
      </div>
    </div>
  );
}
