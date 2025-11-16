import { NextRequest, NextResponse } from 'next/server';
import { api } from '../../api';
import { cookies } from 'next/headers';
import { parse } from 'cookie';
import { isAxiosError } from 'axios';
import { logErrorResponse } from '../../_utils/utils';

export async function POST(req: NextRequest) {
  // Read body once and reuse it
  const body = await req.json();
  console.log('Login request body:', { email: body.email, hasPassword: !!body.password });
  
  try {
    const apiRes = await api.post('auth/login', body);

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
          console.log('Login - Set accessToken cookie:', {
            hasValue: !!cookieValue,
            valueLength: cookieValue.length,
            path: options.path,
            httpOnly: options.httpOnly,
          });
        }
        if (cookieName === 'refreshToken') {
          cookieStore.set('refreshToken', cookieValue, options);
          console.log('Login - Set refreshToken cookie:', {
            hasValue: !!cookieValue,
            valueLength: cookieValue.length,
            path: options.path,
            httpOnly: options.httpOnly,
          });
        }
      }

      console.log('Login - Returning user data:', apiRes.data);
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
      
      // Try to extract error message from different possible formats
      const errorData = error.response?.data;
      let errorMessage = error.message;
      
      if (errorData) {
        // Try different possible error message fields
        errorMessage = errorData.message || 
                      errorData.error || 
                      errorData.msg ||
                      (typeof errorData === 'string' ? errorData : error.message);
      }
      
      console.log('Login error:', {
        status,
        errorMessage,
        errorData,
      });
      
      // If user not found, try to register automatically
      if (status === 404 || errorMessage?.toLowerCase().includes('not found') || errorMessage?.toLowerCase().includes('user not found')) {
        try {
          console.log('User not found, attempting auto-registration...');
          const registerRes = await api.post('auth/register', body);
          
          const cookieStore = await cookies();
          const setCookie = registerRes.headers['set-cookie'];
          
          if (setCookie) {
            const cookieArray = Array.isArray(setCookie) ? setCookie : [setCookie];
            for (const cookieStr of cookieArray) {
              const parts = cookieStr.split(';');
              const [nameValue] = parts;
              const [cookieName, cookieValue] = nameValue.split('=').map(s => s.trim());
              
              if (!cookieName || !cookieValue) continue;
              
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
          }
          
          console.log('Auto-registration successful, returning user data');
          return NextResponse.json(registerRes.data, { status: registerRes.status });
        } catch (registerError) {
          console.log('Auto-registration failed:', registerError);
          // If registration also fails, return original error
        }
      }
      
      return NextResponse.json(
        { error: errorMessage, response: errorData },
        { status }
      );
    }
    logErrorResponse({ message: (error as Error).message });
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
