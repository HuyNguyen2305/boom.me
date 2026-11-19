"use client";
import { useState } from "react";

export function CopyEmail({ email }: { email: string }) {
  const [copied, setCopied] = useState(false);
  async function copy() {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard blocked: the email stays visible and selectable
    }
  }
  return (
    <button type="button" onClick={copy} className="border-[1.5px] border-teal/50 px-4 py-2.5 text-teal hover:border-teal">
      {copied ? "Copied" : "Copy email"}
    </button>
  );
}
