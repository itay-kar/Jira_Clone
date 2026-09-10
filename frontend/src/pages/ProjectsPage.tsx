import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { api } from '../lib/api';
import { useAuth } from '../lib/auth';
import type { Project } from '../lib/types';

export default function ProjectsPage() {
  const { logout } = useAuth();
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [key, setKey] = useState('');

  const { data: projects, isLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: async () => (await api.get<Project[]>('/projects')).data,
  });

  const createProject = useMutation({
    mutationFn: async () => (await api.post('/projects', { name, key })).data,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      setShowForm(false);
      setName('');
      setKey('');
    },
  });

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border bg-surface flex flex-col">
        <div className="px-5 py-5 border-b border-border">
          <h1 className="font-semibold text-lg">Projects</h1>
        </div>
        <nav className="flex-1 overflow-y-auto py-2">
          {projects?.map((p) => (
            <Link
              key={p.id}
              to={`/projects/${p.id}`}
              className="flex items-center gap-3 px-5 py-3 hover:bg-canvas transition-colors"
            >
              <span className="font-mono text-xs text-low bg-canvas border border-border rounded px-1.5 py-0.5">
                {p.key}
              </span>
              <span className="text-sm truncate">{p.name}</span>
            </Link>
          ))}
        </nav>
        <div className="px-5 py-4 border-t border-border">
          <button onClick={logout} className="text-sm text-low hover:text-ink">
            Sign out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 px-10 py-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl font-semibold">Your projects</h2>
          <button
            onClick={() => setShowForm((v) => !v)}
            className="px-4 py-2 bg-accent text-white text-sm font-medium rounded hover:bg-accent-dark transition-colors"
          >
            New project
          </button>
        </div>

        {showForm && (
          <form
            onSubmit={(e: React.SubmitEvent<HTMLFormElement>) => {
              e.preventDefault();
              createProject.mutate();
            }}
            className="mb-8 p-5 bg-surface border border-border rounded-lg flex gap-3 items-end"
          >
            <div className="flex-1">
              <label className="block text-xs text-low mb-1">Project name</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border border-border rounded text-sm"
                placeholder="Website Redesign"
                required
              />
            </div>
            <div className="w-28">
              <label className="block text-xs text-low mb-1">Key</label>
              <input
                value={key}
                onChange={(e) => setKey(e.target.value.toUpperCase())}
                className="w-full px-3 py-2 border border-border rounded text-sm font-mono"
                placeholder="WEB"
                maxLength={10}
                required
              />
            </div>
            <button
              type="submit"
              disabled={createProject.isPending}
              className="px-4 py-2 bg-ink text-white text-sm font-medium rounded hover:bg-ink/90"
            >
              {createProject.isPending ? 'Creating…' : 'Create'}
            </button>
          </form>
        )}

        {isLoading && <p className="text-low text-sm">Loading projects…</p>}

        {!isLoading && projects?.length === 0 && (
          <div className="border border-dashed border-border rounded-lg py-16 text-center">
            <p className="text-low text-sm">No projects yet. Create your first one to get started.</p>
          </div>
        )}

        <div className="border border-border rounded-lg divide-y divide-border overflow-hidden bg-surface">
          {projects?.map((p) => (
            <Link
              key={p.id}
              to={`/projects/${p.id}`}
              className="flex items-center gap-4 px-5 py-4 hover:bg-canvas transition-colors"
            >
              <span className="font-mono text-xs text-accent-dark bg-accent/10 rounded px-2 py-1">
                {p.key}
              </span>
              <span className="font-medium">{p.name}</span>
              <span className="ml-auto text-xs text-low">
                {new Date(p.createdAt).toLocaleDateString()}
              </span>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}