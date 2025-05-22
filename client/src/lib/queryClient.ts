import { QueryClient, QueryFunction } from "@tanstack/react-query";

// API Gateway endpoint from environment variables
const API_ENDPOINT = import.meta.env.VITE_API_ENDPOINT;

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

// Convert internal API paths to API Gateway paths
function getApiUrl(url: string): string {
  // If it's already an absolute URL, return as is
  if (url.startsWith('http')) {
    return url;
  }
  
  // Convert paths like /api/auth/login to /auth
  // or /api/recipients/1 to /recipients/1
  const apiPath = url.replace(/^\/api\//, '/');
  
  return `${API_ENDPOINT}${apiPath}`;
}

export async function apiRequest(
  url: string,
  options: {
    method?: string;
    body?: any;
    headers?: Record<string, string>;
  } = {}
): Promise<any> {
  const { method = 'GET', body, headers = {} } = options;
  
  const apiUrl = getApiUrl(url);
  
  const requestOptions: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers
    },
    credentials: "include",
  };
  
  if (body) {
    requestOptions.body = typeof body === 'string' ? body : JSON.stringify(body);
  }
  
  const res = await fetch(apiUrl, requestOptions);
  await throwIfResNotOk(res);
  
  // For methods like DELETE that might not return content
  if (res.status === 204) {
    return null;
  }
  
  return await res.json();
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    const url = queryKey[0] as string;
    const apiUrl = getApiUrl(url);
    
    const res = await fetch(apiUrl, {
      credentials: "include",
    });

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null;
    }

    await throwIfResNotOk(res);
    return await res.json();
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
