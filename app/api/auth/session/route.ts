import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { api } from "../../api";
import { parse } from "cookie";
import { isAxiosError } from "axios";
import { logErrorResponse } from "../../_utils/utils";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;
    const refreshToken = cookieStore.get("refreshToken")?.value;

    if (accessToken) {
      return NextResponse.json({ success: true });
    }

    if (refreshToken) {
      // Build Cookie header manually
      const cookieHeader = [
        refreshToken && `refreshToken=${refreshToken}`,
      ]
        .filter(Boolean)
        .join('; ');

      const apiRes = await api.get("auth/session", {
        headers: {
          Cookie: cookieHeader,
        },
      });

      const setCookie = apiRes.headers["set-cookie"];

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
            maxAge: parsed["Max-Age"] ? Number(parsed["Max-Age"]) : undefined,
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
          };

          if (cookieName === 'accessToken') {
            cookieStore.set("accessToken", cookieValue, options);
          }
          if (cookieName === 'refreshToken') {
            cookieStore.set("refreshToken", cookieValue, options);
          }
        }
        return NextResponse.json({ success: true }, { status: 200 });
      }
    }
    return NextResponse.json({ success: false }, { status: 200 });
  } catch (error) {
    if (isAxiosError(error)) {
      logErrorResponse(error.response?.data);
      return NextResponse.json({ success: false }, { status: 200 });
    }
    logErrorResponse({ message: (error as Error).message });
    return NextResponse.json({ success: false }, { status: 200 });
  }
}
