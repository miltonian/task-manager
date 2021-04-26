export const CACHED_USER = 'user-token';

export async function makeRequest<T>(
  path: string,
  method = 'GET',
  payload: any = null
): Promise<T> {
  const options: any = {
    credentials: 'include',
    method,
  };

  const authorization = `Bearer ${localStorage.getItem(CACHED_USER)}`;

  options.headers = {
    'content-type': 'application/json',
    authorization,
  };
  if (payload) {
    options.body = JSON.stringify(payload);
  }

  let response: Response | null = null;
  try {
    response = await fetch(path, options);
  } catch (err) {
    return { error: `${err}` } as any;
  }

  if (response.status === 401 && window.location.host !== '/login') {
    window.location.href = `/login`;
    throw new Error('Redirecting to login');
  }

  const text = await response.text();
  let json = { error: `${response.status} ${response.statusText}` };

  try {
    json = JSON.parse(text);
  } catch (err) {
    console.error(`${method} ${path} returned invalid JSON: ${text}`);
  }

  return json as any;
}
