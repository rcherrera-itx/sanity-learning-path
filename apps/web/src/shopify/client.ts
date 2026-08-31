import "server-only";

import { createStorefrontApiClient } from '@shopify/storefront-api-client';
import { shopifyConfig } from './config';

const storeDomain = shopifyConfig.storeDomain.startsWith('http')
    ? shopifyConfig.storeDomain
    : `https://${shopifyConfig.storeDomain}`;

export const storefrontClient = createStorefrontApiClient({
    storeDomain,
    apiVersion: shopifyConfig.apiVersion,
    privateAccessToken: shopifyConfig.privateAccessToken,
    customFetchApi: fetch,
    clientName: 'sanity-commerce-study',
    retries: 1
});
