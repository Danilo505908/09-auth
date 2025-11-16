export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { api } from '../../api';
import { cookies } from 'next/headers';
import { logErrorResponse } from '../../_utils/utils';
import { isAxiosError } from 'axios';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('accessToken')?.value;
    const refreshToken = cookieStore.get('refreshToken')?.value;

    // Debug logging
    console.log('GET /api/users/me - Tokens:', {
      hasAccessToken: !!accessToken,
      hasRefreshToken: !!refreshToken,
      accessTokenLength: accessToken?.length || 0,
    });

    // If no tokens, return 401
    if (!accessToken && !refreshToken) {
      console.log('GET /api/users/me - No tokens found, returning 401');
      return NextResponse.json(
        { error: 'Unauthorized - No tokens found' },
        { status: 401 }
      );
    }

    // Build Cookie header manually
    const cookieHeader = [
      accessToken && `accessToken=${accessToken}`,
      refreshToken && `refreshToken=${refreshToken}`,
    ]
      .filter(Boolean)
      .join('; ');

    if (!cookieHeader) {
      return NextResponse.json(
        { error: 'Unauthorized - Empty cookie header' },
        { status: 401 }
      );
    }

    const res = await api.get('/users/me', {
      headers: {
        Cookie: cookieHeader,
      },
    });
    return NextResponse.json(res.data, { status: res.status });
  } catch (error) {
    if (isAxiosError(error)) {
      logErrorResponse(error.response?.data);
      const status = error.response?.status || error.status || 500;
      return NextResponse.json(
        { error: error.message, response: error.response?.data },
        { status }
      );
    }
    logErrorResponse({ message: (error as Error).message });
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('accessToken')?.value;
    const refreshToken = cookieStore.get('refreshToken')?.value;
    const body = await request.json();

    // Build Cookie header manually
    const cookieHeader = [
      accessToken && `accessToken=${accessToken}`,
      refreshToken && `refreshToken=${refreshToken}`,
    ]
      .filter(Boolean)
      .join('; ');

    const res = await api.patch('/users/me', body, {
      headers: {
        Cookie: cookieHeader,
      },
    });
    return NextResponse.json(res.data, { status: res.status });
  } catch (error) {
    if (isAxiosError(error)) {
      logErrorResponse(error.response?.data);
      const status = error.response?.status || error.status || 500;
      return NextResponse.json(
        { error: error.message, response: error.response?.data },
        { status }
      );
    }
    logErrorResponse({ message: (error as Error).message });
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
