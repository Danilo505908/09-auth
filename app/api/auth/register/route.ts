import { NextRequest, NextResponse } from 'next/server';
import { api } from '../../api';
import { cookies } from 'next/headers';
import { parse } from 'cookie';
import { isAxiosError } from 'axios';
import { logErrorResponse } from '../../_utils/utils';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const apiRes = await api.post('auth/register', body);

    const cookieStore = await cookies();
    const setCookie = apiRes.headers['set-cookie'];

    if (setCookie) {
      const cookieArray = Array.isArray(setCookie) ? setCookie : [setCookie];
      for (const cookieStr of cookieArray) {
        // Parse Set-Cookie header manually: "cookieName=value; Path=/; Max-Age=3600"
        // Extract cookie name and value from the first part before semicolon
        const parts = cookieStr.split(';');
        const [nameValue] = parts;
        const [cookieName, cookieValue] = nameValue.split('=').map(s => s.trim());
        
        if (!cookieName || !cookieValue) continue;
        
        // Parse attributes
        const parsed = parse(cookieStr);
        
        const options: {
          expires?: Date;
          path?: string;
          maxAge?: number;
          httpOnly?: boolean;
          secure?: boolean;
          sameSite?: 'strict' | 'lax' | 'none';
        } = {
          expires: parsed.Expires ? new Date(parsed.Expires) : undefined,
          path: parsed.Path || '/',
          maxAge: parsed['Max-Age'] ? Number(parsed['Max-Age']) : undefined,
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
        };
        
        if (cookieName === 'accessToken') {
          cookieStore.set('accessToken', cookieValue, options);
        }
        if (cookieName === 'refreshToken') {
          cookieStore.set('refreshToken', cookieValue, options);
        }
      }
      return NextResponse.json(apiRes.data, { status: apiRes.status });
    }

    // If no cookies but API call was successful, still return the data
    if (apiRes.status >= 200 && apiRes.status < 300) {
      return NextResponse.json(apiRes.data, { status: apiRes.status });
    }

    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  } catch (error) {
    if (isAxiosError(error)) {
      logErrorResponse(error.response?.data);
      const status = error.response?.status || error.status || 500;
      const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message;
      return NextResponse.json(
        { error: errorMessage, response: error.response?.data },
        { status }
      );
    }
    logErrorResponse({ message: (error as Error).message });
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
