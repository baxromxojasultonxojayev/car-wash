export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export type ApiOptions = {
  method?: HttpMethod;
  data?: any;
  params?: Record<string, any>;
  headers?: Record<string, string>;
  token?: string | null;
  signal?: AbortSignal;
  skipAuth?: boolean;
};

export type ApiError = {
  status: number;
  message: string;
  details?: any;
};

// ─── Token helpers ───────────────────────────────────────────────

export const getAccessToken = () => localStorage.getItem("access_token");
export const getRefreshToken = () => localStorage.getItem("refresh_token");

export function setTokens(access: string, refresh: string) {
  localStorage.setItem("access_token", access);
  localStorage.setItem("refresh_token", refresh);
}

export function clearTokens() {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
  localStorage.removeItem("auth_user");
}

// ─── Internals ───────────────────────────────────────────────────

const getBaseUrl = () => (import.meta.env.VITE_API_BASE_URL || "").replace(/\/$/, "");

function buildQuery(params?: Record<string, any>) {
  if (!params) return "";
  const sp = new URLSearchParams();
  Object.entries(params).forEach(([key, val]) => {
    if (val !== undefined && val !== null && val !== "") {
      if (Array.isArray(val)) val.forEach(v => sp.append(key, String(v)));
      else sp.set(key, String(val));
    }
  });
  const qs = sp.toString();
  return qs ? `?${qs}` : "";
}

async function parseResponse(res: Response) {
  const ct = res.headers.get("content-type") || "";
  if (ct.includes("application/json")) return res.json();
  const text = await res.text();
  try { return JSON.parse(text); } catch { return text; }
}

// ─── Token refresh ───────────────────────────────────────────────

let refreshPromise: Promise<string> | null = null;

async function refreshAccessToken(): Promise<string> {
  if (refreshPromise) return refreshPromise;

  refreshPromise = (async () => {
    const refresh = getRefreshToken();
    if (!refresh) {
      clearTokens();
      window.location.href = "/login";
      throw { status: 401, message: "No refresh token" } as ApiError;
    }

    const res = await fetch(`${getBaseUrl()}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh_token: refresh }),
    });

    if (!res.ok) {
      clearTokens();
      window.location.href = "/login";
      throw { status: 401, message: "Session expired" } as ApiError;
    }

    const data = await res.json();
    const newAccess = data.access_token || data.access;
    const newRefresh = data.refresh_token || data.refresh || refresh;
    setTokens(newAccess, newRefresh);
    return newAccess;
  })();

  try { return await refreshPromise; } 
  finally { refreshPromise = null; }
}

// ─── Universal API helper ────────────────────────────────────────

export async function api<T = any>(path: string, options: ApiOptions = {}): Promise<T> {
  const { method = "GET", data, params, headers = {}, token, signal, skipAuth = false } = options;
  
  const url = `${getBaseUrl()}${path.startsWith("/") ? path : `/${path}`}${buildQuery(params)}`;
  const finalHeaders = { "Accept": "application/json", ...headers } as any;

  if (!skipAuth) {
    const activeToken = token ?? getAccessToken();
    if (activeToken) finalHeaders.Authorization = `Bearer ${activeToken}`;
  }

  const config: RequestInit = { method, headers: finalHeaders, signal };

  if (data !== undefined && data !== null && method !== "GET") {
    if (data instanceof FormData) config.body = data;
    else {
      config.body = JSON.stringify(data);
      finalHeaders["Content-Type"] = "application/json";
    }
  }

  let res = await fetch(url, config);

  if (res.status === 401 && !skipAuth) {
    try {
      const newToken = await refreshAccessToken();
      finalHeaders.Authorization = `Bearer ${newToken}`;
      res = await fetch(url, config);
    } catch {
      throw { status: 401, message: "Session expired" } as ApiError;
    }
  }

  const payload = await parseResponse(res);

  if (!res.ok) {
    const message = payload?.message || payload?.error || payload?.detail || res.statusText || "Request error";
    throw { status: res.status, message, details: payload } as ApiError;
  }

  return payload;
}

// ─── Shorthands ──────────────────────────────────────────

export const apiGet = <T>(path: string, opts?: ApiOptions) => api<T>(path, { ...opts, method: "GET" });
export const apiPost = <T>(path: string, data?: any, opts?: ApiOptions) => api<T>(path, { ...opts, method: "POST", data });
export const apiPut = <T>(path: string, data?: any, opts?: ApiOptions) => api<T>(path, { ...opts, method: "PUT", data });
export const apiPatch = <T>(path: string, data?: any, opts?: ApiOptions) => api<T>(path, { ...opts, method: "PATCH", data });
export const apiDelete = <T>(path: string, opts?: ApiOptions) => api<T>(path, { ...opts, method: "DELETE" });

// ─── CRUD helpers ────────────────────────────────────────────────

export const crud = {
  getAll: <T>(res: string, params?: any) => apiGet<T>(res, { params }),
  getOne: <T>(res: string, id: any) => apiGet<T>(`${res}/${id}`),
  create: <T>(res: string, data: any) => apiPost<T>(res, data),
  update: <T>(res: string, id: any, data: any) => apiPut<T>(`${res}/${id}`, data),
  patch: <T>(res: string, id: any, data: any) => apiPatch<T>(`${res}/${id}`, data),
  remove: <T>(res: string, id: any) => apiDelete<T>(`${res}/${id}`),
};
