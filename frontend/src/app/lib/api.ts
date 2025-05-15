import { AuthRequestBody, AuthResponse, RequestMethod, ResponseBody } from './definitions';
import { redirect } from 'next/navigation';

export async function getUser(cookieHeader: string): Promise<number> {
  const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/me`, {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      Cookie: cookieHeader
    }
  });

  return response.status;
}

export async function authRequest(url: string, requestJSON: AuthRequestBody): Promise<AuthResponse> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/${url}`, {
      method: 'POST',
      body: JSON.stringify(requestJSON),
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    return { success: response.status === 200 };

  } catch (error) {
    return { success: false };
  }
}

export async function request<TData>(url: string, method: RequestMethod, body?: Object): Promise<ResponseBody<TData>> {
  const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/${url}`, {
    method: method,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  });

  if (response.status === 401) {
    redirect('/login');
  }

  return response.json();
}