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
    featuredImage: StorfrontImage | null;
    variants: {
        nodes: storefrontVariant[];
    } | null;
};
type storefrontVariant = {
    id: string;
    title: string;
    sku: string | null;
    availableForSale: boolean;
    price: Price;
    selectedOptions: Array<SelectedOptions>;
}

type SelectedOptions = {
    name: string;
    value: string;
}

type Price = {
    amount: string;
    currencyCode: string;
};

type StorfrontImage = {
    url: string;
    altText: string | null;
    width: number | null;
    height: number | null;
}

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
    const { data, errors, headers } = await storefrontClient.request<ProductByHandleData>(
        PRODUCT_BY_HANDLE_QUERY,
        {
            variables: {
                handle: handle
            },
            headers: buyerIpHeaders
        }
    );

    const variables: ProductByHandleVariables = {
        handle
    };

    const requestedVersion = shopifyConfig.apiVersion;
    const resolvedVersion = headers?.get('x-shopify-api-version')?.toString();

    if (!resolvedVersion) {
        throw new Error(`Shopify did not retun a X-Shopify-API-Version.`);
    }

    if (requestedVersion !== resolvedVersion) {
        throw new Error(`Shopify API version mismatch: requested ${requestedVersion}, ` +
            `resolved. ${resolvedVersion}.`);
    }

    if (errors) {
        const messages = errors.graphQLErrors?.map((error) => error.message).join(" | ");
        throw new Error(
            messages ?? errors.message ?? "Shopify getProductByHandle query failed."
        );
    }

    if (!data?.product) {
        throw new Error(`Shopify product not found: ${handle}`);
    }

    if (!data) {
        throw new Error("Shopify returned an emty ProductByHandle response");
    }

    return data.product;
}
