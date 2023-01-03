export type Logger = {
  onTaskFinished: (...data: unknown[]) => void;
  onTaskError: (...data: unknown[]) => void;
};

export type SyncTask = { name: string; call: () => void };

export type AsyncTask = { name: string; call: () => Promise<void> };
