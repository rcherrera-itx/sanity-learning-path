import "server-only";
import { sanityFetch } from "./live";
import { productEditorialByHandleQuery } from "./queries";
import type { ProductEditorialByHandleQueryResult } from '../types';
import { getSanityProductCacheTag } from "./cache-tags";

export async function getProductEditorialByHandle(
    handle: string
): Promise<ProductEditorialByHandleQueryResult> {
    "use cache";

    const { data } = await sanityFetch({
        query: productEditorialByHandleQuery,
        params: { handle },
        perspective: "published",
        stega: false,
        tags: [getSanityProductCacheTag(handle)]
    });

    return data;
}
