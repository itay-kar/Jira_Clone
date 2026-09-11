import { useState} from "react";
import { useParams , Link} from 'react-router-dom';
import { useQuery } from "@tanstack/react-query";
import { api } from "../lib/api";
import TicketCard from "../components/TicketCard";
import CreateTicketForm from "../components/CreateTicketForm";
import type { Ticket , Board } from "../lib/types";
import TicketDetailPanel from "../components/TicketDetailPanel";

interface Project {
  id: string;
  name: string;
  key: string;
  board: Board;
}

export default function BoardPage(){
  const {id: projectId} = useParams< { id:string } >();
  const [addingToColumn,setAddingToColumn] = useState<string|null>(null);
  const [openTicketId, setOpenTicketId] = useState<string | null>(null);

  const { data : project } = useQuery({
    queryKey: ['project',projectId],
    queryFn: async() => (await api.get<Project>(`/projects/${projectId}`)).data,
    enabled: !!projectId
  });

  const {data: tickets} = useQuery({
    queryKey:['tickets',projectId],
    queryFn: async() => (await api.get<Ticket[]>(`projects/${projectId}/tickets`)).data,
    enabled: !!projectId,
  });

  if (!project) return <div className="p-8 text-low text-sm">Loading board...</div>;

  const columns = [...project.board.columns].sort((a,b)=> a.order - b.order);

  return (
    <div className="min-h-screen">
      <header className="border-b border-border bg-surface px-8 py-4 flex items-center gap-3">
        <Link to="/projects" className="text-sm text-low hover:text-ink">
        ← Projects
        </Link>
        <span className="text-border">/</span>
        <span className="font-mono text-xs text-accent-dark bg-accent/10 rounded px-2 py-1">
        {project.key}
        </span>
        <h1 className="font-semibold">{project.name}</h1>
      </header>
      <div className="flex gap-5 p-6 overflow-x-auto">
        {columns.map((col) => {
          const colTickets = (tickets ?? [])
            .filter((t) => t.columnId === col.id)
            .sort((a, b) => a.order - b.order);

          return (
            <div key={col.id} className="w-72 shrink-0">
              <div className="flex items-center justify-between mb-3 px-1">
                <h3 className="text-sm font-medium text-low uppercase tracking-wide">
                  {col.name}
                </h3>
                <span className="text-xs text-low">{colTickets.length}</span>
              </div>

              <div className="space-y-2 min-h-[40px]">
                {colTickets.map((ticket) => (
                  <TicketCard key={ticket.id} ticket={ticket} onClick={() => setOpenTicketId(ticket.id)} />
                ))}
              </div>

              {addingToColumn === col.id ? (
                <CreateTicketForm
                  projectId={projectId!}
                  columnId={col.id}
                  onDone={() => setAddingToColumn(null)}
                />
              ) : (
                <button
                  onClick={() => setAddingToColumn(col.id)}
                  className="w-full text-left text-sm text-low hover:text-ink hover:bg-surface px-3 py-2 rounded-md transition-colors mt-2"
                >
                  + Add ticket
                </button>
              )}
            </div>
          );
        })}
      </div>

      {openTicketId && (
  <TicketDetailPanel
    ticketId={openTicketId}
    projectId={projectId!}
    onClose={() => setOpenTicketId(null)}
  />
)}

    </div>
  )
}