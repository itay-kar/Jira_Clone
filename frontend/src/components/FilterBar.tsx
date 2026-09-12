import { type Ticket } from "../lib/types";

interface Props {
    priority: string;
    onPriorityChange: (v: string) => void;
    search: string;
    onSearchChange: (v:string) => void;
}

const PRIORITIES: Ticket['priority'][] = ['LOW','MEDIUM','HIGH','URGENT'];

export default function FilterBar({priority, onPriorityChange, search , onSearchChange} : Props) {
    return (
        <div className="flex items-center gap-3 px-6 py-3 border-b border-border bg-surface">
            <input 
                value={search}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search Tickets..."
                className="px-3 py-1.5 border border-border rounded text-sm w-56 focus:outline-none focus:ring-2 focus:rind-accent/40"
            />
            <select
                value={priority}
                onChange={(e) => onPriorityChange(e.target.value)}
                className="px-3 py-1.5 border border-border rounded text-sm"
                >
                    <option value="">All priorites</option>
                    {PRIORITIES.map((p) => (
                        <option key={p} value={p}>
                        {p.charAt(0) + p.slice(1).toLowerCase()}
                        </option>
                ))}
            </select>
            {(priority || search) && (
                <button
                    onClick={() => {
                    onPriorityChange('');
                    onSearchChange('');
                }}
                className="text-xs text-low hover:text-ink"
                >
                Clear filters
                </button>
      )}
        </div>
    )

}