import { cookies, draftMode } from 'next/headers';
import type { QueryParams } from 'next-sanity';
import {
    defineLive,
    resolvePerspectiveFromCookies,
    type LivePerspective
} from 'next-sanity/live'

import { client } from './client'

const serverToken = process.env.SANITY_API_READ_TOKEN;
const browserToken = process.env.SANITY_API_BROWSER_TOKEN;

if (!serverToken) {
    throw new Error(
        'Missing environment variable: SANITY_API_READ_TOKEN'
    )
}

if (!browserToken) {
    throw new Error(
        'Missing environment variable: SANITY_API_BROWSER_TOKEN'
    )
}

export const {
    sanityFetch,
    SanityLive
} = defineLive({
    client,
    serverToken: serverToken,
    browserToken: browserToken,
    strict: true
});

export interface DynamicFetchOptions {
    perspective: LivePerspective,
    stega: boolean
}

export async function getDynamicFetchOptions(): Promise<DynamicFetchOptions> {
    const { isEnabled: isDraftMode } = await draftMode();

    if (!isDraftMode) {
        return {
            perspective: "published",
            stega: false
        }
    }

    const cookieStore = await cookies();

    const perspective = await resolvePerspectiveFromCookies({
        cookies: cookieStore
    });

    return {
        perspective: perspective ?? "drafts",
        stega: true
    };
}

export async function sanityFetchStaticParams<
    const QueryString extends string
>({
    query,
    params = {}
}: {
    query: QueryString;
    params?: QueryParams
}) {
    "use cache";

    const { data } = await sanityFetch({
        query,
        params,
        perspective: "published",
        stega: false
    });

    return { data };
}