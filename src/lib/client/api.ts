export class ApiError extends Error {
  constructor(message: string, public status: number, public code?: string) {
    super(message);
  }
}

/** JSON fetch helper for browser code. Throws ApiError with a human-readable message. */
export async function apiFetch<T = unknown>(url: string, init: { method?: string; body?: unknown } = {}): Promise<T> {
  let res: Response;
  try {
    res = await fetch(url, {
      method: init.method ?? (init.body ? "POST" : "GET"),
      headers: init.body ? { "Content-Type": "application/json" } : undefined,
      body: init.body ? JSON.stringify(init.body) : undefined,
      credentials: "same-origin",
    });
  } catch {
    throw new ApiError("Network error. Check your connection and try again.", 0, "NETWORK");
  }
  const data = await res.json().catch(() => null);
  if (!res.ok) throw new ApiError(data?.error?.message ?? "Something went wrong. Please try again.", res.status, data?.error?.code);
  return data as T;
}

/** Product analytics; never throws and never blocks the UI. */
export function track(name: string, props?: Record<string, string | number | boolean>) {
  try {
    void fetch("/api/analytics", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name, props }), keepalive: true }).catch(() => {});
  } catch {
    /* ignore */
  }
}
