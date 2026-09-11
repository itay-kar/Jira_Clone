export interface Project {
    id: string;
    name: string;
    key: string;
    createdAt: string;
}

export interface Column {
    id: string;
    name: string;
    order: number;
}

export interface Board {
    id: string;
    columns: Column[];
}

export interface Label { 
    id: string;
    name: string;
    color: string;
}

export interface Ticket {
    id: string;
    title: string; 
    description: string;
    type: 'BUG' | 'TASK' | 'STORY';
    priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
    columnId: string;
    order: number;
    assignee?: { id: string; name: string } | null;
    labels: { label : Label }[];
}