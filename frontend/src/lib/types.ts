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