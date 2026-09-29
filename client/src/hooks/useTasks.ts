import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api, type TaskInput, type TaskQuery } from '../lib/api';

export const useTasks = (query: TaskQuery) =>
  useQuery({ queryKey: ['tasks', query], queryFn: () => api.listTasks(query) });

export const useTask = (id: string | null) =>
  useQuery({
    queryKey: ['task', id],
    queryFn: () => api.getTask(id!),
    enabled: !!id && id !== 'new',
    retry: false,
  });

function useInvalidate() {
  const qc = useQueryClient();
  return () => Promise.all(['tasks', 'task', 'stats', 'counts'].map((k) => qc.invalidateQueries({ queryKey: [k] })));
}

export function useCreateTask() {
  const invalidate = useInvalidate();
  return useMutation({ mutationFn: (input: TaskInput) => api.createTask(input), onSuccess: invalidate });
}

export function useUpdateTask() {
  const invalidate = useInvalidate();
  return useMutation({
    mutationFn: ({ id, patch }: { id: string; patch: Partial<TaskInput> }) => api.updateTask(id, patch),
    onSuccess: invalidate,
  });
}

export function useDeleteTask() {
  const invalidate = useInvalidate();
  return useMutation({ mutationFn: (id: string) => api.deleteTask(id), onSuccess: invalidate });
}
