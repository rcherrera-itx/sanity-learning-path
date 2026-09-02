import "server-only";

import { shopifyConfig } from "../config";
import type { StorefrontImage } from './product';
import { getShopifyProductCacheTag } from "../cache-tags";

const PRODUCT_CATALOG_BY_HANDLE_QUERY = `#graphql
    query ProductCatalogByHandle($handle: String!) {
        product(handle: $handle) {
            id
            title
            handle
            description
            featuredImage {
                url
                altText
                width
                height
            }
        }
    }

`;

export type StorefrontProductCatalog = {
    id: string;
    title: string;
    handle: string;
    description: string;
    featuredImage: StorefrontImage | null
};

type ProductCatalogByHandleData = {
    product: StorefrontProductCatalog | null;
}

type StorefrontGraphqlResponse<TData> = {
    data?: TData;
    errors?: Array<{
        message: string;
    }>;
};

function getStorefrontApiUrl(): string {
    const storeDomain = shopifyConfig.storeDomain
        .replace(/^https?:\/\//, "")
        .replace(/\/$/, "");

    return `https://${storeDomain}/api/${shopifyConfig.apiVersion}/graphql.json`;
};

export async function getCachedProductCatalogByHandle(
    handle: string
): Promise<StorefrontProductCatalog | null> {
    const response = await fetch(getStorefrontApiUrl(), {
        method: 'POST',
        cache: "force-cache",
        next: {
            revalidate: 60 * 60,
            tags: [getShopifyProductCacheTag(handle)]
        },
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "X-Shopify-Storefront-Access-Token": shopifyConfig.publicAccessToken
        },
        body: JSON.stringify({
            query: PRODUCT_CATALOG_BY_HANDLE_QUERY,
            variables: { handle }
        })
    });

    if (!response.ok) {
        const responseBody = await response.text();
        throw new Error(
            `[SHOPIFY][PRODUCT_CATALOG_BY_HANDLE] HTTP ${response.status}: ` +
            responseBody.slice(0, 1000)
        );
    }

    const resolvedVersion = response.headers.get("x-shopify-api-version");

    if (!resolvedVersion) {
        throw new Error(
            "Shopify did not return the X-Shopify-API-Version header"
        );
    }

    if (resolvedVersion !== shopifyConfig.apiVersion) {
        throw new Error(
            `Shopify API version mismatch: requested ${shopifyConfig.apiVersion}, ` +
            `resolved ${resolvedVersion}.`
        );
    }

    const result = await response.json() as StorefrontGraphqlResponse<ProductCatalogByHandleData>;

    if (result.errors?.length) {
        throw new Error(
            `[SHOPIFY][PRODUCT_CATALOG_BY_HANDLE] GraphQL: ` +
            result.errors.map((error) => error.message).join(" | ")
        );
    }

    if (!result.data) {
        throw new Error(
            "Shopify returned an empty ProductCatalogByHandle response"
        );
    }

    return result.data.product;
}