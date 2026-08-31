import "server-only";

function requireEnvironmentVariable(name: string): string {
    const value = process.env[name];

    if(!value) {
        throw new Error(`Missing required environment variable ${name}`);
    }

    return value;
}

export const shopifyConfig = {
    storeDomain: requireEnvironmentVariable('SHOPIFY_STORE_DOMAIN'),
    apiVersion: "2026-07",
    privateAccessToken: requireEnvironmentVariable('SHOPIFY_STOREFRONT_ACCESS_TOKEN')
} as const;