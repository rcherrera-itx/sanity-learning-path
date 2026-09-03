import "server-only";
import { sanityFetch, type DynamicFetchOptions } from "./live";
import { productEditorialByHandleQuery } from "./queries";
import type { ProductEditorialByHandleQueryResult } from '../types';
import { getSanityProductCacheTag } from "./cache-tags";

export async function getProductEditorialByHandle(
    handle: string,
    {
        perspective,
        stega
    }: DynamicFetchOptions
): Promise<ProductEditorialByHandleQueryResult> {
    "use cache";

    const { data } = await sanityFetch({
        query: productEditorialByHandleQuery,
        params: { handle },
        perspective,
        stega,
        tags: [getSanityProductCacheTag(handle)]
    });

    return data;
}
