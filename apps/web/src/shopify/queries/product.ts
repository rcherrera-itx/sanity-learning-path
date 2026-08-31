import "server-only";

import { storefrontClient } from "../client";
import { getBuyerIpHeaders } from "../buyer-ip";
import { shopifyConfig } from "../config";

const PRODUCT_BY_HANDLE_QUERY = `#graphql
    query ProductByHandle($handle: String!) {
        product(handle: $handle) {
            id
            title
            handle
            description
            availableForSale
            featuredImage {
                url
                altText
                width
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
    featuredImage: StorefrontImage | null;
    variants: {
        nodes: StorefrontVariant[];
    };
};

type StorefrontVariant = {
    id: string;
    title: string;
    sku: string | null;
    availableForSale: boolean;
    price: Money;
    selectedOptions: SelectedOption[];
};

export type SelectedOption = {
    name: string;
    value: string;
};

export type Money = {
    amount: string;
    currencyCode: string;
};

export type StorefrontImage = {
    url: string;
    altText: string | null;
    width: number | null;
    height: number | null;
};

type ProductByHandleData = {
    product: StorefrontProduct | null,
};

type ProductByHandleVariables = {
    handle: string;
};

export async function getProductByHandle(
    handle: string,
): Promise<StorefrontProduct | null> {
    const buyerIpHeaders = await getBuyerIpHeaders();
    const variables: ProductByHandleVariables = {
        handle
    };

    const { data, errors, headers } = await storefrontClient.request<ProductByHandleData>(
        PRODUCT_BY_HANDLE_QUERY,
        {
            // variables: variables, (FOR STUDY HISTORICAL REFERENCE)
            variables,
            headers: buyerIpHeaders
        }
    );

    if (errors) {
        const messages = errors.graphQLErrors?.map((error) => error.message).join(" | ");
        const status = errors.networkStatusCode ? `HTTP ${errors.networkStatusCode}` : "HTTP status unavailable.";

        throw new Error(
            `[SHOPIFY][PRODUCT_BY_HANDLE] ${status}: ` +
            (messages || errors.message)
        );
    }

    const requestedVersion = shopifyConfig.apiVersion;
    const resolvedVersion = headers?.get('x-shopify-api-version')?.toString();

    if (!resolvedVersion) {
        throw new Error(`Shopify did not return the X-Shopify-API-Version.`);
    }

    if (resolvedVersion !== requestedVersion) {
        throw new Error(`Shopify API version mismatch: requested ${requestedVersion}, ` +
            `resolved ${resolvedVersion}.`);
    }

    if (!data) {
        throw new Error("Shopify returned an empty ProductByHandle response");
    }

    return data.product;
}
