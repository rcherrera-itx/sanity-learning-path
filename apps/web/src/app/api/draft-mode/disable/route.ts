import { perspectiveCookieName } from '@sanity/preview-url-secret/constants';
import { draftMode } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    ; (await draftMode()).disable();

    const response = NextResponse.redirect(
        new URL('/', request.url)
    )

    const expired = [
        `${perspectiveCookieName}=`,
        'Path=/',
        'HttpOnly',
        'Secure',
        'SameSite=None',
        'Max-Age=0'
    ];

    response.headers.append('Set-Cookie', expired.join('; '));
    response.headers.append(
        'Set-Cookie',
        [...expired, 'Partitioned'].join('; ')
    );

    return response;
}