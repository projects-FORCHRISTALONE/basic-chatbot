"use client";

import { MessageList } from "./message-list";
import { Button } from "@/components/ui/button";
import messages from "./messages.json";
import { Suspense, useState } from "react";
import { generateSummary } from "./actions";
import { SummaryCard } from "./summary-card";

type Summary = Awaited<ReturnType<typeof generateSummary>>

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState<Summary | null>(null)
  return (
    <main className="mx-auto max-w-2xl pt-8">
      <div className="flex space-x-4 items-center mb-2">
        <h3 className="font-bold">Comments</h3>
        <Button
          variant={"secondary"}
          disabled={loading}
          onClick={async () => {
            setLoading(true);
            setSummary(null);
            try{
              // Call the server action
              const result = await generateSummary(messages)
              setSummary(result)
            } catch (err){
              console.error("Summarization failed:", err)
            } finally {
              setLoading(false);
            }
          }}
        >
          {loading ? 'Summarizing...' : 'Summarize'}
        </Button>
      </div>
      <Suspense>
        {summary && <SummaryCard {...summary}/>}
      </Suspense>
      <MessageList messages={messages} />
    </main>
  );
}
