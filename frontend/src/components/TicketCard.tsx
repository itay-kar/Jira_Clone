import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { Ticket } from '../lib/types';

const PRIORITY_COLOR: Record<Ticket['priority'], string> = {
    LOW: 'bg-low',
    MEDIUM: 'bg-medium',
    HIGH: 'bg-high',
    URGENT: 'bg-urgent',
};

const TYPE_LABEL: Record<Ticket['type'], string> = {
    BUG: 'Bug',
    TASK: 'Task',
    STORY: 'Story',
};

export default function TicketCard({ticket, onClick}: {ticket: Ticket, onClick: () => void}) { 
    const { attributes , listeners , setNodeRef, transform, transition, isDragging } = useSortable({
        id: ticket.id
    })

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.4 : 1,
    }

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            onClick={onClick} 
            className="w-full text-left bg-surface border border-border rounded-md p-3 hover:border-ink/30 transition-colors"
        >
            <div className="flex items-start justify-between gap-2 mb-2">
                <span className="text-sm font-medium leading-snug">{ticket.title}</span>
                <span className={`shrink-0 w-2 h-2 rounded-full mt-1.5 ${PRIORITY_COLOR[ticket.priority]}`}/>
            </div>

        {ticket.labels.length > 0 && (
            <div className='flex flex-wrap gap-1 mb-2'>
                {ticket.labels.map(({ label }) => (
                    <span 
                    key={label.id}
                    className='text-[11px] px-1.5 py-0.5 rounded'
                    style={{ backgroundColor: `${label.color}20` , color: label.color}}
                    >
                        {label.name}
                    </span>
                ))}
            </div>
        )}

        <div className="flex items-center justify-between">
            <span className="text-[11px] text-low font-mono">{TYPE_LABEL[ticket.type]}</span>
            {ticket.assignee && (
                <span
                title={ticket.assignee.name}
                className="w-6 h-6 rounded-full bg-ink text-white text-[10px] font-medium flex items-center justify-center"
                >
                    {ticket.assignee.name.slice(0, 2).toUpperCase()}
                </span>
            )}
        </div>
        </div>
    )
}
