export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export type ApiOptions = {
  method?: HttpMethod;
  data?: any;
  params?: Record<string, any>;
  headers?: Record<string, string>;
  token?: string | null;
  signal?: AbortSignal;
};

export type ApiError = {
  status: number;
  message: string;
  details?: any;
};

function getBaseUrl(): string {
  // Vite uses import.meta.env for environment variables
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

function getDefaultToken(): string | null {
  try {
    if (typeof window === "undefined") return null;
    return window.localStorage.getItem("access_token");
  } catch {
    return null;
  }
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

/**
 * Universal API helper
 */
export async function api<TResponse = any>(
  path: string,
  options: ApiOptions = {}
): Promise<TResponse> {
  const { method = "GET", data, params, headers = {}, token, signal } = options;

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

  const finalToken = token ?? getDefaultToken();
  if (finalToken) {
    finalHeaders.Authorization = `Bearer ${finalToken}`;
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

  const res = await fetch(url, {
    method,
    headers: finalHeaders,
    body,
    signal,
    credentials: "include",
  });

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
