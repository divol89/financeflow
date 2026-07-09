interface ErrorPayload {
  error?: string;
}

export async function readJsonResponse<T extends ErrorPayload>(
  response: Response,
  fallbackError: string
): Promise<T> {
  const text = await response.text();
  const contentType = response.headers.get("content-type") || "";

  if (!text) {
    return (response.ok ? {} : { error: fallbackError }) as T;
  }

  const trimmed = text.trim();
  const mightBeJson =
    contentType.includes("application/json") ||
    trimmed.startsWith("{") ||
    trimmed.startsWith("[");

  if (!mightBeJson) {
    return { error: fallbackError } as T;
  }

  try {
    return JSON.parse(text) as T;
  } catch {
    return { error: fallbackError } as T;
  }
}
