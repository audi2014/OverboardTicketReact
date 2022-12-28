export type SyncTask = { name: string; call: () => void };
export type AsyncTask = { name: string; call: () => Promise<void> };
