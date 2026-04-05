"use client";

import React, { useTransition } from "react";
import { TacticalTable } from "@/components/ui/TacticalTable";
import { TacticalButton } from "@/components/ui/TacticalButton";
import { togglePublishEvent, deleteEvent } from "./actions";

interface Event {
  id: string;
  title: string;
  eventType: string | null;
  eventDate: Date;
  location: string | null;
  isPublished: boolean;
}

interface EventTableProps {
  initialEvents: Event[];
}

export function EventTable({ initialEvents }: EventTableProps) {
  const [isPending, startTransition] = useTransition();

  const handleTogglePublish = async (id: string, current: boolean) => {
    startTransition(async () => {
      try {
        await togglePublishEvent(id, current);
      } catch (err) {
        alert("PUBLISH_FAILURE: " + (err instanceof Error ? err.message : "UNKNOWN"));
      }
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("CONFIRM_DELETION: THIS ACTION IS IRREVERSIBLE. CONTINUE?")) return;
    
    startTransition(async () => {
      try {
        await deleteEvent(id);
      } catch (err) {
        alert("DELETION_FAILURE: " + (err instanceof Error ? err.message : "UNKNOWN"));
      }
    });
  };

  const columns = [
    { 
      header: "01_EVENT_IDENTIFIER", 
      accessor: (e: Event) => (
        <div className="flex flex-col">
          <span className="text-white font-black">{e.title}</span>
          <span className="text-[9px] text-zinc-600 tracking-tighter uppercase">{e.eventType || "GENERAL_ASSEMBLY"}</span>
        </div>
      ) 
    },
    { 
      header: "02_DATE_STAMP", 
      accessor: (e: Event) => new Date(e.eventDate).toLocaleDateString() 
    },
    { header: "03_LOCATION", accessor: (e: Event) => e.location || "VIRTUAL_UPLINK" },
    { 
      header: "04_STATE", 
      accessor: (e: Event) => (
        <div className={`px-2 py-0.5 inline-block text-[9px] font-black border ${
          e.isPublished 
            ? 'bg-white text-black border-white' 
            : 'bg-transparent text-zinc-500 border-zinc-800 italic'
        }`}>
          {e.isPublished ? "PUBLISHED" : "DRAFT_X"}
        </div>
      ) 
    },
    { 
      header: "05_TACTICAL_CONTROLS", 
      className: "text-right",
      accessor: (e: Event) => (
        <div className="flex justify-end gap-2">
          <TacticalButton 
            variant="outline" 
            size="sm" 
            prefix=""
            disabled={isPending}
            onClick={() => handleTogglePublish(e.id, e.isPublished)}
          >
            {e.isPublished ? "UNPUBLISH" : "DEPLOY"}
          </TacticalButton>
          <TacticalButton 
            variant="danger" 
            size="sm" 
            prefix=""
            disabled={isPending}
            onClick={() => handleDelete(e.id)}
          >
            DELETE
          </TacticalButton>
        </div>
      ) 
    }
  ];

  return <TacticalTable data={initialEvents} columns={columns} id="EVE_DIR_ROOT" />;
}
