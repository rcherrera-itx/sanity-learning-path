import "server-only";

import { storefrontClient, getConfigShopifyApiVersion } from "../client";
import { getBuyerIpHeaders } from "../buyer-ip";

const PRODUCT_BY_HANDLE_QUERY = `#graphql
    query ProductByHandle($handle: String!) {
        product(handle: $handle) {
            id
            title
            handle
            description
            availableForSale
            featuredImage {
                url,
                altText,
                width,
                height
            }
            variants(first: 10){
                nodes {
                    id
                    title
                    sku
                    availableForSale
                    price {
                        amount
                        currencyCode
                    }
                    selectedOptions {
                        name
                        value
                    }
                }
            }
        }
    }
`;

export type StorefrontProduct = {
    id: string;
    title: string;
    handle: string;
    description: string;
    availableForSale: boolean;
    featuredImage: Array<{
        url: string;
        altText: string | null;
        width: string | null;
        height: string | null;
    }> | null;
    variants: {
        nodes: Array<{
            id: string;
            title: string;
            sku: string | null;
            availableForSale: boolean;
            price: {
                amount: string;
                currencyCode: string;
            };
            selectedOptions: Array<{
                name: string;
                value: string;
            }>;
        }>;
    } | null;
};

type ProductByHandleData = {
    product: StorefrontProduct | null,
};

export async function getProductByHandle(
    handle: string,
): Promise<StorefrontProduct> {
    const buyerIpHeaders = await getBuyerIpHeaders();
    const { data, errors, headers } = await storefrontClient.request<ProductByHandleData>(
        PRODUCT_BY_HANDLE_QUERY,
        {
            variables: {
                handle,
            },
            headers: buyerIpHeaders
        }
    );

    const shopifyApiVerion = headers?.get('x-shopify-api-version')?.toString();
    const configShopifyApiVersion = getConfigShopifyApiVersion();

    if(!shopifyApiVerion || configShopifyApiVersion !== shopifyApiVerion) {
        throw new Error(`Shopify API VERSIONS does not match: requested ${shopifyApiVerion} | resolved. ${configShopifyApiVersion}`);
    }

    if (errors) {
        throw new Error(`Shopify product query failed: ${JSON.stringify(errors)}`);
    }

    if (!data?.product) {
        throw new Error(`Shopify product not found: ${handle}`);
    }

    return data.product;
}