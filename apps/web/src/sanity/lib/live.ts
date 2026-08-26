import {
    defineLive,
    resolvePerspectiveFromCookies,
    type LivePerspective
} from 'next-sanity/live'

import { client } from './client'
import { cookies, draftMode } from 'next/headers';
import { QueryParams } from 'sanity';

const token = process.env.SANITY_API_READ_TOKEN;

if (!token) {
    throw new Error(
        'Missing environment variable: SANITY_API_READ_TOKEN'
    )
}

export const {
    sanityFetch,
    SanityLive
} = defineLive({
    client,
    serverToken: token,
    browserToken: token,
    strict: true
});

export interface DynamicFethcOptions {
    perspective: LivePerspective,
    stega: boolean
}

export async function getDynamicFetchOptions(): Promise<DynamicFethcOptions> {
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