let refreshPromise: Promise<boolean> | null = null;

async function refreshAccessToken(): Promise<boolean> {
  if (!refreshPromise) {
    refreshPromise = fetch(
      `${import.meta.env.VITE_BASE_URL}/api/auth/refresh`,
      {
        method: "POST",
        credentials: "include",
      },
    )
      .then((response) => response.ok)
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
}

export async function apiFetch(
  input: RequestInfo | URL,

  init: RequestInit = {},
) {
  const response = await fetch(input, {
    ...init,
    credentials: "include",
  });
  console.log("Response status:", response);

  // Access token is still valid
  if (response.status !== 401) {
    return response;
  }

  // Try to refresh
  const refreshed = await refreshAccessToken();

  if (!refreshed) {
    return response;
  }

  // Access token cookie has now been replaced.
  // Retry the original request.
  return fetch(input, {
    ...init,
    credentials: "include",
  });
}
