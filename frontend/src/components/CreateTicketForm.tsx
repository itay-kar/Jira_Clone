import React, { useState } from "react";
import { useMutation , useQueryClient} from "@tanstack/react-query";
import { api } from "../lib/api";

export default function CreateTicketForm({
    projectId,
    columnId,
    onDone,
}: {
    projectId: string;
    columnId: string;
    onDone: () => void;
} 
)
{
    const [title, setTitle] = useState('');
    const queryClient = useQueryClient();

    const createTicket = useMutation({
        mutationFn: async () => (await api.post(`/projects/${projectId}/tickets`, {title,columnId,type:'TASK',priority: 'MEDIUM'})).data,
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['tickets',projectId] });
            setTitle('');
            onDone();
        },
    });

    return (
        <form
        onSubmit={(e: React.SubmitEvent<HTMLFormElement>) => {
            e.preventDefault();
            if (title.trim()) createTicket.mutate();
        }}
        className="mb-2">
            <input
                autoFocus
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onBlur={() => !title && onDone()}
                placeholder="Ticket title..."
                className="w-full px-3 py-2 text-sm bg-surface border border-border ronded-md focus:ring-2 focus:ring-accent/40"
            />
        </form>
    )
}