'use client';

import { useEffect, useMemo, useState } from 'react';

type FailedJob = {
  jobId?: string;
  reason: string;
};

type ImportLog = {
  _id: string;
  sourceUrl: string;
  timestamp: string;
  totalFetched: number;
  totalImported: number;
  newJobs: number;
  updatedJobs: number;
  failedJobs: FailedJob[];
};

type ImportHistoryResponse = {
  data: ImportLog[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
};

const PAGE_LIMIT = 10;

export default function ImportHistoryPage() {
  const [logs, setLogs] = useState<ImportLog[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sourceFilter, setSourceFilter] = useState('');

  const apiUrl = useMemo(() => {
    const base = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '') ?? '';
    const params = new URLSearchParams({
      page: page.toString(),
      limit: PAGE_LIMIT.toString()
    });
    if (sourceFilter) {
      params.append('sourceUrl', sourceFilter);
    }
    return `${base}/api/import-history?${params.toString()}`;
  }, [page, sourceFilter]);

  useEffect(() => {
    async function fetchHistory() {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error(`Failed to fetch history (${response.status})`);
        }
        const json = (await response.json()) as ImportHistoryResponse;
        setLogs(json.data);
        setTotalPages(Math.max(1, json.pagination.pages));
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('Unknown error');
        }
      } finally {
        setLoading(false);
      }
    }

    fetchHistory();
  }, [apiUrl]);

  const uniqueSources = useMemo(() => {
    const sources = new Set(logs.map((log) => log.sourceUrl));
    if (sourceFilter && !sources.has(sourceFilter)) {
      sources.add(sourceFilter);
    }
    return Array.from(sources);
  }, [logs, sourceFilter]);

  return (
    <section className="space-y-6">
      <header className="space-y-2">
        <h2 className="text-2xl font-semibold text-slate-900">Import History</h2>
        <p className="text-sm text-slate-600">
          View summaries of automated job feed imports. Totals reflect jobs processed in each run.
        </p>
      </header>

      <div className="flex flex-wrap items-center gap-4">
        <label className="flex flex-col text-sm text-slate-600">
          Source filter
          <select
            className="mt-1 w-64 rounded border border-slate-300 bg-white px-2 py-1 text-slate-900 shadow-sm"
            value={sourceFilter}
            onChange={(event) => {
              setPage(1);
              setSourceFilter(event.target.value);
            }}
          >
            <option value="">All feeds</option>
            {uniqueSources.map((source) => (
              <option key={source} value={source}>
                {source}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50 text-left text-xs font-medium uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3">File / Source</th>
              <th className="px-4 py-3">Timestamp</th>
              <th className="px-4 py-3 text-right">Total</th>
              <th className="px-4 py-3 text-right">New</th>
              <th className="px-4 py-3 text-right">Updated</th>
              <th className="px-4 py-3 text-right">Failed</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {loading ? (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-slate-500">
                  Loading import history...
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-red-600">
                  {error}
                </td>
              </tr>
            ) : logs.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-slate-500">
                  No import runs recorded yet.
                </td>
              </tr>
            ) : (
              logs.map((log) => (
                <tr key={log._id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-medium text-blue-600 break-all">{log.sourceUrl}</td>
                  <td className="px-4 py-3 text-slate-600">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-right font-semibold text-slate-900">{log.totalFetched}</td>
                  <td className="px-4 py-3 text-right text-green-600">{log.newJobs}</td>
                  <td className="px-4 py-3 text-right text-amber-600">{log.updatedJobs}</td>
                  <td className="px-4 py-3 text-right text-red-600">{log.failedJobs.length}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <footer className="flex items-center justify-between text-sm text-slate-600">
        <div>
          Page {page} of {totalPages}
        </div>
        <div className="space-x-2">
          <button
            className="rounded border border-slate-300 px-3 py-1 disabled:cursor-not-allowed disabled:opacity-50"
            onClick={() => setPage((prev) => Math.max(1, prev - 1))}
            disabled={page <= 1 || loading}
          >
            Previous
          </button>
          <button
            className="rounded border border-slate-300 px-3 py-1 disabled:cursor-not-allowed disabled:opacity-50"
            onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
            disabled={page >= totalPages || loading}
          >
            Next
          </button>
        </div>
      </footer>
    </section>
  );
}

