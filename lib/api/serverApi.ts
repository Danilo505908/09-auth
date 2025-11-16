import type { Note } from "@/types/note";
import type { User } from "@/types/user";
import type { Session } from "@/types/session";
import { cookies } from "next/headers";
import { api } from "@/app/api/api";
import type { AxiosResponse } from "axios";

export const fetchNotes = async (params?: {
  search?: string;
  page?: number;
  perPage?: number;
  tag?: string;
}): Promise<Note[]> => {
  const cookieStore = cookies();
  const accessToken = cookieStore.get('accessToken')?.value;
  const refreshToken = cookieStore.get('refreshToken')?.value;

  // Build Cookie header manually
  const cookieHeader = [
    accessToken && `accessToken=${accessToken}`,
    refreshToken && `refreshToken=${refreshToken}`,
  ]
    .filter(Boolean)
    .join('; ');

  const { data } = await api.get<Note[]>("/notes", {
    params,
    headers: { Cookie: cookieHeader },
  });

  return data;
};

export const fetchNoteById = async (id: string): Promise<Note> => {
  const cookieStore = cookies();
  const accessToken = cookieStore.get('accessToken')?.value;
  const refreshToken = cookieStore.get('refreshToken')?.value;

  // Build Cookie header manually
  const cookieHeader = [
    accessToken && `accessToken=${accessToken}`,
    refreshToken && `refreshToken=${refreshToken}`,
  ]
    .filter(Boolean)
    .join('; ');

  const { data } = await api.get<Note>(`/notes/${id}`, {
    headers: { Cookie: cookieHeader },
  });

  return data;
};

export const getMe = async (): Promise<User> => {
  try {
    const cookieStore = cookies();
    const accessToken = cookieStore.get('accessToken')?.value;
    const refreshToken = cookieStore.get('refreshToken')?.value;

    // Build Cookie header manually
    const cookieHeader = [
      accessToken && `accessToken=${accessToken}`,
      refreshToken && `refreshToken=${refreshToken}`,
    ]
      .filter(Boolean)
      .join('; ');

    if (!cookieHeader) {
      throw new Error('No authentication tokens found');
    }

    const { data } = await api.get<User>("/users/me", {
      headers: { Cookie: cookieHeader },
    });

    return data;
  } catch (error) {
    console.error('getMe error:', error);
    throw error;
  }
};

export const checkSession = async (): Promise<AxiosResponse<Session> | null> => {
  try {
    const cookieStore = cookies();
    const accessToken = cookieStore.get('accessToken')?.value;
    const refreshToken = cookieStore.get('refreshToken')?.value;

    // Build Cookie header manually
    const cookieHeader = [
      accessToken && `accessToken=${accessToken}`,
      refreshToken && `refreshToken=${refreshToken}`,
    ]
      .filter(Boolean)
      .join('; ');

    const response = await api.get<Session>("/auth/session", {
      headers: {
        Cookie: cookieHeader,
      },
    });

    return response;
  } catch {
    return null;
  }
};