import { useDroppable } from "@dnd-kit/core";
import { SortableContext , verticalListSortingStrategy } from "@dnd-kit/sortable";
import type { Ticket , Column } from "../lib/types";
import TicketCard from "./TicketCard";

export default function BoardColumn({
    column,
    tickets,
    onTicketClick,
}:{
    column: Column;
    tickets: Ticket[];
    onTicketClick: (id:string) => void
}) {
    const { setNodeRef } = useDroppable({id : column.id})

    return (
        <div ref={setNodeRef} className="w-72 shrink-0">
            <div className="flex items-center justify-between mb-3 px-1">
                <h3 className="text-sm font-medium text-low uppercase tracking-wide">{column.name}</h3>
                <span className="text-xs text-low">{tickets.length}</span>
            </div>

            <SortableContext items={tickets.map((t) => t.id)} strategy={verticalListSortingStrategy}>
                <div className="space-y-2 min-h-[40px]">
                    {tickets.map((ticket) => (
                        <TicketCard key={ticket.id} ticket={ticket} onClick={() => onTicketClick(ticket.id)} />
          ))}
                </div>
            </SortableContext>
        </div>
    );
}