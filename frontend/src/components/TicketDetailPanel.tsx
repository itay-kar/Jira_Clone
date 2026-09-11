import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api';
import type { Ticket } from '../lib/types';

interface Comment {
  id: string;
  body: string;
  createdAt: string;
  author: { name: string };
}

export default function TicketDetailPanel({
  ticketId,
  projectId,
  onClose,
}: {
  ticketId: string;
  projectId: string;
  onClose: () => void;
}) {
  const queryClient = useQueryClient();
  const [comment, setComment] = useState('');

  const { data: ticket } = useQuery({
    queryKey: ['ticket', ticketId],
    queryFn: async () => (await api.get<Ticket & { comments: Comment[] }>(`/tickets/${ticketId}`)).data,
  });

  const updateTicket = useMutation({
    mutationFn: async (data: Partial<Ticket>) => (await api.patch(`/tickets/${ticketId}`, data)).data,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ticket', ticketId] });
      queryClient.invalidateQueries({ queryKey: ['tickets', projectId] });
    },
  });

  const addComment = useMutation({
    mutationFn: async () => (await api.post(`/tickets/${ticketId}/comments`, { body: comment })).data,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ticket', ticketId] });
      setComment('');
    },
  });

  if (!ticket) return null;

  return (
    <div className="fixed inset-0 bg-ink/20 flex justify-end z-50" onClick={onClose}>
      <div
        className="w-full max-w-lg bg-surface h-full overflow-y-auto p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-start mb-4">
          <input
            defaultValue={ticket.title}
            onBlur={(e) => updateTicket.mutate({ title: e.target.value })}
            className="text-lg font-semibold flex-1 mr-3 -ml-1 px-1 py-0.5 rounded hover:bg-canvas focus:outline-none focus:ring-2 focus:ring-accent/40"
          />
          <button onClick={onClose} className="text-low hover:text-ink text-xl leading-none">
            ×
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-xs text-low mb-1">Type</label>
            <select
              value={ticket.type}
              onChange={(e) => updateTicket.mutate({ type: e.target.value as Ticket['type'] })}
              className="w-full px-2 py-1.5 border border-border rounded text-sm"
            >
              <option value="TASK">Task</option>
              <option value="BUG">Bug</option>
              <option value="STORY">Story</option>
            </select>
          </div>
          <div>
            <label className="block text-xs text-low mb-1">Priority</label>
            <select
              value={ticket.priority}
              onChange={(e) => updateTicket.mutate({ priority: e.target.value as Ticket['priority'] })}
              className="w-full px-2 py-1.5 border border-border rounded text-sm"
            >
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
              <option value="URGENT">Urgent</option>
            </select>
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-xs text-low mb-1">Description</label>
          <textarea
            defaultValue={ticket.description ?? ''}
            onBlur={(e) => updateTicket.mutate({ description: e.target.value })}
            rows={4}
            placeholder="Add a description…"
            className="w-full px-3 py-2 border border-border rounded text-sm resize-none focus:outline-none focus:ring-2 focus:ring-accent/40"
          />
        </div>

        <div>
          <h3 className="text-sm font-medium mb-3">Comments</h3>
          <div className="space-y-3 mb-4">
            {ticket.comments?.map((c) => (
              <div key={c.id} className="text-sm bg-canvas rounded-md p-3">
                <div className="flex justify-between mb-1">
                  <span className="font-medium text-xs">{c.author.name}</span>
                  <span className="text-[11px] text-low">
                    {new Date(c.createdAt).toLocaleString()}
                  </span>
                </div>
                <p>{c.body}</p>
              </div>
            ))}
          </div>

          <form
            onSubmit={(e: React.SubmitEvent<HTMLFormElement>) => {
              e.preventDefault();
              if (comment.trim()) addComment.mutate();
            }}
            className="flex gap-2"
          >
            <input
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Add a comment…"
              className="flex-1 px-3 py-2 border border-border rounded text-sm focus:outline-none focus:ring-2 focus:ring-accent/40"
            />
            <button
              type="submit"
              className="px-3 py-2 bg-ink text-white text-sm rounded hover:bg-ink/90"
            >
              Post
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}