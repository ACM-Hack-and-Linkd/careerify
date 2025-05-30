import { AuthRequestBody, AuthResponse, RequestMethod, ResponseBody } from './definitions';
import { redirect } from 'next/navigation';

export type QuizResults = {
  roles: string[],
  companies: string[],
  locations: string[],
  education_level: string,
  experience_level: string,
  college: string,
  hobbies: string[],
  limit: number,
}

// Send quiz results to backend and receive a list of profiles
// I'm not sure what a profile looks like so the type is any
const sendQuizResults = async (results: QuizResults): Promise<any[]> => {
  const res = await fetch(`http://localhost:8000/results`, {
    method: "POST",
    body: JSON.stringify(results),
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
    }
  });

  const json = await res.json();

  console.log(json);

  return json;
}

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

export { sendQuizResults };
