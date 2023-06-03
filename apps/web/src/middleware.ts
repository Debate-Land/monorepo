import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // eslint-disable-next-line turbo/no-undeclared-env-vars
  if (request.nextUrl.hostname.startsWith('staging') && request.cookies.get('auth')?.value !== process.env.STAGING_SECURITY_PASSWORD) {
    console.log("Unauthorized.")
    return NextResponse.json({ error: 'Unauthorized to access staging.' }, { status: 401 });
  }
  return NextResponse.next();
}
