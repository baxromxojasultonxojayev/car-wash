export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export type ApiOptions = {
  method?: HttpMethod;
  data?: any;
  params?: Record<string, any>;
  headers?: Record<string, string>;
  token?: string | null;
  signal?: AbortSignal;
  skipAuth?: boolean; // login kabi public endpoint uchun
};

export type ApiError = {
  status: number;
  message: string;
  details?: any;
};

// ─── Token helpers ───────────────────────────────────────────────

export function getAccessToken(): string | null {
  try {
    if (typeof window === "undefined") return null;
    return window.localStorage.getItem("access_token");
  } catch {
    return null;
  }
}

export function getRefreshToken(): string | null {
  try {
    if (typeof window === "undefined") return null;
    return window.localStorage.getItem("refresh_token");
  } catch {
    return null;
  }
}

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

function getBaseUrl(): string {
  const base = import.meta.env.VITE_API_BASE_URL || "";
  return String(base).replace(/\/$/, "");
}

function buildQuery(params?: Record<string, any>) {
  if (!params) return "";
  const sp = new URLSearchParams();

  Object.entries(params).forEach(([key, val]) => {
    if (val === undefined || val === null || val === "") return;

    if (Array.isArray(val)) {
      val.forEach((v) => {
        if (v === undefined || v === null || v === "") return;
        sp.append(key, String(v));
      });
      return;
    }

    sp.set(key, String(val));
  });

  const qs = sp.toString();
  return qs ? `?${qs}` : "";
}

function isFormData(v: any): v is FormData {
  return typeof FormData !== "undefined" && v instanceof FormData;
}

async function parseResponse(res: Response) {
  const contentType = res.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    return await res.json();
  }
  const text = await res.text();
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

// ─── Token refresh ───────────────────────────────────────────────

let refreshPromise: Promise<string> | null = null;

async function refreshAccessToken(): Promise<string> {
  // Agar allaqachon refresh jarayoni bo'lsa, uni kutamiz (parallel refresh'ni oldini olamiz)
  if (refreshPromise) return refreshPromise;

  refreshPromise = (async () => {
    const refresh = getRefreshToken();
    if (!refresh) {
      clearTokens();
      window.location.href = "/login";
      throw { status: 401, message: "No refresh token" } satisfies ApiError;
    }

    const baseUrl = getBaseUrl();
    const res = await fetch(`${baseUrl}/auth/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ refresh_token: refresh }),
    });

    if (!res.ok) {
      clearTokens();
      window.location.href = "/login";
      throw { status: 401, message: "Refresh token expired" } satisfies ApiError;
    }

    const data = await res.json();
    const newAccess = data.access_token || data.access;
    const newRefresh = data.refresh_token || data.refresh || refresh;
    setTokens(newAccess, newRefresh);
    return newAccess;
  })();

  try {
    return await refreshPromise;
  } finally {
    refreshPromise = null;
  }
}

// ─── Universal API helper ────────────────────────────────────────

export async function api<TResponse = any>(
  path: string,
  options: ApiOptions = {}
): Promise<TResponse> {
  const {
    method = "GET",
    data,
    params,
    headers = {},
    token,
    signal,
    skipAuth = false,
  } = options;

  const baseUrl = getBaseUrl();
  if (!baseUrl) {
    throw {
      status: 0,
      message: "VITE_API_BASE_URL not found. Check your .env file.",
    } satisfies ApiError;
  }

  const url = `${baseUrl}${
    path.startsWith("/") ? path : `/${path}`
  }${buildQuery(params)}`;

  const finalHeaders: Record<string, string> = {
    Accept: "application/json",
    ...headers,
  };

  if (!skipAuth) {
    const finalToken = token ?? getAccessToken();
    if (finalToken) {
      finalHeaders.Authorization = `Bearer ${finalToken}`;
    }
  }

  let body: BodyInit | undefined = undefined;

  if (data !== undefined && data !== null && method !== "GET") {
    if (isFormData(data)) {
      body = data;
    } else {
      body = JSON.stringify(data);
      if (!finalHeaders["Content-Type"]) {
        finalHeaders["Content-Type"] = "application/json";
      }
    }
  }

  let res = await fetch(url, {
    method,
    headers: finalHeaders,
    body,
    signal,
  });

  // 401 bo'lsa — token refresh qilib qayta so'rov yuboramiz
  if (res.status === 401 && !skipAuth) {
    try {
      const newToken = await refreshAccessToken();
      finalHeaders.Authorization = `Bearer ${newToken}`;

      res = await fetch(url, {
        method,
        headers: finalHeaders,
        body,
        signal,
      });
    } catch {
      // refresh ham muvaffaqiyatsiz — login sahifasiga yo'naltiriladi
      throw { status: 401, message: "Session expired" } satisfies ApiError;
    }
  }

  const payload = await parseResponse(res);

  if (!res.ok) {
    const err: ApiError = {
      status: res.status,
      message:
        (payload && (payload.message || payload.detail || payload.error)) ||
        res.statusText ||
        "Request error",
      details: payload,
    };
    throw err;
  }

  return payload as TResponse;
}

// ─── Shorthand methods ──────────────────────────────────────────

export const apiGet = <T = any>(
  path: string,
  opts: Omit<ApiOptions, "method"> = {}
) => api<T>(path, { ...opts, method: "GET" });

export const apiPost = <T = any>(
  path: string,
  data?: any,
  opts: Omit<ApiOptions, "method" | "data"> = {}
) => api<T>(path, { ...opts, method: "POST", data });

export const apiPut = <T = any>(
  path: string,
  data?: any,
  opts: Omit<ApiOptions, "method" | "data"> = {}
) => api<T>(path, { ...opts, method: "PUT", data });

export const apiPatch = <T = any>(
  path: string,
  data?: any,
  opts: Omit<ApiOptions, "method" | "data"> = {}
) => api<T>(path, { ...opts, method: "PATCH", data });

export const apiDelete = <T = any>(
  path: string,
  opts: Omit<ApiOptions, "method"> = {}
) => api<T>(path, { ...opts, method: "DELETE" });

// ─── CRUD helpers ────────────────────────────────────────────────
// Har qanday resource uchun CRUD funksiyalar
// Masalan: crud.getAll("/organizations") yoki crud.create("/kiosks", { name: "Test" })

export const crud = {
  /** GET /resource?params */
  getAll: <T = any>(resource: string, params?: Record<string, any>) =>
    apiGet<T>(resource, { params }),

  /** GET /resource/:id */
  getOne: <T = any>(resource: string, id: string | number) =>
    apiGet<T>(`${resource}/${id}`),

  /** POST /resource */
  create: <T = any>(resource: string, data: any) =>
    apiPost<T>(resource, data),

  /** PUT /resource/:id */
  update: <T = any>(resource: string, id: string | number, data: any) =>
    apiPut<T>(`${resource}/${id}`, data),

  /** PATCH /resource/:id */
  patch: <T = any>(resource: string, id: string | number, data: any) =>
    apiPatch<T>(`${resource}/${id}`, data),

  /** DELETE /resource/:id */
  remove: <T = any>(resource: string, id: string | number) =>
    apiDelete<T>(`${resource}/${id}`),
};
