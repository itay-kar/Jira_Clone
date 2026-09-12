import { useState , useEffect } from 'react';
import { getSocket } from '../lib/socket';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  DndContext,
  type DragEndEvent,
  DragOverlay,
  type DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { api } from '../lib/api';
import BoardColumn from '../components/BoardColumn';
import CreateTicketForm from '../components/CreateTicketForm';
import TicketCard from '../components/TicketCard';
import TicketDetailPanel from '../components/TicketDetailPanel';
import type { Ticket, Board } from '../lib/types';

interface Project {
  id: string;
  name: string;
  key: string;
  board: Board;
}

export default function BoardPage() {
  const { id: projectId } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const [addingToColumn, setAddingToColumn] = useState<string | null>(null);
  const [openTicketId, setOpenTicketId] = useState<string | null>(null);
  const [activeTicket, setActiveTicket] = useState<Ticket | null>(null);

  useEffect( () => {
    if (!projectId) return;

    const socket = getSocket();
    socket.emit('join-project', projectId);

    function handleTicketChange(ticket: Ticket){
      queryClient.setQueryData(['tickets', projectId], (old : Ticket[] | undefined) => {
        if (!old) return old;
        const exists = old.some((t) => t.id === ticket.id);
        return exists ? 
          old.map((t) => (t.id === ticket.id ? ticket : t))
          : [...old , ticket]
          });
    }

    socket.on('ticket:moved',handleTicketChange);
    socket.on('ticket:updated',handleTicketChange);
    socket.on('ticket:created',handleTicketChange);

    return () => {
      socket.off('ticket:moved',handleTicketChange);
      socket.off('ticket:updated',handleTicketChange);
      socket.off('ticket:created',handleTicketChange);
    };
  },[projectId,queryClient]);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 4 } }));

  const { data: project } = useQuery({
    queryKey: ['project', projectId],
    queryFn: async () => (await api.get<Project>(`/projects/${projectId}`)).data,
    enabled: !!projectId,
  });

  const { data: tickets } = useQuery({
    queryKey: ['tickets', projectId],
    queryFn: async () => (await api.get<Ticket[]>(`/projects/${projectId}/tickets`)).data,
    enabled: !!projectId,
  });

  const moveTicket = useMutation({
    mutationFn: async ({ ticketId, columnId, order }: { ticketId: string; columnId: string; order: number }) =>
      (await api.patch(`/tickets/${ticketId}/move`, { columnId, order })).data,
  });

  function handleDragStart(event: DragStartEvent) {
    const ticket = tickets?.find((t) => t.id === event.active.id);
    setActiveTicket(ticket ?? null);
  }

  function handleDragEnd(event: DragEndEvent) {
    setActiveTicket(null);
    const { active, over } = event;
    if (!over || !tickets) return;

    const activeTicket = tickets.find((t) => t.id === active.id);
    if (!activeTicket) return;

    // Dropped over a column directly (empty column) vs over another ticket
    const overColumn = project?.board.columns.find((c) => c.id === over.id);
    const overTicket = tickets.find((t) => t.id === over.id);

    const targetColumnId = overColumn ? overColumn.id : overTicket?.columnId;
    if (!targetColumnId) return;

    const columnTickets = tickets
      .filter((t) => t.columnId === targetColumnId && t.id !== activeTicket.id)
      .sort((a, b) => a.order - b.order);

    let newOrder: number;
    if (overTicket && overTicket.id !== activeTicket.id) {
      const overIndex = columnTickets.findIndex((t) => t.id === overTicket.id);
      const prevOrder = columnTickets[overIndex - 1]?.order ?? 0;
      const nextOrder = columnTickets[overIndex]?.order ?? prevOrder + 2000;
      newOrder = (prevOrder + nextOrder) / 2;
    } else {
      const lastOrder = columnTickets[columnTickets.length - 1]?.order ?? 0;
      newOrder = lastOrder + 1000;
    }

    if (targetColumnId === activeTicket.columnId && newOrder === activeTicket.order) return;

    moveTicket.mutate({ ticketId: activeTicket.id, columnId: targetColumnId, order: newOrder });
  }

  if (!project) return <div className="p-8 text-low text-sm">Loading board…</div>;

  const columns = [...project.board.columns].sort((a, b) => a.order - b.order);

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

      <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <div className="flex gap-5 p-6 overflow-x-auto">
          {columns.map((col) => {
            const colTickets = (tickets ?? [])
              .filter((t) => t.columnId === col.id)
              .sort((a, b) => a.order - b.order);

            return (
              <div key={col.id}>
                <BoardColumn column={col} tickets={colTickets} onTicketClick={setOpenTicketId} />
                {addingToColumn === col.id ? (
                  <CreateTicketForm
                    projectId={projectId!}
                    columnId={col.id}
                    onDone={() => setAddingToColumn(null)}
                  />
                ) : (
                  <button
                    onClick={() => setAddingToColumn(col.id)}
                    className="w-72 text-left text-sm text-low hover:text-ink hover:bg-surface px-3 py-2 rounded-md transition-colors mt-2"
                  >
                    + Add ticket
                  </button>
                )}
              </div>
            );
          })}
        </div>

        <DragOverlay>
          {activeTicket ? <TicketCard ticket={activeTicket} onClick={() => {}} /> : null}
        </DragOverlay>
      </DndContext>

      {openTicketId && (
        <TicketDetailPanel
          ticketId={openTicketId}
          projectId={projectId!}
          onClose={() => setOpenTicketId(null)}
        />
      )}
    </div>
  );
}